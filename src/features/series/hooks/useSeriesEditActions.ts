import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { useUpdateSeries } from '@/hooks/mutations/useUpdateSeries';
import { useSafeState } from '@/hooks/useSafeState';

interface UseSeriesEditActionsProps {
  seriesId: string;
  initialTitle: string;
}

/**
 * シリーズタイトル編集に関連するアクションを管理するフック
 */
export const useSeriesEditActions = ({ seriesId, initialTitle }: UseSeriesEditActionsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateSeriesMutation = useUpdateSeries();
  const { safeSetState } = useSafeState();

  const validateTitle = (title: string): boolean => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      Toast.show({
        type: 'error',
        text1: 'エラー',
        text2: 'タイトルを入力してください',
      });
      return false;
    }

    if (trimmedTitle.length > 100) {
      Toast.show({
        type: 'error',
        text1: 'エラー',
        text2: 'タイトルは100文字以内で入力してください',
      });
      return false;
    }

    if (trimmedTitle === initialTitle) {
      Toast.show({
        type: 'info',
        text1: '変更なし',
        text2: 'タイトルは変更されませんでした',
      });
      return false;
    }

    return true;
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async (newTitle: string) => {
    if (!validateTitle(newTitle)) {
      setIsEditing(false);
      return;
    }

    try {
      await updateSeriesMutation.mutateAsync({
        seriesId,
        updates: { title: newTitle },
      });

      safeSetState(() => {
        setIsEditing(false);
        Toast.show({
          type: 'success',
          text1: 'タイトルを更新しました',
          text2: `「${newTitle}」に変更されました`,
        });
      });
    } catch (error) {
      safeSetState(() => {
        setIsEditing(false);
        Toast.show({
          type: 'error',
          text1: '更新に失敗しました',
          text2: 'もう一度お試しください',
        });
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return {
    isEditing,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    isUpdating: updateSeriesMutation.isPending,
  };
};
