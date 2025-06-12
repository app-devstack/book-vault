import { schema } from "@/db/schema";

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
