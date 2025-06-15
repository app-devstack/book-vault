import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

export const useBook = (id: string | undefined) => {
  return useQuery({
    queryKey: id ? QUERY_KEYS.BOOK(id) : ['books', undefined],
    queryFn: () => bookService.getBookById(id!),
    enabled: !!id,
    ...QUERY_OPTIONS.DEFAULT,
  });
};