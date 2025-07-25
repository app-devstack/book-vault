import { options } from '@/db';
import schema from '@/db/schema';
import { bookInsertSchema, seriesInsertSchema, shopInsertSchema } from '@/db/types';
import { zValidator } from '@hono/zod-validator';
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const backupSchema = z.object({
  userId: z.string(),
  books: bookInsertSchema.array().optional(),
  series: seriesInsertSchema.array().optional(),
  shops: shopInsertSchema.array().optional(),
});

type BackupData = z.infer<typeof backupSchema>;

app
  .get('/', async (c) => {
    try {
      const db = drizzle(c.env.DB, options);

      const [users, books, series, shops] = await db.batch([
        db.query.users.findMany(),
        db.query.books.findMany(),
        db.query.series.findMany(),
        db.query.shops.findMany(),
      ]);

      const data = {
        users: users,
        books: books,
        series: series,
        shops: shops,
      };

      return c.json({ data: data });
    } catch (error) {
      return c.json({ error: error + '' }, 500);
    }
  })
  .post('/', zValidator('json', backupSchema), async (c) => {
    try {
      console.log('`/api/backup`にアクセスしました｡');

      const data = c.req.valid('json');
      const db = drizzle(c.env.DB, options);

      console.log('受け取ったデータ:', data);

      const { userId, books = [], series = [], shops = [] } = data;

      if (!userId) {
        return c.json(
          { success: false, error: 'Invalid data provided. `userId` is required.' },
          400
        );
      }

      /*
        D1でトランザクションは使えないらしい。
        ``` ts
          db.batch([
            db.insert(schema.series).values(series),
            db.insert(schema.shops).values(shops),
            db.insert(schema.books).values(books),
          ])
        ```
        みたいな感じでできるらしい。
       */

      // await db.insert(schema.series).values(series);
      await insertSeries(db, series);
      console.log('シリーズの登録完了');

      await insertShops(db, shops);
      // await db.insert(schema.shops).values(shops);
      console.log('ショップの登録完了');

      await insertBooks(db, books);
      console.log('全てのデータの登録が完了しました｡');

      return c.json({
        success: true,
        message: 'Backup created successfully!',
        data: data,
      });
    } catch (error) {
      console.error(error + '');
      return c.json(
        {
          success: false,
          error: 'Failed to create backup: ' + error,
        },
        500
      );
    }
  });

export default app;

const insertSeries = async (db: DrizzleD1Database<typeof schema>, series: BackupData['series']) => {
  if (!series || series.length === 0) return;
  for (const serie of series) {
    await db
      .insert(schema.series)
      .values(serie)
      .onConflictDoUpdate({
        target: schema.series.id,
        set: { ...serie },
      });
    console.log(`シリーズの登録完了: ${serie.title}`);
  }
};

const insertShops = async (db: DrizzleD1Database<typeof schema>, shops: BackupData['shops']) => {
  if (!shops || shops.length === 0) return;
  for (const shop of shops) {
    await db
      .insert(schema.shops)
      .values(shop)
      .onConflictDoUpdate({
        target: schema.shops.id,
        set: { ...shop },
      });
    console.log(`ショップの登録完了: ${shop.name}`);
  }
};

const insertBooks = async (db: DrizzleD1Database<typeof schema>, books: BackupData['books']) => {
  if (!books || books.length === 0) return;

  for (const book of books) {
    const seriesId = book.seriesId;

    const seriesExists = await db.query.series.findFirst({
      where: (series, { eq }) => eq(series.id, seriesId),
    });

    if (!seriesExists) {
      console.error(`Series with ID ${seriesId} does not exist.`);
      continue;
    }

    const { id, ...updateData } = book;

    await db
      .insert(schema.books)
      .values(book)
      .onConflictDoUpdate({
        target: schema.books.id,
        set: { ...updateData },
      });
    console.log(`本の登録完了: ${book.title}`);
  }
};
