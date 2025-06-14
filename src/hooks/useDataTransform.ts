import { Book, BookWithRelations, Series, SeriesWithBooks } from "@/db/types";
import { SeriesStats } from "@/types/book";
import { useMemo } from "react";

interface UseDataTransformProps {
  books: BookWithRelations[];
  emptySeries: Series[];
  loading: { initialize: boolean };
}

export const useDataTransform = ({
  books,
  emptySeries,
  loading,
}: UseDataTransformProps) => {
  // パフォーマンス最適化：booksの変更時のみ再計算
  const seriesedBooks: SeriesWithBooks[] = useMemo(() => {
    if (loading.initialize || books.length === 0) {
      return [];
    }

    const seriesMap = new Map<string, SeriesWithBooks>();

    // 本が関連付けられているシリーズを効率的に処理
    for (const book of books) {
      if (!book.series?.id) continue;

      const seriesId = book.series.id;
      const existingSeries = seriesMap.get(seriesId);

      if (existingSeries) {
        existingSeries.books.push(book);
      } else {
        seriesMap.set(seriesId, {
          ...book.series,
          books: [book],
        } satisfies SeriesWithBooks);
      }
    }

    // 空のシリーズを効率的に処理
    for (const series of emptySeries) {
      if (!seriesMap.has(series.id)) {
        seriesMap.set(series.id, {
          ...series,
          books: [],
        } satisfies SeriesWithBooks);
      }
    }

    return Array.from(seriesMap.values());
  }, [books, emptySeries, loading.initialize]);

  const getSeriesStats = useMemo(() => {
    return (seriesBooks: Book[]): SeriesStats => ({
      volumeCount: seriesBooks.length,
    } satisfies SeriesStats);
  }, []);

  const totalStats = useMemo(() => ({
    seriesCount: seriesedBooks.length,
    bookCount: books.length,
  }), [books, seriesedBooks]);

  return {
    seriesedBooks,
    getSeriesStats,
    totalStats,
  };
};