import db from "@/db";
import schema from "@/db/schema";
import { BookWithRelations, NewBook } from "@/db/types";
import { createDatabaseError } from "@/types/errors";
import { count, eq, sql } from "drizzle-orm";

class BookService {
  private readonly BOOKS_CACHE_TTL = 5 * 60 * 1000; // 5分
  private booksCache: { data: BookWithRelations[]; timestamp: number } | null = null;

  // キャッシュを無効化
  private invalidateCache() {
    this.booksCache = null;
  }

  // キャッシュが有効かチェック
  private isCacheValid(): boolean {
    if (!this.booksCache) return false;
    return Date.now() - this.booksCache.timestamp < this.BOOKS_CACHE_TTL;
  }

  async getAllBooks(options?: { useCache?: boolean; limit?: number; offset?: number }): Promise<BookWithRelations[]> {
    const { useCache = true, limit, offset } = options || {};

    // キャッシュが有効な場合は使用（ページネーション無しの場合のみ）
    if (useCache && !limit && !offset && this.isCacheValid() && this.booksCache) {
      return this.booksCache.data;
    }

    try {
      const queryBuilder = db.query.books.findMany({
        orderBy: (books, { desc }) => [desc(books.createdAt)],
        with: {
          series: true, // シリーズ情報を含める
          shop: true, // ショップ情報を含める
        },
        limit,
        offset
      });

      const items = await queryBuilder;

      // ページネーション無しの場合のみキャッシュ
      if (!limit && !offset) {
        this.booksCache = {
          data: items,
          timestamp: Date.now()
        };
      }

      return items;
    } catch (error) {
      throw createDatabaseError(
        `Failed to fetch books: ${error}`,
        '書籍データの取得に失敗しました'
      );
    }
  }

  // 統計情報を効率的に取得
  async getBooksStats() {
    try {
      const [totalBooks] = await db
        .select({ count: count() })
        .from(schema.books);

      const [totalSeries] = await db
        .select({ count: count() })
        .from(schema.series);

      return {
        totalBooks: totalBooks.count,
        totalSeries: totalSeries.count
      };
    } catch (error) {
      throw createDatabaseError(
        `Failed to fetch books stats: ${error}`,
        '統計情報の取得に失敗しました'
      );
    }
  }

  async createBook(data: NewBook) {
    try {
      const [item] = await db.insert(schema.books).values(data).returning();

      // 新しい書籍が追加されたらキャッシュを無効化
      this.invalidateCache();

      return item;
    } catch (error) {
      throw createDatabaseError(
        `Failed to create book: ${error}`,
        '書籍の作成に失敗しました'
      );
    }
  }

  async deleteBook(bookId: string) {
    try {
      const [deletedItem] = await db
        .delete(schema.books)
        .where(eq(schema.books.id, bookId))
        .returning();

      // 書籍が削除されたらキャッシュを無効化
      this.invalidateCache();

      return deletedItem;
    } catch (error) {
      throw createDatabaseError(
        `Failed to delete book: ${error}`,
        '書籍の削除に失敗しました'
      );
    }
  }

  // バルク操作用メソッド
  async deleteBooksInBulk(bookIds: string[]) {
    if (bookIds.length === 0) return [];

    try {
      // IN演算子を使用してバルク削除
      const deletedItems = await db
        .delete(schema.books)
        .where(sql`${schema.books.id} IN (${sql.join(bookIds.map(id => sql`${id}`), sql`,`)})`)
        .returning();

      this.invalidateCache();

      return deletedItems;
    } catch (error) {
      throw createDatabaseError(
        `Failed to delete books in bulk: ${error}`,
        '書籍の一括削除に失敗しました'
      );
    }
  }

  // シリーズIDで書籍を効率的に取得
  async getBooksBySeriesId(seriesId: string) {
    try {
      return await db.query.books.findMany({
        where: (books, { eq }) => eq(books.seriesId, seriesId),
        orderBy: (books, { asc, desc }) => [asc(books.volume), desc(books.createdAt)],
        with: {
          shop: true
        }
      });
    } catch (error) {
      throw createDatabaseError(
        `Failed to fetch books by series: ${error}`,
        'シリーズの書籍取得に失敗しました'
      );
    }
  }
}

export const bookService = new BookService();
