import { useState, useCallback } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useBookSearch } from '@/hooks/queries/useBookSearch';
import { useSeriesOptions } from '@/hooks/queries/useSeriesOptions';
import { useAddBook } from '@/hooks/mutations/useAddBook';
import { useCreateSeries } from '@/hooks/mutations/useCreateSeries';
import { BookSearchResult } from '@/types/book';
import { NewBook } from '@/db/types';

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
  const [formData, setFormData] = useState<BookRegistrationForm>({
    searchQuery: '',
    selectedBook: null,
    selectedSeriesId: null,
    targetURL: '',
  });
  
  // デバウンスされた検索クエリ
  const debouncedSearchQuery = useDebounce(formData.searchQuery, SEARCH_DEBOUNCE_DELAY);
  
  // クエリとミューテーション
  const searchQuery = useBookSearch(debouncedSearchQuery);
  const seriesOptionsQuery = useSeriesOptions();
  const addBookMutation = useAddBook();
  const createSeriesMutation = useCreateSeries();
  
  // 検索状態の判定
  const isSearching = searchQuery.isLoading || (formData.searchQuery !== debouncedSearchQuery && formData.searchQuery.length >= 2);
  
  // 検索実行
  const searchBooks = useCallback((query: string) => {
    setFormData(prev => ({ ...prev, searchQuery: query }));
  }, []);
  
  // 書籍選択
  const selectBook = useCallback((book: BookSearchResult) => {
    setFormData(prev => ({
      ...prev,
      selectedBook: book,
      targetURL: `https://books.google.com/books?id=${book.googleBooksId}`,
    }));
  }, []);
  
  // シリーズ選択
  const selectSeries = useCallback((seriesId: string | null) => {
    setFormData(prev => ({ ...prev, selectedSeriesId: seriesId }));
  }, []);
  
  // URL設定
  const setTargetURL = useCallback((url: string) => {
    setFormData(prev => ({ ...prev, targetURL: url }));
  }, []);
  
  // 新しいシリーズ作成
  const createSeries = useCallback(async (seriesData: any) => {
    const newSeries = await createSeriesMutation.mutateAsync(seriesData);
    setFormData(prev => ({ ...prev, selectedSeriesId: newSeries.id }));
    return newSeries.id;
  }, [createSeriesMutation]);
  
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
    setFormData({
      searchQuery: '',
      selectedBook: null,
      selectedSeriesId: null,
      targetURL: '',
    });
  }, [formData, addBookMutation]);
  
  // 検索結果クリア
  const clearResults = useCallback(() => {
    setFormData(prev => ({ ...prev, searchQuery: '', selectedBook: null }));
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