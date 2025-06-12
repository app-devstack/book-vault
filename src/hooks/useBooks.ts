import { Book, BookWithRelations, NewBook, Series, SeriesWithBooks } from "@/db/types";
import { SeriesStats } from "@/types/book";
import { bookService } from "@/utils/service/book-service";
import { seriesService } from "@/utils/service/series-service";
import { useMemo, useState } from "react";

export const useBooks = () => {
  const [books, setBooks] = useState<BookWithRelations[]>([]);

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
  const seriesedBooks: SeriesWithBooks[] = useMemo(() => {
    const seriesMap = new Map<string, SeriesWithBooks>();

    for (const book of books) {
      if (!book.series) continue;      // シリーズが存在しない場合はスキップ

      const seriesId = book.series.id || "";
      const existsSeries = seriesMap.get(seriesId);

      if (existsSeries) {
        existsSeries.books.push(book);
      } else {
        const newData = {...book.series, books: [book] } satisfies SeriesWithBooks;
        seriesMap.set(seriesId, newData);
      }
    }

    return Array.from(seriesMap.values())
  }, [books]);

  // 各シリーズの統計を計算
  const getSeriesStats = (seriesBooks: Book[]): SeriesStats => {
    return {
      volumeCount: seriesBooks.length,
    };
  };

  // 本を追加
  const addBook = async (bookData: NewBook ) => {
    try {
      const {seriesId} = bookData

      let series:Series|undefined= await seriesService.getSeriesById(seriesId);

      if (!series) {
        // シリーズが存在しない場合は新規作成
        series = await seriesService.createSeries({
          title: extractByMultipleSpaces(bookData.title),
          author: bookData.author,
        });
      }

      const newBook = await bookService.createBook({ ...bookData });

      const bookWithRelations = {
        ...newBook,
        series: series,
        shop: undefined // 未実装のため、いったん未定義とする
      } satisfies BookWithRelations;

      setBooks((prev) => [...prev, bookWithRelations]);
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
    const seriesCount = Object.keys(seriesedBooks).length;
    const bookCount = books.length;

    return {
      seriesCount,
      bookCount,
    };
  }, [books, seriesedBooks]);

  return {
    books,

    initializeBooks,

    seriesedBooks,
    getSeriesStats,
    addBook,
    removeBook,
    removeSeries,
    totalStats,
  };
};


//  utilに移動する
function  extractByMultipleSpaces(title:string): string {
  const match = title.match(/^[^\s\u3000]+/);
  return match ? match[0] : title;
}