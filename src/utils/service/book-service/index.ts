import db from "@/db";
import { book } from "@/db/schema";
import { BookInsert } from "@/utils/service/book-service/types";

class BookService {
  // constructor(parameters) {}

  async createBook(data: BookInsert) {
    await db.insert(book).values(data);
  }
}

export const bookService = new BookService();
