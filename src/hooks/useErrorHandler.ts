import { BookError, BookVaultError } from "@/types/errors";
import { useCallback, useState } from "react";

export const useErrorHandler = () => {
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

  return {
    error,
    retryCount,
    clearError,
    handleError,
    setRetryCount,
  };
};