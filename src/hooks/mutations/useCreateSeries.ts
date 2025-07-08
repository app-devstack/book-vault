import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesService } from '@/utils/service/series-service';
import { QUERY_KEYS } from '@/utils/constants/query';
import { NewSeries } from '@/db/types';
import Toast from 'react-native-toast-message';

/**
 * 新しいシリーズを作成するためのミューテーションフック
 */
export const useCreateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>) =>
      seriesService.createSeries(seriesData),
    onSuccess: (newSeries) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_OPTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APP_STATS });

      Toast.show({
        type: 'success',
        text1: 'シリーズ作成完了',
        text2: `「${newSeries.title}」が作成されました`,
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'シリーズ作成エラー',
        text2: 'シリーズの作成に失敗しました',
      });
    },
  });
};
