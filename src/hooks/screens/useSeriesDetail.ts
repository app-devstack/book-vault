import { useSeriesDetail as useSeriesDetailQuery } from '@/hooks/queries/useSeriesDetail';
import { useDeleteBook } from '@/hooks/mutations/useDeleteBook';
import { Book } from '@/db/types';
import { useMemo } from 'react';

export interface SeriesDetailStats {
  volumeCount: number;
  latestVolume?: Book;
  totalPages: number;
}

/**
 * シリーズ詳細画面で使用するシリーズ情報と書籍操作を管理するフック
 */
export const useSeriesDetail = (seriesId: string) => {
  const seriesDetailQuery = useSeriesDetailQuery(seriesId);
  const deleteBookMutation = useDeleteBook();
  
  const series = seriesDetailQuery.data;
  const books = series?.books || [];
  
  const stats = useMemo((): SeriesDetailStats => ({
    volumeCount: books.length,
    latestVolume: books.reduce((latest, book) => {
      return book.volume && book.volume > (latest?.volume || 0) ? book : latest;
    }, books[0]),
    totalPages: books.reduce((sum, book) => sum + 0, 0), // pageCountフィールドがない場合は0
  }), [books]);
  
  const deleteBook = async (bookId: string) => {
    await deleteBookMutation.mutateAsync(bookId);
  };
  
  return {
    // データ
    series,
    books,
    stats,
    
    // 状態
    isLoading: seriesDetailQuery.isLoading,
    error: seriesDetailQuery.error,
    
    // アクション
    deleteBook,
    isDeleting: deleteBookMutation.isPending,
    refetch: seriesDetailQuery.refetch,
  };
};