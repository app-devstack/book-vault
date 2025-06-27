import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

export const useSeriesBooks = (seriesId: string | undefined) => {
  return useQuery({
    queryKey: seriesId ? QUERY_KEYS.SERIES_BOOKS(seriesId) : ['books', 'series', undefined],
    queryFn: () => bookService.getBooksBySeriesId(seriesId!),
    enabled: !!seriesId,
    ...QUERY_OPTIONS.DEFAULT,
  });
};
