import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS } from '@/utils/constants/query';
import { NewBook } from '@/db/types';
import Toast from 'react-native-toast-message';

/**
 * 新しい書籍を登録するためのミューテーションフック
 */
export const useAddBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: NewBook) => bookService.createBook(bookData),
    onMutate: async (newBook) => {
      // 楽観的更新の準備
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.BOOKS });

      const previousBooks = queryClient.getQueryData(QUERY_KEYS.BOOKS);

      // 楽観的更新実行
      queryClient.setQueryData(QUERY_KEYS.BOOKS, (old: any) => {
        if (!old) return [newBook];
        return [...old, { ...newBook, id: 'temp-' + Date.now() }];
      });

      return { previousBooks };
    },
    onError: (err, newBook, context) => {
      // エラー時にロールバック
      if (context?.previousBooks) {
        queryClient.setQueryData(QUERY_KEYS.BOOKS, context.previousBooks);
      }

      Toast.show({
        type: 'error',
        text1: '登録エラー',
        text2: '書籍の登録に失敗しました',
      });
    },
    onSuccess: (data, variables) => {
      // 関連するクエリを無効化して最新データを取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APP_STATS });

      if (variables.seriesId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SERIES_DETAIL(variables.seriesId),
        });
      }

      Toast.show({
        type: 'success',
        text1: '登録完了',
        text2: '書籍が正常に登録されました',
      });
    },
  });
};
