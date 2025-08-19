import { NewBook } from '@/db/types';
import { useAddBook } from '@/hooks/mutations/useAddBook';
import { useCreateSeries } from '@/hooks/mutations/useCreateSeries';
import { useBookSearch } from '@/hooks/queries/useBookSearch';
import { useSeriesList } from '@/hooks/queries/useSeriesList';
import { BookSearchResult } from '@/types/book';
import { useDebounce } from '@uidotdev/usehooks';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

interface BookRegistrationForm {
  searchQuery: string;
  selectedBook: BookSearchResult | null;
  selectedSeriesId: string | null;
  targetURL: string;
}

const SEARCH_DEBOUNCE_DELAY = 500;

/**
 * 書籍登録画面で使用する検索・選択・登録機能を統合管理するフック
 */
export const useBookRegistration = () => {
  const { path: _, search } = useLocalSearchParams<{ path: string; search?: string }>();
  const [formData, setFormData] = useState<BookRegistrationForm>({
    searchQuery: search || '',
    selectedBook: null,
    selectedSeriesId: null,
    targetURL: '',
  });

  // デバウンスされた検索クエリ
  const debouncedSearchQuery = useDebounce(formData.searchQuery, SEARCH_DEBOUNCE_DELAY);

  // クエリとミューテーション
  const searchQuery = useBookSearch(debouncedSearchQuery);
  const seriesQuery = useSeriesList();
  const addBookMutation = useAddBook();
  const createSeriesMutation = useCreateSeries();

  // 検索状態の判定
  const isSearching =
    searchQuery.isLoading ||
    (formData.searchQuery !== debouncedSearchQuery && formData.searchQuery.length >= 2);

  // 検索実行
  const searchBooks = useCallback((query: string) => {
    setFormData((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  // 書籍選択
  const selectBook = useCallback((book: BookSearchResult) => {
    setFormData((prev) => ({
      ...prev,
      selectedBook: book,
      targetURL: ``,
    }));
  }, []);

  // シリーズ選択
  const selectSeries = useCallback((seriesId: string | null) => {
    setFormData((prev) => ({ ...prev, selectedSeriesId: seriesId }));
  }, []);

  // URL設定
  const setTargetURL = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, targetURL: url }));
  }, []);

  // 新しいシリーズ作成
  const createSeries = useCallback(
    async (seriesData: any) => {
      const newSeries = await createSeriesMutation.mutateAsync(seriesData);
      setFormData((prev) => ({ ...prev, selectedSeriesId: newSeries.id }));
      return newSeries.id;
    },
    [createSeriesMutation]
  );

  // 書籍登録
  const registerBook = useCallback(async () => {
    if (!formData.selectedBook) {
      throw new Error('書籍が選択されていません');
    }

    const bookData: NewBook = {
      ...formData.selectedBook,
      seriesId: formData.selectedSeriesId || '',
      targetUrl: formData.targetURL,
      shopId: '', // 空文字列または適切なデフォルト値
    } satisfies NewBook;

    await addBookMutation.mutateAsync(bookData);

    // フォームリセット
    setFormData({
      searchQuery: '',
      selectedBook: null,
      selectedSeriesId: null,
      targetURL: '',
    });
  }, [formData, addBookMutation]);

  // 検索結果クリア
  const clearResults = useCallback(() => {
    setFormData((prev) => ({ ...prev, searchQuery: '', selectedBook: null }));
  }, []);

  return {
    // フォームデータ
    formData,

    // 検索関連
    searchResults: searchQuery.data || [],
    isSearching,
    searchBooks,
    clearResults,

    // 書籍選択
    selectBook,

    // シリーズ関連
    series: seriesQuery.data || [],
    selectedSeriesId: formData.selectedSeriesId,
    selectSeries,
    createSeries,
    isCreatingSeries: createSeriesMutation.isPending,

    // URL設定
    targetURL: formData.targetURL,
    setTargetURL,

    // 登録処理
    registerBook,
    isRegistering: addBookMutation.isPending,

    // エラー状態
    error: searchQuery.error || seriesQuery.error,
  };
};
