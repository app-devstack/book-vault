import { BookWithRelations, NewBook, NewSeries, Series } from "@/db/types";
import { EMPTY_SERIES_ID } from "@/utils/constants";
import { bookService } from "@/utils/service/book-service";
import { seriesService } from "@/utils/service/series-service";
import { extractByMultipleSpaces } from "@/utils/text";
import { validateBookOrThrow, validateSeriesOrThrow } from "@/utils/validation";
import { useCallback } from "react";

interface UseBookMutationsProps {
  withLoadingState: <T>(operation: 'addBook' | 'createSeries', asyncFn: () => Promise<T>) => Promise<T>;
  handleError: (error: unknown, operation: string) => { shouldRetry: boolean; error: any };
  books: BookWithRelations[];
  setBooks: React.Dispatch<React.SetStateAction<BookWithRelations[]>>;
  setEmptySeries: React.Dispatch<React.SetStateAction<Series[]>>;
}

export const useBookMutations = ({
  withLoadingState,
  handleError,
  books,
  setBooks,
  setEmptySeries,
}: UseBookMutationsProps) => {
  const addBook = useCallback(async (bookData: NewBook) => {
    return withLoadingState('addBook', async () => {
      try {
        // データ検証とサニタイゼーション
        const validatedBookData = validateBookOrThrow(bookData);
        
        const { seriesId } = validatedBookData;

        let series: Series | undefined = await seriesService.getSeriesById(seriesId);

        if (!series) {
          series = await seriesService.createSeries({
            title: extractByMultipleSpaces(validatedBookData.title),
            author: validatedBookData.author,
            googleBooksSeriesId: seriesId,
          });
        }

        const newBook = await bookService.createBook({ ...validatedBookData, seriesId: series?.id || EMPTY_SERIES_ID });

        const bookWithRelations: BookWithRelations = {
          ...newBook,
          series,
          shop: undefined,
        };

        setBooks((prev) => [...prev, bookWithRelations]);

        // もしこの本が空のシリーズに関連付けられている場合、空のシリーズリストから削除
        setEmptySeries((prev) => prev.filter((s) => s.id !== series?.id));
      } catch (error) {
        handleError(error, '書籍の追加');
        throw error;
      }
    });
  }, [withLoadingState, handleError, setBooks, setEmptySeries]);

  const createSeries = useCallback(async (seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return withLoadingState('createSeries', async () => {
      try {
        // データ検証とサニタイゼーション
        const validatedSeriesData = validateSeriesOrThrow(seriesData);
        
        const newSeries = await seriesService.createSeries(validatedSeriesData);
        // 新しく作成されたシリーズを空のシリーズリストに追加
        setEmptySeries((prev) => [...prev, newSeries]);
        return newSeries.id;
      } catch (error) {
        handleError(error, 'シリーズの作成');
        throw error;
      }
    });
  }, [withLoadingState, handleError, setEmptySeries]);

  return {
    addBook,
    createSeries,
  };
};