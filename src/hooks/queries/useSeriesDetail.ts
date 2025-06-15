import { seriesService } from '@/utils/service/series-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

/**
 * 特定シリーズの詳細情報と関連書籍を取得するフック
 */
export const useSeriesDetail = (seriesId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SERIES_DETAIL(seriesId),
    queryFn: () => seriesService.getSeriesWithBooks(seriesId),
    ...QUERY_OPTIONS.DEFAULT,
    enabled: !!seriesId,
  });
};