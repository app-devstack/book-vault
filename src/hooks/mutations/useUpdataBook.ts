import { NewBook } from '@/db/types';
import { QUERY_KEYS } from '@/utils/constants/query';
import { bookService } from '@/utils/service/book-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

/**
 * 書籍を更新するためのミューテーションフック
 */
export const useUpdataBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, data }: { bookId: string; data: Partial<NewBook> }) =>
      bookService.updataBook(bookId, data),
    onMutate: async (updatedBookId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.BOOKS });

      const previousBooks = queryClient.getQueryData(QUERY_KEYS.BOOKS);

      // 楽観的更新
      queryClient.setQueryData(QUERY_KEYS.BOOKS, (old: any) => {
        if (!old) return [];
        return old.filter((book: any) => book.id !== updatedBookId);
      });

      return { previousBooks, updatedBookId };
    },
    onError: (err, updatedBookId, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(QUERY_KEYS.BOOKS, context.previousBooks);
      }

      Toast.show({
        type: 'error',
        text1: '更新エラー',
        text2: '書籍の更新に失敗しました',
      });
    },
    onSuccess: (data, updatedBookId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APP_STATS });

      Toast.show({
        type: 'success',
        text1: '更新完了',
        text2: '書籍が更新されました',
      });
    },
  });
};
