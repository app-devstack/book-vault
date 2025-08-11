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
      data.sort((a, b) => {
        // 本が紐づいているシリーズを優先
        const aHasBooks = a.books.length > 0;
        const bHasBooks = b.books.length > 0;
        
        if (aHasBooks && !bHasBooks) return -1;
        if (!aHasBooks && bHasBooks) return 1;
        
        // 同じグループ内では更新日時順
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }),
  });
};
