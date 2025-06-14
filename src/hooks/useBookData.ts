import { Book, BookWithRelations, Series, SeriesWithBooks } from "@/db/types";
import { SeriesStats } from "@/types/book";
import { bookService } from "@/utils/service/book-service";
import { useCallback, useMemo, useState } from "react";

interface UseBookDataProps {
  withLoadingState: <T>(operation: 'initialize', asyncFn: () => Promise<T>) => Promise<T>;
  handleError: (error: unknown, operation: string) => { shouldRetry: boolean; error: any };
  retryCount: number;
  setRetryCount: (count: number | ((prev: number) => number)) => void;
  loading: { initialize: boolean };
}

export const useBookData = ({
  withLoadingState,
  handleError,
  retryCount,
  setRetryCount,
  loading,
}: UseBookDataProps) => {
  const [books, setBooks] = useState<BookWithRelations[]>([]);
  const [emptySeries, setEmptySeries] = useState<Series[]>([]);

  const initializeBooks = useCallback(async (forceRetry = false) => {
    if (!forceRetry && retryCount >= 3) {
      return;
    }

    return withLoadingState('initialize', async () => {
      try {
        const initialBooks = await bookService.getAllBooks();
        setBooks(initialBooks);
        setRetryCount(0); // 成功時はリトライカウントをリセット
      } catch (error) {
        const { shouldRetry } = handleError(error, '書籍データの初期化');

        if (shouldRetry && retryCount < 3) {
          // 1秒後に再試行
          setTimeout(() => {
            initializeBooks(true);
          }, 1000 * Math.pow(2, retryCount)); // 指数バックオフ
        }
        throw error;
      }
    });
  }, [withLoadingState, handleError, retryCount, setRetryCount]);

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
        });
      }
    }

    // 空のシリーズを効率的に処理
    for (const series of emptySeries) {
      if (!seriesMap.has(series.id)) {
        seriesMap.set(series.id, {
          ...series,
          books: [],
        });
      }
    }

    return Array.from(seriesMap.values());
  }, [books, emptySeries, loading.initialize]);

  const getSeriesStats = useCallback((seriesBooks: Book[]): SeriesStats => {
    return {
      volumeCount: seriesBooks.length,
    };
  }, []);

  const totalStats = useMemo(() => {
    return {
      seriesCount: seriesedBooks.length,
      bookCount: books.length,
    };
  }, [books, seriesedBooks]);

  return {
    books,
    setBooks,
    emptySeries,
    setEmptySeries,
    seriesedBooks,
    totalStats,
    initializeBooks,
    getSeriesStats,
  };
};