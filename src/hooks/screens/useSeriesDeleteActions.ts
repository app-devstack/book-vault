import { useState } from 'react';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useDeleteSeries } from '@/hooks/mutations/useDeleteSeries';
import { useSafeState } from '@/hooks/useSafeState';

interface UseSeriesDeleteActionsProps {
  seriesId: string;
  seriesTitle: string;
}

/**
 * シリーズ削除に関連するアクションを管理するフック
 */
export const useSeriesDeleteActions = ({ seriesId, seriesTitle }: UseSeriesDeleteActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteSeriesMutation = useDeleteSeries();
  const { safeSetState } = useSafeState();

  const handleDeleteSeries = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSeriesMutation.mutateAsync(seriesId);

      safeSetState(() => {
        setShowDeleteDialog(false);
        Toast.show({
          type: 'success',
          text1: 'シリーズを削除しました',
          text2: `「${seriesTitle}」が削除されました`,
        });
        router.push('/');
      });
    } catch (error) {
      safeSetState(() => {
        setShowDeleteDialog(false);
        Toast.show({
          type: 'error',
          text1: '削除に失敗しました',
          text2: 'もう一度お試しください',
        });
      });
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  return {
    showDeleteDialog,
    handleDeleteSeries,
    handleConfirmDelete,
    handleCancelDelete,
    isDeleting: deleteSeriesMutation.isPending,
  };
};
