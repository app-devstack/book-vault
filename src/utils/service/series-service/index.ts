import db from "@/db";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";

class SeriesService {
  // constructor(parameters) {}
  async getAllBooks() {
    const items = await db.query.series.findMany({
      orderBy: (series, { desc }) => [desc(series.createdAt)],
      with: {
        books: true, // シリーズに関連する書籍情報を含める
      },
    });
    return items;
  }

  async getSeriesById(seriesId: string) {
    const item = await db.query.series.findFirst({
      where: eq(books.id, seriesId),
      with: {
        // シリーズに関連する書籍情報を含める
        books: {
          orderBy: (books, { desc }) => [
            desc(books.volume),
            desc(books.createdAt),
          ],
        },
      },
    });
    return item;
  }

  // async createBook(data: NewBook) {
  //   const [item] = await db.insert(books).values(data).returning();

  //   return item;
  // }

  // async deleteBook(bookId: string) {
  //   const [deletedItem] = await db
  //     .delete(books)
  //     .where(eq(books.id, bookId))
  //     .returning();

  //   return deletedItem;
  // }
}

export const seriesService = new SeriesService();
