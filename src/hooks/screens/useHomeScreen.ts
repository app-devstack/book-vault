import { Book } from '@/db/types';
import { useAppStats } from '@/hooks/queries/useAppStats';
import { useSeriesList } from '@/hooks/queries/useSeriesList';
import { useMemo } from 'react';

export interface SeriesStats {
  volumeCount: number;
  latestVolumeDate?: Date;
}

/**
 * ホーム画面で使用するシリーズ一覧と統計情報を管理するフック
 */
export const useHomeScreen = () => {
  const seriesQuery = useSeriesList();
  const statsQuery = useAppStats();

  const isLoading = seriesQuery.isLoading || statsQuery.isLoading;
  const error = seriesQuery.error || statsQuery.error;

  const getSeriesStats = useMemo(() => {
    return (books: Book[]): SeriesStats => ({
      volumeCount: books.length,
      // latestVolumeDate: books.length > 0 ? books?.reduce((latest, book) => {
      //   const bookDate = new Date(book.createdAt);
      //   return bookDate > latest ? bookDate : latest;
      // }, new Date(0)) : undefined,
      latestVolumeDate: undefined,
    });
  }, []);

  const refetch = () => {
    seriesQuery.refetch();
    statsQuery.refetch();
  };

  return {
    // データ
    seriesedBooks: seriesQuery.data || [],
    totalStats: statsQuery.data
      ? {
          seriesCount: statsQuery.data.totalSeries,
          bookCount: statsQuery.data.totalBooks,
        }
      : { seriesCount: 0, bookCount: 0 },

    // 状態
    isLoading,
    error,

    // アクション
    getSeriesStats,
    refetch,
  };
};
