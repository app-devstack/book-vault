import { bookService } from '@/utils/service/book-service';
import { seriesService } from '@/utils/service/series-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

export interface AppStats {
  totalBooks: number;
  totalSeries: number;
  averageBooksPerSeries: number;
  recentlyAddedCount: number;
}

/**
 * アプリ全体の統計情報（書籍数、シリーズ数等）を取得するフック
 */
export const useAppStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.APP_STATS,
    queryFn: async (): Promise<AppStats> => {
      const [books, series] = await Promise.all([
        bookService.getAllBooks(),
        seriesService.getAllSeries(),
      ]);
      
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentlyAddedCount = books.filter(
        book => new Date(book.createdAt) > oneWeekAgo
      ).length;
      
      return {
        totalBooks: books.length,
        totalSeries: series.length,
        averageBooksPerSeries: series.length > 0 ? Math.round((books.length / series.length) * 10) / 10 : 0,
        recentlyAddedCount,
      };
    },
    ...QUERY_OPTIONS.FREQUENT,
  });
};