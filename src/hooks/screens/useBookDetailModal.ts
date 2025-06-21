import { useState, useCallback } from 'react';
import { useDeleteBook } from '@/hooks/mutations/useDeleteBook';
import { Book } from '@/db/types';

export interface UseBookDetailModalParams {
  book: Book | null;
  onClose: () => void;
  onBookDeleted?: (bookId: string) => void;
}

/**
 * 書籍詳細モーダルの表示状態と削除操作を管理するフック
 */
export const useBookDetailModal = ({ 
  book, 
  onClose, 
  onBookDeleted 
}: UseBookDetailModalParams) => {
  const [isVisible, setIsVisible] = useState(false);
  const deleteBookMutation = useDeleteBook();
  
  const deleteBook = useCallback(async () => {
    if (!book) return;
    
    try {
      await deleteBookMutation.mutateAsync(book.id);
      onBookDeleted?.(book.id);
      onClose();
    } catch (error) {
      // エラーハンドリングはmutation内で実行済み
      console.error('Delete book error:', error);
    }
  }, [book, deleteBookMutation, onBookDeleted, onClose]);
  
  const showModal = useCallback(() => {
    setIsVisible(true);
  }, []);
  
  const hideModal = useCallback(() => {
    setIsVisible(false);
    onClose();
  }, [onClose]);
  
  return {
    // 状態
    isVisible,
    isDeleting: deleteBookMutation.isPending,
    
    // アクション
    showModal,
    hideModal,
    deleteBook,
  };
};