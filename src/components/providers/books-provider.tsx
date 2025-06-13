import { createConstate } from "@/components/providers/utils/constate";
import { Book, BookWithRelations, NewBook, NewSeries, Series, SeriesWithBooks } from "@/db/types";
import { SeriesStats } from "@/types/book";
import { bookService } from "@/utils/service/book-service";
import { seriesService } from "@/utils/service/series-service";
import { extractByMultipleSpaces } from "@/utils/text";
import { useCallback, useEffect, useMemo, useState } from "react";

 const useBooks = () => {
  const [books, setBooks] = useState<BookWithRelations[]>([]);

  const initializeBooks = useCallback(async () => {
    try {
      const initialBooks = await bookService.getAllBooks();
      setBooks(initialBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }, []);

  const seriesedBooks: SeriesWithBooks[] = useMemo(() => {
    const seriesMap = new Map<string, SeriesWithBooks>();

    books.forEach((book) => {
      if (!book.series?.id) return;

      const seriesId = book.series.id;
      const existingSeries = seriesMap.get(seriesId);

      if (existingSeries) {
        existingSeries.books.push(book);
      } else {
        seriesMap.set(seriesId, {
          ...book.series,
          books: [book],
        });
      }
    });

    return Array.from(seriesMap.values());
  }, [books]);

  const getSeriesStats = useCallback((seriesBooks: Book[]): SeriesStats => {
    return {
      volumeCount: seriesBooks.length,
    };
  }, []);

  const addBook = useCallback(async (bookData: NewBook) => {
    try {
      const { seriesId } = bookData;

      let series: Series | undefined = await seriesService.getSeriesById(seriesId);

      if (!series) {
        series = await seriesService.createSeries({
          title: extractByMultipleSpaces(bookData.title),
          author: bookData.author,
          googleBooksSeriesId: seriesId,
        });
      }

      const newBook = await bookService.createBook({ ...bookData, seriesId: series.id });

      const bookWithRelations: BookWithRelations = {
        ...newBook,
        series,
        shop: undefined,
      };

      setBooks((prev) => [...prev, bookWithRelations]);
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  }, []);

  const removeBook = useCallback(async (bookId: string) => {
    try {
      await bookService.deleteBook(bookId);
      setBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error removing book:", error);
      throw error;
    }
  }, []);

  const removeSeries = useCallback((seriesTitle: string) => {
    setBooks((prev) => prev.filter((book) => book.series?.title !== seriesTitle));
  }, []);

  const createSeries = useCallback(async (seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const newSeries = await seriesService.createSeries(seriesData);
      return newSeries.id;
    } catch (error) {
      console.error("Error creating series:", error);
      throw error;
    }
  }, []);

  const totalStats = useMemo(() => {
    return {
      seriesCount: seriesedBooks.length,
      bookCount: books.length,
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
    createSeries,
    totalStats,
  };
};


function useBooksProvider() {
  const booksData = useBooks();

  useEffect(() => {
    (async () => {
      console.log("DB Migration executed successfully");
      await booksData.initializeBooks();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return booksData;
}

const booksConstate = createConstate(useBooksProvider);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  return (
    <booksConstate.Provider>
      {children}
    </booksConstate.Provider>
  )
}
export const useBooksContext = booksConstate.useContextValue;
