import { BookSearchItemType } from "@/feature/register/components/book-search/types";
import { BookSearchResult } from "@/types/book";
import { COLORS } from "@/utils/colors";
import { useQuery } from "@tanstack/react-query";
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
  return response.json();
};

// BookSearchItemTypeをBookSearchResultに変換する関数
const transformBookSearchItem = (
  item: BookSearchItemType
): BookSearchResult => {
  const volumeInfo = item.volumeInfo || {};

  return {
    id: item.id || "",
    title: volumeInfo.title || "不明なタイトル",
    author: volumeInfo.authors?.join(", ") || "不明な著者",
    thumbnail:
      volumeInfo.imageLinks?.thumbnail ||
      `https://via.placeholder.com/120x160/${COLORS.primary.slice(
        1
      )}/FFFFFF?text=No+Image`,
    description: volumeInfo.description || "説明がありません",
  };
};

export const useGetBookSearch = (searchTerm: string) => {
  return useQuery<BookSearchResult[]>({
    queryKey: ["books", searchTerm],
    queryFn: () =>
      fetchBooks(searchTerm).then((data) => {
        const items = data.items || [];
        return items.map(transformBookSearchItem);
      }),
    enabled: !!searchTerm,
  });
};

// デバウンス用のカスタムフック
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // 500msのデバウンス
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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
