import { uuidv7 } from '@/lib/uuid';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamp = (name: string) =>
  integer(name, { mode: 'timestamp_ms' })
    .notNull()
    .$default(() => new Date());

// 共通のベーススキーマ
const _schemaBase = {
  id: text()
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
};

// ユーザーマスタ
// export const users = sqliteTable('users', {
//   ..._schemaBase,
//   name: text('name').notNull(),
//   email: text('email').notNull().unique(),
//   emailVerified: integer('email_verified', { mode: 'boolean' })
//     .$defaultFn(() => false)
//     .notNull(),
//   image: text('image'),
// });

// シリーズマスタ
export const series = sqliteTable('series', {
  ..._schemaBase,
  title: text('title').notNull().unique(), // ユニーク制約あり
  author: text('author'), // 作者名
  description: text('description'), // シリーズの概要・あらすじ
  thumbnail: text('thumbnail'), // シリーズ代表画像のURL
  displayOrder: integer('display_order').notNull().default(0), // 表示順序

  googleBooksSeriesId: text('google_books_series_id'), // Google BooksのシリーズID
});

// ショップマスタ
export const shops = sqliteTable('shops', {
  ..._schemaBase,
  name: text('name').notNull().unique(), // ショップ名（ユニーク制約）
  displayName: text('display_name').notNull(), // 表示名
  baseUrl: text('base_url'), // ベースURL
  logoUrl: text('logo_url'), // ロゴ画像URL
  description: text('description'), // ショップ説明
});

// 書籍テーブル
export const books = sqliteTable('books', {
  ..._schemaBase,
  title: text('title').notNull(), // タイトル
  volume: integer('volume'), // 巻数
  imageUrl: text('image_url'), // サムネイル
  targetUrl: text('target_url').notNull(), // pURL
  description: text('description'), // 説明
  isbn: text('isbn'), // ISBN
  author: text('author'), // 作者名
  googleBooksId: text('google_books_id'), // Google Books ID

  purchaseDate: timestamp('purchase_date').notNull(), // 購入日

  seriesId: text('series_id')
    .notNull()
    .references(() => series.id), // シリーズIDへの外部キー
  shopId: text('shop_id')
    .notNull()
    .references(() => shops.id), // 購入ショップIDへの外部キー
});

// リレーション定義
// export const usersRelations = relations(users, ({ many }) => ({
//   books: many(books),
//   series: many(series),
//   shops: many(shops),
// }));

export const seriesRelations = relations(series, ({ many }) => ({
  books: many(books),
}));

export const shopsRelations = relations(shops, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one }) => ({
  series: one(series, {
    fields: [books.seriesId],
    references: [series.id],
  }),
  shop: one(shops, {
    fields: [books.shopId],
    references: [shops.id],
  }),
}));
