import { Book, NewBook } from "@/db/types";
import { useBooks } from "@/hooks/useBooks";
import { GroupedBooks, SeriesStats } from "@/types/book";
import React, { createContext, ReactNode, useContext, useEffect } from "react";

interface BooksContextType {
  books: Book[];
  groupedBooks: GroupedBooks;
  getSeriesStats: (books: Book[]) => SeriesStats;
  addBook: (bookData: NewBook) => Promise<void>;
  removeBook: (bookId: string) => Promise<void>;
  removeSeries: (seriesTitle: string) => void;
  totalStats: {
    seriesCount: number;
    bookCount: number;
  };
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

interface BooksProviderProps {
  children: ReactNode;
}

export const BooksProvider: React.FC<BooksProviderProps> = ({ children }) => {
  const booksData = useBooks();

  useEffect(() => {
    (async () => {
      console.log("DB Migration executed successfully");
      await booksData.initializeBooks();
    })();
  }, [booksData]);

  return (
    <BooksContext.Provider value={booksData}>{children}</BooksContext.Provider>
  );
};

export const useBooksContext = (): BooksContextType => {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error("useBooksContext must be used within a BooksProvider");
  }
  return context;
};
