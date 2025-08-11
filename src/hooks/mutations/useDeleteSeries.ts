import { seriesService } from '@/utils/service/series-service';
import { QUERY_KEYS } from '@/utils/constants/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * シリーズ削除ミューテーション
 */
export const useDeleteSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seriesId: string) => seriesService.deleteSeries(seriesId),
    onSuccess: () => {
      // シリーズ一覧を再取得
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERIES_LIST,
      });
      // アプリ統計情報も更新
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.APP_STATS,
      });
    },
  });
};
