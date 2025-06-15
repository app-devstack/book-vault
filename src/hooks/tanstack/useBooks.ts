import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

export const useBooks = (options?: { useCache?: boolean; limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.BOOKS, options],
    queryFn: () => bookService.getAllBooks(options),
    ...QUERY_OPTIONS.DEFAULT,
  });
};