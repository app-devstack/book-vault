import { Book, NewBook } from "@/db/types";
import { GroupedBooks, SeriesStats } from "@/types/book";
import { bookService } from "@/utils/service/book-service";
import { useMemo, useState } from "react";

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const initializeBooks = async () => {
    try {
      const initialBooks = await bookService.getAllBooks();
      setBooks(initialBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      // エラーハンドリングの処理を追加すること
    }
  };

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
    return {
      volumeCount: seriesBooks.length,
    };
  };

  // 本を追加
  const addBook = async (bookData: NewBook) => {
    try {
      const newBook = await bookService.createBook({ ...bookData });
      setBooks((prev) => [...prev, newBook]);
    } catch (error) {
      console.error("Error adding book:", error);
      //  後で処理追加
    }
  };

  // 本を削除
  const removeBook = async (bookId: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
    await bookService.deleteBook(bookId); // あとでロールバック処理も必要
  };

  // シリーズを削除
  const removeSeries = (seriesTitle: string) => {
    setBooks((prev) => prev.filter((book) => book.title !== seriesTitle));
  };

  // 統計情報
  const totalStats = useMemo(() => {
    const seriesCount = Object.keys(groupedBooks).length;
    const bookCount = books.length;

    return {
      seriesCount,
      bookCount,
    };
  }, [books, groupedBooks]);

  return {
    books,

    initializeBooks,

    groupedBooks,
    getSeriesStats,
    addBook,
    removeBook,
    removeSeries,
    totalStats,
  };
};
