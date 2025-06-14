import { BookWithRelations, Series } from "@/db/types";
import { bookService } from "@/utils/service/book-service";
import { useCallback, useState } from "react";

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


  return {
    books,
    setBooks,
    emptySeries,
    setEmptySeries,
    initializeBooks,
  };
};