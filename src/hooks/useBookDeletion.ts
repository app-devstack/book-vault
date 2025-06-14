import { showBookDeleteConfirmation, showBulkDeleteConfirmation, showSeriesDeleteConfirmation } from "@/components/ui/ConfirmationDialog";
import { BookWithRelations } from "@/db/types";
import { bookService } from "@/utils/service/book-service";
import { useCallback } from "react";

export interface UndoAction {
  type: 'delete_book' | 'bulk_delete';
  description: string;
  data: BookWithRelations | BookWithRelations[];
  undo: () => Promise<void>;
}

interface UseBookDeletionProps {
  withLoadingState: <T>(operation: 'removeBook', asyncFn: () => Promise<T>) => Promise<T>;
  handleError: (error: unknown, operation: string) => { shouldRetry: boolean; error: any };
  books: BookWithRelations[];
  setBooks: React.Dispatch<React.SetStateAction<BookWithRelations[]>>;
  addUndoAction: (action: UndoAction) => void;
}

export const useBookDeletion = ({
  withLoadingState,
  handleError,
  books,
  setBooks,
  addUndoAction,
}: UseBookDeletionProps) => {
  // 共通の書籍復元処理
  const createRestoredBook = useCallback(async (bookToRestore: BookWithRelations): Promise<BookWithRelations> => {
    const { series, shop, ...bookData } = bookToRestore;
    const restoredBook = await bookService.createBook(bookData);
    
    return {
      ...restoredBook,
      series,
      shop
    } satisfies BookWithRelations;
  }, []);

  // 共通の削除実行処理
  const executeBookDeletion = useCallback(async (
    deleteOperation: () => Promise<void>,
    undoAction: UndoAction,
    operationName: string
  ) => {
    return withLoadingState('removeBook', async () => {
      try {
        await deleteOperation();
        addUndoAction(undoAction);
      } catch (error) {
        handleError(error, operationName);
        throw error;
      }
    });
  }, [withLoadingState, addUndoAction, handleError]);
  const removeBook = useCallback(async (bookId: string, options?: { skipConfirmation?: boolean }) => {
    const { skipConfirmation = false } = options || {};

    const bookToDelete = books.find(book => book.id === bookId);
    if (!bookToDelete) {
      throw new Error('削除対象の書籍が見つかりません');
    }

    const executeDelete = () => {
      return executeBookDeletion(
        async () => {
          await bookService.deleteBook(bookId);
          setBooks((prev) => prev.filter((book) => book.id !== bookId));
        },
        {
          type: 'delete_book',
          description: `「${bookToDelete.title}」を削除しました`,
          data: bookToDelete,
          undo: async () => {
            const restoredBook = await createRestoredBook(bookToDelete);
            setBooks((prev) => [...prev, restoredBook]);
          }
        },
        '書籍の削除'
      );
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
  }, [books, executeBookDeletion, createRestoredBook, setBooks]);

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

  const removeBooksInBulk = useCallback(async (bookIds: string[], options?: { skipConfirmation?: boolean }) => {
    const { skipConfirmation = false } = options || {};

    if (bookIds.length === 0) return;

    const executeDelete = async () => {
      const booksToDelete = books.filter(book => bookIds.includes(book.id));
      
      return executeBookDeletion(
        async () => {
          await bookService.deleteBooksInBulk(bookIds);
          setBooks((prev) => prev.filter((book) => !bookIds.includes(book.id)));
        },
        {
          type: 'bulk_delete',
          description: `${bookIds.length}冊の書籍を削除しました`,
          data: booksToDelete,
          undo: async () => {
            const restorePromises = booksToDelete.map(bookToRestore => createRestoredBook(bookToRestore));
            const restoredBooks = await Promise.all(restorePromises);
            setBooks((prev) => [...prev, ...restoredBooks]);
          }
        },
        '書籍の一括削除'
      );
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
  }, [executeBookDeletion, createRestoredBook, books, setBooks]);

  return {
    removeBook,
    removeSeries,
    removeBooksInBulk,
  };
};