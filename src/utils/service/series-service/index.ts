import db from "@/db";
import schema from "@/db/schema";
import { NewSeries } from "@/db/types";
import { createDatabaseError } from "@/types/errors";
import { logError } from "@/utils/errorLogger";

class SeriesService {
  // constructor(parameters) {}
  async getAllSeries() {
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
      where: (series,{eq}) => eq(series.id, seriesId),
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

  async getSeriesByGoogleBooksSeriesId(googleBooksSeriesId: string) {
    // googleBooksSeriesIdで検索
    const item = await db.query.series.findFirst({
      where: (series,{eq}) => eq(series.googleBooksSeriesId, googleBooksSeriesId),
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

  async createSeries(data:NewSeries) {
    try {
      const [item] = await db.insert(schema.series).values(data).returning();
      return item;
    } catch (error) {
      await logError(error as Error, 'CREATE_SERIES');
      const dbError = createDatabaseError(
        `Failed to create series: ${error}`,
        'シリーズの作成に失敗しました'
      );
      throw dbError;
    }
  }

  async getAllSeriesWithBooks() {
    const items = await db.query.series.findMany({
      orderBy: (series, { desc }) => [desc(series.updatedAt)],
      with: {
        books: {
          orderBy: (books, { desc }) => [
            desc(books.volume),
            desc(books.createdAt),
          ],
        },
      },
    });
    return items;
  }

  async getSeriesWithBooks(seriesId: string) {
    const item = await db.query.series.findFirst({
      where: (series, { eq }) => eq(series.id, seriesId),
      with: {
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

  async getSeriesOptions() {
    const items = await db.query.series.findMany({
      orderBy: (series, { asc }) => [asc(series.title)],
      columns: {
        id: true,
        title: true,
        author: true,
      },
      with: {
        books: {
          columns: {
            id: true,
          },
        },
      },
    });

    return items.map(series => ({
      id: series.id,
      title: series.title,
      author: series.author,
      bookCount: series.books.length,
    }));
  }
}

export const seriesService = new SeriesService();
