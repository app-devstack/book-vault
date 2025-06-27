import { seriesService } from '@/utils/service/series-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

/**
 * 書籍データを含む全シリーズ一覧を取得するフック
 */
export const useSeriesList = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SERIES_LIST,
    queryFn: seriesService.getAllSeriesWithBooks,
    ...QUERY_OPTIONS.DEFAULT,
    select: (data) =>
      data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
  });
};
