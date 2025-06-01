import { BookSearchItemType } from "@/feature/register/components/book-search/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

export const useGetBookSearch = (searchTerm: string) => {
  return useQuery<BookSearchItemType[]>({
    queryKey: ["books", searchTerm],
    queryFn: () => fetchBooks(searchTerm).then((data) => data.items || []),
    enabled: !!searchTerm,
  });
};

export const useBookSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchTerm);
  };

  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
  };
};
