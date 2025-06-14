import { createConstate } from "@/components/providers/utils/constate";
import { Book, BookWithRelations, NewBook, NewSeries, Series, SeriesWithBooks } from "@/db/types";
import { SeriesStats } from "@/types/book";
import { BookError, BookVaultError } from "@/types/errors";
import { EMPTY_SERIES_ID } from "@/utils/constants";
import { bookService } from "@/utils/service/book-service";
import { seriesService } from "@/utils/service/series-service";
import { extractByMultipleSpaces } from "@/utils/text";
import { useCallback, useEffect, useMemo, useState } from "react";

 const useBooks = () => {
  const [books, setBooks] = useState<BookWithRelations[]>([]);
  const [emptySeries, setEmptySeries] = useState<Series[]>([]); // 本が関連付けられていないシリーズ
  const [loading, setLoading] = useState({
    initialize: false,
    addBook: false,
    removeBook: false,
    createSeries: false
  });
  const [error, setError] = useState<BookError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const handleError = useCallback((error: unknown, operation: string, maxRetries = 3) => {
    const bookError = BookVaultError.fromError(error, `${operation}中にエラーが発生しました`);

    console.error(`Error in ${operation}:`, {
      type: bookError.type,
      code: bookError.code,
      message: bookError.message,
      userMessage: bookError.userMessage
    });

    // リトライ可能なエラーの場合、再試行カウントをチェック
    if (bookError.retryable && retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      return { shouldRetry: true, error: bookError };
    }

    setError(bookError.toBookError());
    return { shouldRetry: false, error: bookError };
  }, [retryCount]);

  const withLoadingState = useCallback(<T,>(
    operation: keyof typeof loading,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    return new Promise(async (resolve, reject) => {
      setLoading(prev => ({ ...prev, [operation]: true }));
      clearError();

      try {
        const result = await asyncFn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        setLoading(prev => ({ ...prev, [operation]: false }));
      }
    });
  }, [clearError]);

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
  }, [withLoadingState, handleError, retryCount]);

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

  const addBook = useCallback(async (bookData: NewBook) => {
    return withLoadingState('addBook', async () => {
      try {
        const { seriesId } = bookData;

        let series: Series | undefined = await seriesService.getSeriesById(seriesId);

        if (!series) {
          series = await seriesService.createSeries({
            title: extractByMultipleSpaces(bookData.title),
            author: bookData.author,
            googleBooksSeriesId: seriesId,
          });
        }

        const newBook = await bookService.createBook({ ...bookData, seriesId: series?.id || EMPTY_SERIES_ID });

        const bookWithRelations: BookWithRelations = {
          ...newBook,
          series,
          shop: undefined,
        };

        setBooks((prev) => [...prev, bookWithRelations]);

        // もしこの本が空のシリーズに関連付けられている場合、空のシリーズリストから削除
        setEmptySeries((prev) => prev.filter((s) => s.id !== series?.id));
      } catch (error) {
        handleError(error, '書籍の追加');
        throw error;
      }
    });
  }, [withLoadingState, handleError]);

  const removeBook = useCallback(async (bookId: string) => {
    return withLoadingState('removeBook', async () => {
      try {
        await bookService.deleteBook(bookId);
        setBooks((prev) => prev.filter((book) => book.id !== bookId));
      } catch (error) {
        handleError(error, '書籍の削除');
        throw error;
      }
    });
  }, [withLoadingState, handleError]);

  const removeSeries = useCallback((seriesTitle: string) => {
    setBooks((prev) => prev.filter((book) => book.series?.title !== seriesTitle));
  }, []);

  const createSeries = useCallback(async (seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return withLoadingState('createSeries', async () => {
      try {
        const newSeries = await seriesService.createSeries(seriesData);
        // 新しく作成されたシリーズを空のシリーズリストに追加
        setEmptySeries((prev) => [...prev, newSeries]);
        return newSeries.id;
      } catch (error) {
        handleError(error, 'シリーズの作成');
        throw error;
      }
    });
  }, [withLoadingState, handleError]);

  const totalStats = useMemo(() => {
    return {
      seriesCount: seriesedBooks.length,
      bookCount: books.length,
    };
  }, [books, seriesedBooks]);

  return {
    // Data
    books,
    seriesedBooks,
    totalStats,

    // Loading states
    loading,

    // Error handling
    error,
    clearError,

    // Actions
    initializeBooks,
    addBook,
    removeBook,
    removeSeries,
    createSeries,
    getSeriesStats,
  };
};


function useBooksProvider() {
  const booksData = useBooks();

  useEffect(() => {
    (async () => {
      console.log("DB Migration executed successfully");
      await booksData.initializeBooks();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return booksData;
}

const booksConstate = createConstate(useBooksProvider);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  return (
    <booksConstate.Provider>
      {children}
    </booksConstate.Provider>
  )
}
export const useBooksContext = booksConstate.useContextValue;
