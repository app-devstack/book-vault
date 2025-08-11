import { seriesService } from '@/utils/service/series-service';
import { NewSeries } from '@/db/types';
import { QUERY_KEYS } from '@/utils/constants/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateSeriesParams {
  seriesId: string;
  updates: Partial<NewSeries>;
}

/**
 * シリーズ更新ミューテーション（汎用）
 */
export const useUpdateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seriesId, updates }: UpdateSeriesParams) =>
      seriesService.updateSeries(seriesId, updates),
    onSuccess: (updatedSeries, { seriesId }) => {
      // シリーズ一覧を更新
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERIES_LIST,
      });

      // 個別のシリーズ詳細も更新
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERIES_DETAIL(seriesId),
      });

      // シリーズ選択用一覧も更新
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERIES_OPTIONS,
      });
    },
  });
};
