import { BookWithRelations, NewBook } from "@/db/types";
import { bookService } from "@/utils/service/book-service";
import { validateBookOrThrow } from "@/utils/validation";
import { useCallback } from "react";

interface UseBulkOperationsProps {
  withLoadingState: <T>(operation: 'addBook', asyncFn: () => Promise<T>) => Promise<T>;
  handleError: (error: unknown, operation: string) => { shouldRetry: boolean; error: any };
  books: BookWithRelations[];
  setBooks: React.Dispatch<React.SetStateAction<BookWithRelations[]>>;
}

export const useBulkOperations = ({
  withLoadingState,
  handleError,
  books,
  setBooks,
}: UseBulkOperationsProps) => {

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
    updateBooksInBulk,
  };
};