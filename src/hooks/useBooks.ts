import { useMemo, useState } from "react";
import { Book, GroupedBooks, SeriesStats, StoreKey } from "../types/book";

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // シリーズごとにグループ化
  const groupedBooks: GroupedBooks = useMemo(() => {
    return books.reduce((acc, book) => {
      if (!acc[book.title]) {
        acc[book.title] = [];
      }
      acc[book.title].push(book);
      return acc;
    }, {} as GroupedBooks);
  }, [books]);

  // 各シリーズの統計を計算
  const getSeriesStats = (seriesBooks: Book[]): SeriesStats => {
    const volumes = seriesBooks
      .map((book) => book.volume)
      .sort((a, b) => a - b);
    const stores = [...new Set(seriesBooks.map((book) => book.store))];
    const totalPrice = seriesBooks.reduce((sum, book) => sum + book.price, 0);

    return {
      volumeCount: volumes.length,
      minVolume: Math.min(...volumes),
      maxVolume: Math.max(...volumes),
      stores,
      totalPrice,
      latestPurchase: new Date(
        Math.max(
          ...seriesBooks.map((book) => new Date(book.purchaseDate).getTime())
        )
      ),
    };
  };

  // 本を追加
  const addBook = (
    bookData: Omit<Book, "id" | "purchaseDate" | "price" | "url">,
    store: StoreKey
  ): void => {
    const newBook: Book = {
      id: Date.now(),
      ...bookData,
      store,
      purchaseDate: new Date().toISOString().split("T")[0],
      price: Math.floor(Math.random() * 500) + 400,
      url: `https://example.com/${store}/${Date.now()}`,
    };
    setBooks((prev) => [...prev, newBook]);
  };

  // 本を削除
  const removeBook = (bookId: number): void => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  // シリーズを削除
  const removeSeries = (seriesTitle: string): void => {
    setBooks((prev) => prev.filter((book) => book.title !== seriesTitle));
  };

  // 統計情報
  const totalStats = useMemo(() => {
    const totalPrice = books.reduce((sum, book) => sum + book.price, 0);
    const seriesCount = Object.keys(groupedBooks).length;
    const bookCount = books.length;

    return {
      totalPrice,
      seriesCount,
      bookCount,
    };
  }, [books, groupedBooks]);

  return {
    books,
    groupedBooks,
    getSeriesStats,
    addBook,
    removeBook,
    removeSeries,
    totalStats,
  };
};
