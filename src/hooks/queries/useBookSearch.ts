import { BookSearchResult } from '@/types/book';
import { transformBookSearchItem } from '@/utils/googleBooks';
import { GoogleBooksResponse } from '@/utils/googleBooks/types';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

const fetchBooks = async (query: string): Promise<GoogleBooksResponse> => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
      query
    )}&langRestrict=ja`
  );
  if (!response.ok) {
    throw new Error('データの取得に失敗しました');
  }
  return response.json();
};

/**
 * Google Books APIを使用した書籍検索を行うフック
 */
export const useBookSearch = (query: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.GOOGLE_BOOKS_SEARCH(query),
    queryFn: async (): Promise<BookSearchResult[]> => {
      const data = await fetchBooks(query);
      const items = data.items || [];

      const results: BookSearchResult[] = [];

      for (const item of items) {
        const transformedItem = await transformBookSearchItem(item);
        results.push(transformedItem);
      }

      return results;
    },
    ...QUERY_OPTIONS.SEARCH,
    enabled: query.length >= 2,
    select: (data: BookSearchResult[]) => 
      data.filter(book => book.title && book.author),
  });
};