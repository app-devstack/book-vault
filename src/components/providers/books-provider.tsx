import { createConstate } from "@/components/providers/utils/constate";
// import { BooksContextValue } from "@/types/provider.types";
import { useUndo } from "@/hooks/useUndo";
import { useEffect } from "react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useLoadingStates } from "@/hooks/useLoadingStates";
import { useBookData } from "@/hooks/useBookData";
import { useBookMutations } from "@/hooks/useBookMutations";
import { useBulkOperations } from "@/hooks/useBulkOperations";
import { useBookDeletion } from "@/hooks/useBookDeletion";

 const useBooks = () => {
  // エラーハンドリングとローディング状態を分離したフックを使用
  const { error, retryCount, clearError, handleError, setRetryCount } = useErrorHandler();
  const { loading, withLoadingState } = useLoadingStates();
  
  // アンドゥ機能（他のフックで使用するため最初に宣言）
  const { addUndoAction, executeUndo, canUndo, isUndoing, clearUndoStack } = useUndo();
  
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
  
  // 一括操作フック（更新操作のみ）
  const { updateBooksInBulk } = useBulkOperations({
    withLoadingState,
    handleError,
    books,
    setBooks,
  });
  
  // 削除操作フック（単体削除と一括削除の両方を含む）
  const { removeBook, removeSeries, removeBooksInBulk } = useBookDeletion({
    withLoadingState,
    handleError,
    books,
    setBooks,
    addUndoAction,
  });



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
