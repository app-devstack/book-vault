import db from '@/db';
import schema from '@/db/schema';
import { NewSeries } from '@/db/types';
import { createDatabaseError } from '@/types/errors';
import { eq } from 'drizzle-orm';

class SeriesService {
  // constructor(parameters) {}
  async getAllSeries() {
    const items = await db.query.series.findMany({
      orderBy: (series, { asc, desc }) => [asc(series.displayOrder), desc(series.createdAt)],
      with: {
        books: true, // シリーズに関連する書籍情報を含める
      },
    });
    return items;
  }

  async getSeriesById(seriesId: string) {
    const item = await db.query.series.findFirst({
      where: (series, { eq }) => eq(series.id, seriesId),
      with: {
        // シリーズに関連する書籍情報を含める
        books: {
          orderBy: (books, { desc }) => [desc(books.volume), desc(books.createdAt)],
        },
      },
    });
    return item;
  }

  async getSeriesByGoogleBooksSeriesId(googleBooksSeriesId: string) {
    // googleBooksSeriesIdで検索
    const item = await db.query.series.findFirst({
      where: (series, { eq }) => eq(series.googleBooksSeriesId, googleBooksSeriesId),
      with: {
        // シリーズに関連する書籍情報を含める
        books: {
          orderBy: (books, { desc }) => [desc(books.volume), desc(books.createdAt)],
        },
      },
    });
    return item;
  }

  // async getSeriesByTitle(title: string) {
  //   const item = await db.query.series.findFirst({
  //     where: (series, { eq }) => eq(series.title, title),
  //     with: {
  //       books: {
  //         orderBy: (books, { desc }) => [desc(books.volume), desc(books.createdAt)],
  //       },
  //     },
  //   });
  //   return item;
  // }

  async getSeriesByTitleAndAuthor(title: string, author: string) {
    const item = await db.query.series.findFirst({
      where: (series, { eq, and }) => and(eq(series.title, title), eq(series.author, author)),
      with: {
        books: {
          orderBy: (books, { desc }) => [desc(books.volume), desc(books.createdAt)],
        },
      },
    });
    return item;
  }

  async createSeries(data: NewSeries) {
    try {
      const [item] = await db.insert(schema.series).values(data).returning();
      return item;
    } catch (error) {
      // await logError(error as Error, 'CREATE_SERIES');
      const dbError = createDatabaseError(
        `Failed to create series: ${error}`,
        'シリーズの作成に失敗しました'
      );
      throw dbError;
    }
  }

  async getAllSeriesWithBooks() {
    const items = await db.query.series.findMany({
      orderBy: (series, { asc, desc }) => [asc(series.displayOrder), desc(series.createdAt)],
      with: {
        books: {
          orderBy: (books, { desc }) => [desc(books.volume), desc(books.createdAt)],
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
          orderBy: (books, { desc }) => [desc(books.volume), desc(books.createdAt)],
        },
      },
    });
    return item;
  }

  async updateSeries(seriesId: string, updates: Partial<NewSeries>) {
    try {
      // タイトルがある場合はトリムする
      const sanitizedUpdates = {
        ...updates,
        ...(updates.title && { title: updates.title.trim() }),
        updatedAt: new Date(),
      };

      const [updatedSeries] = await db
        .update(schema.series)
        .set(sanitizedUpdates)
        .where(eq(schema.series.id, seriesId))
        .returning();

      return updatedSeries;
    } catch (error) {
      const dbError = createDatabaseError(
        `Failed to update series: ${error}`,
        'シリーズの更新に失敗しました'
      );
      throw dbError;
    }
  }

  async deleteSeries(seriesId: string) {
    try {
      // シリーズに関連する書籍も一緒に削除される（ON DELETE CASCADE）
      await db.delete(schema.series).where(eq(schema.series.id, seriesId));
      return true;
    } catch (error) {
      const dbError = createDatabaseError(
        `Failed to delete series: ${error}`,
        'シリーズの削除に失敗しました'
      );
      throw dbError;
    }
  }

  /**
   * シリーズの表示順序を更新する
   */
  async updateSeriesDisplayOrder(updatedSeries: { id: string; displayOrder: number }[]) {
    try {
      console.log('updateSeriesDisplayOrder called with:', updatedSeries);

      if (updatedSeries.length === 0) {
        console.log('No series to update, returning early');
        return;
      }

      // 各シリーズの表示順序を個別に更新（シンプル実装）
      for (const { id, displayOrder } of updatedSeries) {
        console.log(`Updating series ${id} to displayOrder ${displayOrder}`);
        await db
          .update(schema.series)
          .set({
            displayOrder,
            // updatedAt: new Date(),
          })
          .where(eq(schema.series.id, id));
      }

      console.log('All series display orders updated successfully');
      return true;
    } catch (error) {
      const dbError = createDatabaseError(
        `Failed to update series display order: ${error}`,
        'シリーズ表示順序の更新に失敗しました'
      );
      throw dbError;
    }
  }
}

export const seriesService = new SeriesService();
