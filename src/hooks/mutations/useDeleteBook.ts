import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS } from '@/utils/constants/query';
import Toast from 'react-native-toast-message';

/**
 * 書籍を削除するためのミューテーションフック
 */
export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => bookService.deleteBook(bookId),
    onMutate: async (deletedBookId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.BOOKS });

      const previousBooks = queryClient.getQueryData(QUERY_KEYS.BOOKS);

      // 楽観的更新
      queryClient.setQueryData(QUERY_KEYS.BOOKS, (old: any) => {
        if (!old) return [];
        return old.filter((book: any) => book.id !== deletedBookId);
      });

      return { previousBooks, deletedBookId };
    },
    onError: (err, deletedBookId, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(QUERY_KEYS.BOOKS, context.previousBooks);
      }

      Toast.show({
        type: 'error',
        text1: '削除エラー',
        text2: '書籍の削除に失敗しました',
      });
    },
    onSuccess: (data, deletedBookId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APP_STATS });

      Toast.show({
        type: 'success',
        text1: '削除完了',
        text2: '書籍が削除されました',
      });
    },
  });
};
