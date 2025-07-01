import { NewBook } from '@/db/types';
import { useAddBook } from '@/hooks/mutations/useAddBook';
import { useCreateSeries } from '@/hooks/mutations/useCreateSeries';
import { useBookSearch } from '@/hooks/queries/useBookSearch';
import { useSeriesOptions } from '@/hooks/queries/useSeriesOptions';
import { BookSearchResult } from '@/types/book';
import { seriesService } from '@/utils/service/series-service';
import { useDebounce } from '@uidotdev/usehooks';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSafeState } from '@/hooks/useSafeState';

export interface BookRegistrationForm {
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
  const { safeSetState } = useSafeState();

  // デバウンスされた検索クエリ
  const debouncedSearchQuery = useDebounce(formData.searchQuery, SEARCH_DEBOUNCE_DELAY);

  // クエリとミューテーション
  const searchQuery = useBookSearch(debouncedSearchQuery);
  const seriesOptionsQuery = useSeriesOptions();
  const addBookMutation = useAddBook();
  const createSeriesMutation = useCreateSeries();

  // 検索状態の判定
  const isSearching =
    searchQuery.isLoading ||
    (formData.searchQuery !== debouncedSearchQuery && formData.searchQuery.length >= 2);

  // 検索実行
  const searchBooks = useCallback(
    (query: string) => {
      safeSetState(() => {
        setFormData((prev) => ({ ...prev, searchQuery: query }));
      });
    },
    [safeSetState]
  );

  // 書籍選択
  const selectBook = useCallback(
    (book: BookSearchResult) => {
      safeSetState(() => {
        setFormData((prev) => ({
          ...prev,
          selectedBook: book,
          targetURL: ``,
        }));
      });
    },
    [safeSetState]
  );

  // シリーズ選択
  const selectSeries = useCallback(
    (seriesId: string | null) => {
      safeSetState(() => {
        setFormData((prev) => ({ ...prev, selectedSeriesId: seriesId }));
      });
    },
    [safeSetState]
  );

  // URL設定
  const setTargetURL = useCallback(
    (url: string) => {
      safeSetState(() => {
        setFormData((prev) => ({ ...prev, targetURL: url }));
      });
    },
    [safeSetState]
  );

  // 新しいシリーズ作成（重複チェック付き）
  const createSeries = useCallback(
    async (seriesData: any) => {
      try {
        // タイトルと著者による重複チェック
        const existingSeries = await seriesService.getSeriesByTitleAndAuthor(
          seriesData.title,
          seriesData.author
        );

        if (existingSeries) {
          // 既存のシリーズが見つかった場合は、そのIDを使用
          safeSetState(() => {
            setFormData((prev) => ({ ...prev, selectedSeriesId: existingSeries.id }));
          });
          return existingSeries.id;
        }

        // 重複がない場合は新規作成
        const newSeries = await createSeriesMutation.mutateAsync(seriesData);
        safeSetState(() => {
          setFormData((prev) => ({ ...prev, selectedSeriesId: newSeries.id }));
        });
        return newSeries.id;
      } catch (error) {
        // UNIQUE制約エラーの場合は再度検索して既存のIDを返す
        if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
          const existingSeries = await seriesService.getSeriesByTitleAndAuthor(
            seriesData.title,
            seriesData.author
          );
          if (existingSeries) {
            safeSetState(() => {
              setFormData((prev) => ({ ...prev, selectedSeriesId: existingSeries.id }));
            });
            return existingSeries.id;
          }
        }
        throw error;
      }
    },
    [createSeriesMutation, safeSetState]
  );

  // 書籍登録
  const registerBook = useCallback(async () => {
    if (!formData.selectedBook) {
      throw new Error('書籍が選択されていません');
    }

    const bookData: NewBook = {
      title: formData.selectedBook.title,
      author: formData.selectedBook.author,
      description: formData.selectedBook.description,
      imageUrl: formData.selectedBook.imageUrl,
      isbn: formData.selectedBook.isbn,
      googleBooksId: formData.selectedBook.googleBooksId,
      seriesId: formData.selectedSeriesId || '',
      targetUrl: formData.targetURL,
      shopId: '', // 空文字列または適切なデフォルト値
    };

    await addBookMutation.mutateAsync(bookData);

    // フォームリセット
    safeSetState(() => {
      setFormData({
        searchQuery: '',
        selectedBook: null,
        selectedSeriesId: null,
        targetURL: '',
      });
    });
  }, [formData, addBookMutation, safeSetState]);

  // 検索結果クリア
  const clearResults = useCallback(() => {
    safeSetState(() => {
      setFormData((prev) => ({ ...prev, searchQuery: '', selectedBook: null }));
    });
  }, [safeSetState]);

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
    seriesOptions: seriesOptionsQuery.data || [],
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
    error: searchQuery.error || seriesOptionsQuery.error,
  };
};
