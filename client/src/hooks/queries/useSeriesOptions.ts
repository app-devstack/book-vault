import { seriesService } from '@/utils/service/series-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

export interface SeriesOption {
  id: string;
  title: string;
  author: string | null;
  bookCount: number;
}

/**
 * シリーズ選択用の軽量なシリーズ一覧を取得するフック
 */
export const useSeriesOptions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SERIES_OPTIONS,
    queryFn: () => seriesService.getSeriesOptions(),
    ...QUERY_OPTIONS.STATIC,
    select: (data: SeriesOption[]) => data.sort((a, b) => a.title.localeCompare(b.title)),
  });
};
