import { Book } from '@/db/types';

// HomeScreenで使用するシリーズ型（booksを含む）
export type SeriesWithBooks = {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  thumbnail: string | null;
  displayOrder: number;
  googleBooksSeriesId: string | null;
  createdAt: Date;
  updatedAt: Date;
  books: Book[];
};

// シリーズ統計情報
export interface SeriesStats {
  volumeCount: number;
  latestVolumeDate?: Date;
}
