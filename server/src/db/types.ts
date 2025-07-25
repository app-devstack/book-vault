import schema from '@/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const userSelectSchema = createSelectSchema(schema.users);
export const userInsertSchema = createInsertSchema(schema.users);

export const seriesSelectSchema = createSelectSchema(schema.series);
export const seriesInsertSchema = createInsertSchema(schema.series, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const shopSelectSchema = createSelectSchema(schema.shops);
export const shopInsertSchema = createInsertSchema(schema.shops, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const bookSelectSchema = createSelectSchema(schema.books);
export const bookInsertSchema = createInsertSchema(schema.books, {
  volume: z.coerce.number().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  purchaseDate: z.coerce.date(),
});

export type Series = typeof schema.series.$inferSelect;
export type NewSeries = typeof schema.series.$inferInsert;

export type Shop = typeof schema.shops.$inferSelect;
export type NewShop = typeof schema.shops.$inferInsert;

export type Book = typeof schema.books.$inferSelect;
export type NewBook = typeof schema.books.$inferInsert;

export type SeriesWithBooks = Series & {
  books: Book[];
};

export type BookWithSeries = Book & {
  series: Series | undefined;
};

export type BookWithShop = Book & {
  shop: Shop | undefined;
};

export type BookWithRelations = Book & {
  series: Series | undefined;
  shop: Shop | undefined;
};
