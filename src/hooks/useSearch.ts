import { useState } from "react";
import { BookSearchResult } from "../types/book";
import { COLORS } from "../utils/colors";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Google Books API検索（モック実装）
  const searchBooks = async (query: string): Promise<void> => {
    if (!query.trim()) return;

    setIsSearching(true);

    // モック検索結果を生成
    setTimeout(() => {
      const mockResults: BookSearchResult[] = [
        {
          id: "mock1",
          title: `${query} 1巻`,
          author: "作者名",
          thumbnail: `https://via.placeholder.com/120x160/${COLORS.primary.slice(
            1
          )}/FFFFFF?text=${encodeURIComponent(query)}1`,
          description: `${query}の第1巻です。面白いストーリーが展開されます。`,
        },
        {
          id: "mock2",
          title: `${query} 2巻`,
          author: "作者名",
          thumbnail: `https://via.placeholder.com/120x160/${COLORS.primaryDark.slice(
            1
          )}/FFFFFF?text=${encodeURIComponent(query)}2`,
          description: `${query}の第2巻です。物語がさらに盛り上がります。`,
        },
        {
          id: "mock3",
          title: `${query} 3巻`,
          author: "作者名",
          thumbnail: `https://via.placeholder.com/120x160/${COLORS.accent.slice(
            1
          )}/FFFFFF?text=${encodeURIComponent(query)}3`,
          description: `${query}の第3巻です。クライマックスに向けて盛り上がります。`,
        },
      ];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 800);
  };

  // 検索結果をクリア
  const clearResults = (): void => {
    setSearchResults([]);
    setSearchQuery("");
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchBooks,
    clearResults,
  };
};
