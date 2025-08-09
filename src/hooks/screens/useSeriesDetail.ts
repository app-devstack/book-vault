import { Book } from '@/db/types';
import { useDeleteBook } from '@/hooks/mutations/useDeleteBook';
import { useSeriesDetail as useSeriesDetailQuery } from '@/hooks/queries/useSeriesDetail';
import { useMemo } from 'react';

export interface SeriesDetailStats {
  volumeCount: number;
  latestVolume?: Book;
}

/**
 * シリーズ詳細画面で使用するシリーズ情報と書籍操作を管理するフック
 */
export const useSeriesDetail = (seriesId: string) => {
  const seriesDetailQuery = useSeriesDetailQuery(seriesId);
  const deleteBookMutation = useDeleteBook();

  const series = seriesDetailQuery.data;

  const books = useMemo(() => series?.books || [], [series?.books]);

  const deleteBook = async (bookId: string) => {
    await deleteBookMutation.mutateAsync(bookId);
  };

  return {
    // データ
    series,
    books,

    // 状態
    isLoading: seriesDetailQuery.isLoading,
    error: seriesDetailQuery.error,

    // アクション
    deleteBook,
    isDeleting: deleteBookMutation.isPending,
    refetch: seriesDetailQuery.refetch,
  };
};
