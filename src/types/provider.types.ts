import { Book, BookWithRelations, SeriesWithBooks } from "@/db/types";
import { SeriesStats } from "@/types/book";
import { BookError } from "@/types/errors";

export interface LoadingStates {
  initialize: boolean;
  addBook: boolean;
  removeBook: boolean;
  createSeries: boolean;
}

export interface TotalStats {
  seriesCount: number;
  bookCount: number;
}

export interface BooksContextState {
  // Core data
  books: BookWithRelations[];
  seriesedBooks: SeriesWithBooks[];
  totalStats: TotalStats;
  
  // UI state
  loading: LoadingStates;
  error: BookError | null;
}

export interface BooksContextActions {
  // Data fetching
  initializeBooks: (forceRetry?: boolean) => Promise<void>;
  
  // Book operations
  addBook: (bookData: Parameters<typeof import("@/utils/service/book-service").bookService.createBook>[0]) => Promise<void>;
  removeBook: (bookId: string) => Promise<void>;
  
  // Series operations
  createSeries: (seriesData: Parameters<typeof import("@/utils/service/series-service").seriesService.createSeries>[0]) => Promise<string>;
  removeSeries: (seriesTitle: string) => void;
  getSeriesStats: (seriesBooks: Book[]) => SeriesStats;
  
  // Error handling
  clearError: () => void;
}

export interface BooksContextValue extends BooksContextState, BooksContextActions {}

// Validation interfaces
export interface BookValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SeriesValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Zod validation result types (keeping for compatibility)
// Note: Actual validation schemas are now in src/utils/validation.ts using Zod

// Error boundary props
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}