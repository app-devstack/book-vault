import { BookSearchResult } from "@/types/book";
import { transformBookSearchItem } from "@/utils/googleBooks";
import { GoogleBooksResponse } from "@/utils/googleBooks/types";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";

const fetchBooks = async (query: string) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
      query
    )}&langRestrict=ja`
  );
  if (!response.ok) {
    throw new Error("データの取得に失敗しました");
  }
  return response.json() as Promise<GoogleBooksResponse>;
};

export const useGetBookSearch = (searchTerm: string) => {
  return useQuery<BookSearchResult[]>({
    queryKey: ["books", searchTerm],
    queryFn: () =>
      fetchBooks(searchTerm).then(async (data) => {
        const items = data.items || [];

        const results: BookSearchResult[] = [];

        for (const item of items) {
          const transformedItem = await transformBookSearchItem(item);
          results.push(transformedItem);
        }

        return results;
      }),
    enabled: !!searchTerm,
  });
};

// デバウンス用のカスタムフック
// const useDebounce = (value: string, delay: number) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

const SEARCH_DEBOUNCE_DELAY = 500; // デバウンスの遅延時間（ミリ秒）

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_DELAY);

  // デバウンスされた検索クエリでGoogle Books APIを呼び出し
  const { data: searchResults = [], isFetching } =
    useGetBookSearch(debouncedSearchQuery);

  // ローディング状態を管理
  useEffect(() => {
    setIsSearching(isFetching);
  }, [isFetching]);

  // 検索クエリが変更された時の即座のローディング状態
  useEffect(() => {
    if (searchQuery && searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }
  }, [searchQuery, debouncedSearchQuery]);

  // 検索結果をクリア
  const clearResults = useCallback((): void => {
    setSearchQuery("");
  }, []);

  // 手動検索（デバウンスをバイパス）
  const searchBooks = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) return;
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchBooks,
    clearResults,
  };
};
