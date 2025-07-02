import { BookSearchResult } from '@/types/book';
import { Book, SeriesWithBooks } from '@/db/types';
import { SeriesOption } from '@/hooks/queries/useSeriesOptions';
import { SeriesStats } from '@/hooks/screens/useHomeScreen';
import { SeriesDetailStats } from '@/hooks/screens/useSeriesDetail';
import { BookRegistrationForm } from '@/hooks/screens/useBookRegistration';

// 型のre-export（他のファイルで使用される場合）
export type { AppStats } from '@/hooks/queries/useAppStats';
export type { UseBookDetailModalParams } from '@/hooks/screens/useBookDetailModal';

// ホーム画面用フックの戻り値型
export interface UseHomeScreenReturn {
  seriesedBooks: SeriesWithBooks[];
  totalStats: { seriesCount: number; bookCount: number };
  isLoading: boolean;
  error: Error | null;
  getSeriesStats: (books: Book[]) => SeriesStats;
  refetch: () => void;
}

// 登録画面用フックの戻り値型
export interface UseBookRegistrationReturn {
  formData: BookRegistrationForm;
  searchResults: BookSearchResult[];
  isSearching: boolean;
  searchBooks: (query: string) => void;
  clearResults: () => void;
  selectBook: (book: BookSearchResult) => void;
  seriesOptions: SeriesOption[];
  selectedSeriesId: string | null;
  selectSeries: (seriesId: string | null) => void;
  createSeries: (seriesData: any) => Promise<string>;
  isCreatingSeries: boolean;
  targetURL: string;
  setTargetURL: (url: string) => void;
  registerBook: () => Promise<void>;
  isRegistering: boolean;
  error: Error | null;
}

// シリーズ詳細画面用フックの戻り値型
export interface UseSeriesDetailReturn {
  series: SeriesWithBooks | undefined;
  books: Book[];
  stats: SeriesDetailStats;
  isLoading: boolean;
  error: Error | null;
  deleteBook: (bookId: string) => Promise<void>;
  isDeleting: boolean;
  refetch: () => void;
}

// 書籍詳細モーダル用フックの戻り値型
export interface UseBookDetailModalReturn {
  isVisible: boolean;
  isDeleting: boolean;
  showModal: () => void;
  hideModal: () => void;
  deleteBook: () => Promise<void>;
}

// エラーハンドラーフックの戻り値型
export interface UseErrorHandlerReturn {
  handleError: (error: Error, context?: string) => void;
}
