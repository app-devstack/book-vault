import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

/**
 * 特定書籍の詳細情報を取得するフック
 */
export const useBookDetail = (bookId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOK(bookId),
    queryFn: () => bookService.getBookById(bookId),
    ...QUERY_OPTIONS.DEFAULT,
    enabled: !!bookId,
  });
};
