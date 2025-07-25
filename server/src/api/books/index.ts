import { options } from '@/db';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app
  .get('/', async (c) => {
    try {
      const db = drizzle(c.env.DB, options);

      const data = await db.query.books.findMany();
      return c.json({ data: data });
    } catch (error) {
      return c.json({ error: error + '' }, 500);
    }
  })
  .post('/', (c) => {
    return c.json({ message: 'Book created successfully!' });
  });

export default app;
