import db from "@/db";
import schema from "@/db/schema";
import { NewSeries } from "@/db/types";

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
    const [item] = await db.insert(schema.series).values(data).returning();

    return item;
  }
}

export const seriesService = new SeriesService();
