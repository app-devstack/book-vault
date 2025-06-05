import React, { createContext, ReactNode, useContext } from "react";
import { useBooks } from "../hooks/useBooks";
import { Book, GroupedBooks, SeriesStats, StoreKey } from "../types/book";

interface BooksContextType {
  books: Book[];
  groupedBooks: GroupedBooks;
  getSeriesStats: (books: Book[]) => SeriesStats;
  addBook: (
    bookData: Omit<Book, "id" | "purchaseDate" | "price" | "url">,
    store: StoreKey
  ) => void;
  removeBook: (bookId: number) => void;
  removeSeries: (seriesTitle: string) => void;
  totalStats: {
    totalPrice: number;
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
