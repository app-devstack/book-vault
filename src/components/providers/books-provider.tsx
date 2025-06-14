import { createConstate } from "@/components/providers/utils/constate";
import { Book, BookWithRelations, NewBook, NewSeries, Series, SeriesWithBooks } from "@/db/types";
import { SeriesStats } from "@/types/book";
import { BookError, BookVaultError } from "@/types/errors";
// import { BooksContextValue } from "@/types/provider.types";
import { showBookDeleteConfirmation, showSeriesDeleteConfirmation, showBulkDeleteConfirmation } from "@/components/ui/ConfirmationDialog";
import { useUndo } from "@/hooks/useUndo";
import { EMPTY_SERIES_ID } from "@/utils/constants";
import { bookService } from "@/utils/service/book-service";
import { seriesService } from "@/utils/service/series-service";
import { extractByMultipleSpaces } from "@/utils/text";
import { validateBookOrThrow, validateSeriesOrThrow } from "@/utils/validation";
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
  
  // アンドゥ機能
  const { addUndoAction, executeUndo, canUndo, isUndoing, clearUndoStack } = useUndo();

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
        // データ検証とサニタイゼーション
        const validatedBookData = validateBookOrThrow(bookData);
        
        const { seriesId } = validatedBookData;

        let series: Series | undefined = await seriesService.getSeriesById(seriesId);

        if (!series) {
          series = await seriesService.createSeries({
            title: extractByMultipleSpaces(validatedBookData.title),
            author: validatedBookData.author,
            googleBooksSeriesId: seriesId,
          });
        }

        const newBook = await bookService.createBook({ ...validatedBookData, seriesId: series?.id || EMPTY_SERIES_ID });

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

  const removeBook = useCallback(async (bookId: string, options?: { skipConfirmation?: boolean }) => {
    const { skipConfirmation = false } = options || {};
    
    const bookToDelete = books.find(book => book.id === bookId);
    if (!bookToDelete) {
      throw new Error('削除対象の書籍が見つかりません');
    }

    const executeDelete = () => {
      return withLoadingState('removeBook', async () => {
        try {
          await bookService.deleteBook(bookId);
          setBooks((prev) => prev.filter((book) => book.id !== bookId));
          
          // アンドゥアクションを追加
          addUndoAction({
            type: 'delete_book',
            description: `「${bookToDelete.title}」を削除しました`,
            data: bookToDelete,
            undo: async () => {
              // 書籍を復元するための処理
              const restoredBook = await bookService.createBook({
                title: bookToDelete.title,
                volume: bookToDelete.volume,
                imageUrl: bookToDelete.imageUrl,
                targetUrl: bookToDelete.targetUrl,
                description: bookToDelete.description,
                isbn: bookToDelete.isbn,
                author: bookToDelete.author,
                googleBooksId: bookToDelete.googleBooksId,
                purchaseDate: bookToDelete.purchaseDate,
                seriesId: bookToDelete.seriesId,
                shopId: bookToDelete.shopId
              });
              
              const bookWithRelations: BookWithRelations = {
                ...restoredBook,
                series: bookToDelete.series,
                shop: bookToDelete.shop
              };
              
              setBooks((prev) => [...prev, bookWithRelations]);
            }
          });
        } catch (error) {
          handleError(error, '書籍の削除');
          throw error;
        }
      });
    };

    if (skipConfirmation) {
      return executeDelete();
    }

    // 削除確認ダイアログを表示
    showBookDeleteConfirmation(
      bookToDelete.title,
      bookToDelete.series?.title,
      executeDelete
    );
  }, [books, withLoadingState, handleError, addUndoAction]);

  const removeSeries = useCallback((seriesTitle: string, options?: { skipConfirmation?: boolean }) => {
    const { skipConfirmation = false } = options || {};
    
    const booksInSeries = books.filter(book => book.series?.title === seriesTitle);
    
    const executeDelete = () => {
      setBooks((prev) => prev.filter((book) => book.series?.title !== seriesTitle));
    };

    if (skipConfirmation) {
      executeDelete();
      return;
    }

    // シリーズ削除確認ダイアログを表示
    showSeriesDeleteConfirmation(
      seriesTitle,
      booksInSeries.length,
      executeDelete
    );
  }, [books]);

  const createSeries = useCallback(async (seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return withLoadingState('createSeries', async () => {
      try {
        // データ検証とサニタイゼーション
        const validatedSeriesData = validateSeriesOrThrow(seriesData);
        
        const newSeries = await seriesService.createSeries(validatedSeriesData);
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

  // 一括操作機能
  const removeBooksInBulk = useCallback(async (bookIds: string[], options?: { skipConfirmation?: boolean }) => {
    const { skipConfirmation = false } = options || {};
    
    if (bookIds.length === 0) return;
    
    const executeDelete = async () => {
      return withLoadingState('removeBook', async () => {
        try {
          // 削除前に対象書籍の情報を保存
          const booksToDelete = books.filter(book => bookIds.includes(book.id));
          
          await bookService.deleteBooksInBulk(bookIds);
          setBooks((prev) => prev.filter((book) => !bookIds.includes(book.id)));
          
          // アンドゥアクションを追加
          addUndoAction({
            type: 'bulk_delete',
            description: `${bookIds.length}冊の書籍を削除しました`,
            data: booksToDelete,
            undo: async () => {
              // 削除された書籍を一括復元
              const restorePromises = booksToDelete.map(async (bookToRestore) => {
                const restoredBook = await bookService.createBook({
                  title: bookToRestore.title,
                  volume: bookToRestore.volume,
                  imageUrl: bookToRestore.imageUrl,
                  targetUrl: bookToRestore.targetUrl,
                  description: bookToRestore.description,
                  isbn: bookToRestore.isbn,
                  author: bookToRestore.author,
                  googleBooksId: bookToRestore.googleBooksId,
                  purchaseDate: bookToRestore.purchaseDate,
                  seriesId: bookToRestore.seriesId,
                  shopId: bookToRestore.shopId
                });
                
                return {
                  ...restoredBook,
                  series: bookToRestore.series,
                  shop: bookToRestore.shop
                } as BookWithRelations;
              });
              
              const restoredBooks = await Promise.all(restorePromises);
              setBooks((prev) => [...prev, ...restoredBooks]);
            }
          });
        } catch (error) {
          handleError(error, '書籍の一括削除');
          throw error;
        }
      });
    };

    if (skipConfirmation) {
      return executeDelete();
    }

    // 一括削除確認ダイアログを表示
    showBulkDeleteConfirmation(
      bookIds.length,
      '書籍',
      executeDelete
    );
  }, [withLoadingState, handleError, addUndoAction, books]);

  const updateBooksInBulk = useCallback(async (bookIds: string[], updates: Partial<NewBook>) => {
    if (bookIds.length === 0) return;
    
    return withLoadingState('addBook', async () => {
      try {
        // 各書籍を個別に更新（簡易実装）
        const updatePromises = bookIds.map(async (bookId) => {
          const book = books.find(b => b.id === bookId);
          if (!book) return;
          
          // 実際のアプリケーションでは、bookService.updateBook() を実装する必要があります
          // 現在は新規作成→削除の流れで代替
          const updatedData = { ...book, ...updates } as NewBook;
          const validatedData = validateBookOrThrow(updatedData) as NewBook;
          
          await bookService.deleteBook(bookId);
          return await bookService.createBook(validatedData);
        });
        
        await Promise.all(updatePromises);
        
        // データを再取得（簡易実装）
        const refreshedBooks = await bookService.getAllBooks({ useCache: false });
        setBooks(refreshedBooks);
      } catch (error) {
        handleError(error, '書籍の一括更新');
        throw error;
      }
    });
  }, [books, withLoadingState, handleError]);

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
    
    // Bulk operations
    removeBooksInBulk,
    updateBooksInBulk,
    
    // Undo functionality
    executeUndo,
    canUndo,
    isUndoing,
    clearUndoStack,
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
