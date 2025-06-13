import db from "@/db";
import { books } from "@/db/schema";
import { NewBook } from "@/db/types";
import { eq } from "drizzle-orm";

class BookService {
  // constructor(parameters) {}
  async getAllBooks() {
    const items = await db.query.books.findMany({
      orderBy: (books, { desc }) => [desc(books.createdAt)],
      with: {
        series: true, // シリーズ情報を含める
        shop: true, // ショップ情報を含める
      },
    });
    return items;
  }

  async createBook(data: NewBook) {
    const [item] = await db.insert(books).values(data).returning();

    return item;
  }

  async deleteBook(bookId: string) {
    const [deletedItem] = await db
      .delete(books)
      .where(eq(books.id, bookId))
      .returning();

    return deletedItem;
  }
}

export const bookService = new BookService();
