import { BookSearchResult } from '@/types/book';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { transformBookSearchItem } from '@/utils/googleBooks';
import { GoogleBooksResponse } from '@/utils/googleBooks/types';
import { useQuery } from '@tanstack/react-query';

const fetchBooks = async (query: string): Promise<GoogleBooksResponse> => {
  // const encodedQuery = encodeURIComponent(query);
  const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
  const params = {
    q: `intitle:${query}`,
    langRestrict: 'ja',
    maxResults: '20',
  };

  const searchParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const response = await fetch(`${baseUrl}?${searchParams}`);
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
    select: sortByMatchScore(query),
  });
};

const sortByMatchScore = (query: string) => (data: BookSearchResult[]) =>
  data
    .filter((book) => book.title && book.author)
    .sort((a, b) => {
      const scoreA = calculateMatchScore(query, a.title);
      const scoreB = calculateMatchScore(query, b.title);
      return scoreB - scoreA;
    });

/**
 * query文字列がtitle文字列にどの程度含まれているかの割合を計算
 */
const calculateMatchScore = (query: string, title: string): number => {
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();

  if (!queryLower || !titleLower) return 0;

  // query文字列がタイトルに含まれている場合の含有率を計算
  if (titleLower.includes(queryLower)) {
    return queryLower.length / titleLower.length;
  }

  return 0;
};
