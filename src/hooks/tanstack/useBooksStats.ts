import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

export const useBooksStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_STATS,
    queryFn: () => bookService.getBooksStats(),
    ...QUERY_OPTIONS.DEFAULT,
  });
};
