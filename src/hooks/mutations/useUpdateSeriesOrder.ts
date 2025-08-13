import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesService } from '@/utils/service/series-service';
import { SeriesWithBooks } from '@/features/home/types';

export const useUpdateSeriesOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedSeries: { id: string; displayOrder: number }[]) => {
      console.log('Calling updateSeriesDisplayOrder with:', updatedSeries);
      return seriesService.updateSeriesDisplayOrder(updatedSeries);
    },

    // 楽観的更新
    onMutate: async (updatedSeries) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: ['series'] });

      // 現在のデータを保存（ロールバック用）
      const previousData = queryClient.getQueryData(['series']) as SeriesWithBooks[];

      if (previousData) {
        // 新しい順序で楽観的更新
        const optimisticData = [...previousData];
        optimisticData.sort((a, b) => {
          const aOrder = updatedSeries.find((item) => item.id === a.id)?.displayOrder ?? 999;
          const bOrder = updatedSeries.find((item) => item.id === b.id)?.displayOrder ?? 999;
          return aOrder - bOrder;
        });

        // UI即座に反映
        queryClient.setQueryData(['series'], optimisticData);
        console.log(
          'Optimistic update applied:',
          optimisticData.map((s) => s.title)
        );
      }

      return { previousData };
    },

    onError: (error, variables, context) => {
      console.error('updateSeriesDisplayOrder failed, rolling back:', error);

      // エラー時：前の状態にロールバック
      if (context?.previousData) {
        queryClient.setQueryData(['series'], context.previousData);
      }
    },

    onSettled: () => {
      // 成功・失敗に関わらず最新データで同期
      queryClient.invalidateQueries({ queryKey: ['series'] });
    },
  });
};
