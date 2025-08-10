import { BookWithRelations } from '@/db/types';
import { useUpdataBook } from '@/hooks/mutations/useUpdataBook';
import { useSafeState } from '@/hooks/useSafeState';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { EditBookFormData, useBookFormData } from './useBookFormData';

export const useEditBookActions = (book: BookWithRelations | null | undefined) => {
  const router = useRouter();
  const updataBookMutation = useUpdataBook();
  const { safeSetState } = useSafeState();
  const { transformFormData } = useBookFormData();

  // フォーム送信処理
  const onSubmit = useCallback(
    async (data: EditBookFormData) => {
      if (updataBookMutation.isPending || !book?.id) return;

      try {
        const updateData = transformFormData(data);
        const originalSeriesId = book.seriesId;
        const newSeriesId = data.seriesId;

        await updataBookMutation.mutateAsync({
          bookId: book.id,
          data: updateData,
        });

        safeSetState(() => {
          // シリーズが変更された場合は新しいシリーズ詳細画面に遷移
          if (newSeriesId && originalSeriesId !== newSeriesId) {
            router.push(`/series/${newSeriesId}`);
          } else {
            router.back();
          }
        });
      } catch (error) {
        console.error('Book update failed:', error);
        Alert.alert('エラー', '書籍の更新に失敗しました。もう一度お試しください。');
      }
    },
    [updataBookMutation, book?.id, book?.seriesId, transformFormData, safeSetState, router]
  );

  // キャンセル処理
  const handleCancel = useCallback(() => {
    Alert.alert('変更を破棄', '編集内容が失われますがよろしいですか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '破棄', style: 'destructive', onPress: () => router.back() },
    ]);
  }, [router]);

  return {
    onSubmit,
    handleCancel,
    isPending: updataBookMutation.isPending,
  };
};
