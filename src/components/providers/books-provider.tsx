import { createConstate } from "@/components/providers/utils/constate";
import { BookWithRelations, NewBook } from "@/db/types";
// import { BooksContextValue } from "@/types/provider.types";
import { showBookDeleteConfirmation, showSeriesDeleteConfirmation, showBulkDeleteConfirmation } from "@/components/ui/ConfirmationDialog";
import { useUndo } from "@/hooks/useUndo";
import { bookService } from "@/utils/service/book-service";
import { validateBookOrThrow } from "@/utils/validation";
import { useCallback, useEffect } from "react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useLoadingStates } from "@/hooks/useLoadingStates";
import { useBookData } from "@/hooks/useBookData";
import { useBookMutations } from "@/hooks/useBookMutations";

 const useBooks = () => {
  // エラーハンドリングとローディング状態を分離したフックを使用
  const { error, retryCount, clearError, handleError, setRetryCount } = useErrorHandler();
  const { loading, withLoadingState } = useLoadingStates();
  
  // データ管理フック
  const { 
    books, 
    setBooks, 
    setEmptySeries, 
    seriesedBooks, 
    totalStats, 
    initializeBooks,
    getSeriesStats 
  } = useBookData({ withLoadingState, handleError, retryCount, setRetryCount, loading });
  
  // CRUD操作フック
  const { addBook, createSeries } = useBookMutations({ 
    withLoadingState, 
    handleError, 
    books, 
    setBooks, 
    setEmptySeries 
  });
  
  // アンドゥ機能
  const { addUndoAction, executeUndo, canUndo, isUndoing, clearUndoStack } = useUndo();


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
  }, [books, withLoadingState, handleError, addUndoAction, setBooks]);

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
  }, [books, setBooks]);

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
  }, [withLoadingState, handleError, addUndoAction, books, setBooks]);

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
  }, [books, withLoadingState, handleError, setBooks]);

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
