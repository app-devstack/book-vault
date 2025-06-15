# 画面固有フック設計書

**作成日**: 2025年6月15日  
**対象**: Book-Vault アプリの新しい状態管理アーキテクチャ

## 1. 設計原則

### 1.1 基本方針
- **単一責任の原則**: 各フックは特定の画面または機能に特化
- **React Query中心**: サーバー状態管理はReact Queryに委譲
- **最小限のローカル状態**: 画面固有のUI状態のみuseStateで管理
- **型安全性**: 厳密な型定義でランタイムエラーを防止

### 1.2 フック構成階層
```
hooks/
├── queries/          # React Queryベースのデータ取得フック
├── mutations/        # React Queryベースの変更操作フック
├── screens/          # 画面固有の統合フック
└── shared/           # 共通ユーティリティフック
```

## 2. クエリフック設計

### 2.1 書籍関連クエリ

#### useBooks (既存の改良版)
```typescript
// src/hooks/queries/useBooks.ts
import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

export interface UseBooksOptions {
  useCache?: boolean;
  limit?: number;
  offset?: number;
  seriesId?: string;
}

export const useBooks = (options?: UseBooksOptions) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.BOOKS, options],
    queryFn: () => bookService.getAllBooks(options),
    ...QUERY_OPTIONS.DEFAULT,
    enabled: true,
  });
};
```

#### useBookDetail
```typescript
// src/hooks/queries/useBookDetail.ts
export const useBookDetail = (bookId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOK(bookId),
    queryFn: () => bookService.getBookById(bookId),
    ...QUERY_OPTIONS.DEFAULT,
    enabled: !!bookId,
  });
};
```

### 2.2 シリーズ関連クエリ

#### useSeriesList
```typescript
// src/hooks/queries/useSeriesList.ts
import { seriesService } from '@/utils/service/series-service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';

export const useSeriesList = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SERIES_LIST,
    queryFn: seriesService.getAllSeriesWithBooks,
    ...QUERY_OPTIONS.DEFAULT,
    select: (data) => data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  });
};
```

#### useSeriesDetail
```typescript
// src/hooks/queries/useSeriesDetail.ts
export const useSeriesDetail = (seriesId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SERIES_DETAIL(seriesId),
    queryFn: () => seriesService.getSeriesWithBooks(seriesId),
    ...QUERY_OPTIONS.DEFAULT,
    enabled: !!seriesId,
  });
};
```

#### useSeriesOptions
```typescript
// src/hooks/queries/useSeriesOptions.ts
export interface SeriesOption {
  id: string;
  title: string;
  author: string;
  bookCount: number;
}

export const useSeriesOptions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SERIES_OPTIONS,
    queryFn: () => seriesService.getSeriesOptions(),
    ...QUERY_OPTIONS.STATIC, // あまり変更されないため長期キャッシュ
    select: (data: SeriesOption[]) => 
      data.sort((a, b) => a.title.localeCompare(b.title)),
  });
};
```

### 2.3 統計情報クエリ

#### useAppStats
```typescript
// src/hooks/queries/useAppStats.ts
export interface AppStats {
  totalBooks: number;
  totalSeries: number;
  averageBooksPerSeries: number;
  recentlyAddedCount: number;
}

export const useAppStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.APP_STATS,
    queryFn: async (): Promise<AppStats> => {
      const [books, series] = await Promise.all([
        bookService.getAllBooks(),
        seriesService.getAllSeries(),
      ]);
      
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentlyAddedCount = books.filter(
        book => new Date(book.createdAt) > oneWeekAgo
      ).length;
      
      return {
        totalBooks: books.length,
        totalSeries: series.length,
        averageBooksPerSeries: series.length > 0 ? books.length / series.length : 0,
        recentlyAddedCount,
      };
    },
    ...QUERY_OPTIONS.FREQUENT, // 頻繁に更新される可能性
  });
};
```

### 2.4 検索関連クエリ

#### useBookSearch
```typescript
// src/hooks/queries/useBookSearch.ts
import { googleBooksService } from '@/utils/googleBooks';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';
import { useQuery } from '@tanstack/react-query';
import { BookSearchResult } from '@/types/book';

export const useBookSearch = (query: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.GOOGLE_BOOKS_SEARCH(query),
    queryFn: () => googleBooksService.searchBooks(query),
    ...QUERY_OPTIONS.SEARCH,
    enabled: query.length >= 2, // 2文字以上で検索開始
    select: (data: BookSearchResult[]) => 
      data.filter(book => book.title && book.author), // 必須フィールドのみ
  });
};
```

## 3. ミューテーションフック設計

### 3.1 書籍関連ミューテーション

#### useAddBook
```typescript
// src/hooks/mutations/useAddBook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '@/utils/service/book-service';
import { QUERY_KEYS } from '@/utils/constants/query';
import { NewBook } from '@/db/types';
import Toast from 'react-native-toast-message';

export const useAddBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookData: NewBook) => bookService.createBook(bookData),
    onMutate: async (newBook) => {
      // 楽観的更新の準備
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.BOOKS });
      
      const previousBooks = queryClient.getQueryData(QUERY_KEYS.BOOKS);
      
      // 楽観的更新実行
      queryClient.setQueryData(QUERY_KEYS.BOOKS, (old: any) => {
        if (!old) return [newBook];
        return [...old, { ...newBook, id: 'temp-' + Date.now() }];
      });
      
      return { previousBooks };
    },
    onError: (err, newBook, context) => {
      // エラー時にロールバック
      if (context?.previousBooks) {
        queryClient.setQueryData(QUERY_KEYS.BOOKS, context.previousBooks);
      }
      
      Toast.show({
        type: 'error',
        text1: '登録エラー',
        text2: '書籍の登録に失敗しました',
      });
    },
    onSuccess: (data, variables) => {
      // 関連するクエリを無効化して最新データを取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APP_STATS });
      
      if (variables.seriesId) {
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.SERIES_DETAIL(variables.seriesId) 
        });
      }
      
      Toast.show({
        type: 'success',
        text1: '登録完了',
        text2: '書籍が正常に登録されました',
      });
    },
  });
};
```

#### useDeleteBook
```typescript
// src/hooks/mutations/useDeleteBook.ts
export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookId: string) => bookService.deleteBook(bookId),
    onMutate: async (deletedBookId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.BOOKS });
      
      const previousBooks = queryClient.getQueryData(QUERY_KEYS.BOOKS);
      
      // 楽観的更新
      queryClient.setQueryData(QUERY_KEYS.BOOKS, (old: any) => {
        if (!old) return [];
        return old.filter((book: any) => book.id !== deletedBookId);
      });
      
      return { previousBooks, deletedBookId };
    },
    onError: (err, deletedBookId, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(QUERY_KEYS.BOOKS, context.previousBooks);
      }
      
      Toast.show({
        type: 'error',
        text1: '削除エラー',
        text2: '書籍の削除に失敗しました',
      });
    },
    onSuccess: (data, deletedBookId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APP_STATS });
      
      Toast.show({
        type: 'success',
        text1: '削除完了',
        text2: '書籍が削除されました',
      });
    },
  });
};
```

### 3.2 シリーズ関連ミューテーション

#### useCreateSeries
```typescript
// src/hooks/mutations/useCreateSeries.ts
export const useCreateSeries = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>) => 
      seriesService.createSeries(seriesData),
    onSuccess: (newSeries) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_OPTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APP_STATS });
      
      Toast.show({
        type: 'success',
        text1: 'シリーズ作成完了',
        text2: `「${newSeries.title}」が作成されました`,
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'シリーズ作成エラー',
        text2: 'シリーズの作成に失敗しました',
      });
    },
  });
};
```

## 4. 画面固有フック設計

### 4.1 ホーム画面用フック

```typescript
// src/hooks/screens/useHomeScreen.ts
import { useSeriesList } from '@/hooks/queries/useSeriesList';
import { useAppStats } from '@/hooks/queries/useAppStats';
import { useMemo } from 'react';

export const useHomeScreen = () => {
  const seriesQuery = useSeriesList();
  const statsQuery = useAppStats();
  
  const isLoading = seriesQuery.isLoading || statsQuery.isLoading;
  const error = seriesQuery.error || statsQuery.error;
  
  const getSeriesStats = useMemo(() => {
    return (books: Book[]) => ({
      volumeCount: books.length,
      latestVolumeDate: books.reduce((latest, book) => {
        const bookDate = new Date(book.createdAt);
        return bookDate > latest ? bookDate : latest;
      }, new Date(0)),
    });
  }, []);
  
  const refetch = () => {
    seriesQuery.refetch();
    statsQuery.refetch();
  };
  
  return {
    // データ
    seriesedBooks: seriesQuery.data || [],
    totalStats: statsQuery.data,
    
    // 状態
    isLoading,
    error,
    
    // アクション
    getSeriesStats,
    refetch,
  };
};
```

### 4.2 登録画面用フック

```typescript
// src/hooks/screens/useBookRegistration.ts
import { useState, useCallback } from 'react';
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

export const useBookRegistration = () => {
  const [formData, setFormData] = useState<BookRegistrationForm>({
    searchQuery: '',
    selectedBook: null,
    selectedSeriesId: null,
    targetURL: '',
  });
  
  // クエリとミューテーション
  const searchQuery = useBookSearch(formData.searchQuery);
  const seriesOptionsQuery = useSeriesOptions();
  const addBookMutation = useAddBook();
  const createSeriesMutation = useCreateSeries();
  
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
  
  return {
    // フォームデータ
    formData,
    
    // 検索関連
    searchResults: searchQuery.data || [],
    isSearching: searchQuery.isLoading,
    searchBooks,
    
    // 書籍選択
    selectBook,
    
    // シリーズ関連
    seriesOptions: seriesOptionsQuery.data || [],
    selectedSeriesId: formData.selectedSeriesId,
    selectSeries,
    createSeries,
    isCreatingSeries: createSeriesMutation.isLoading,
    
    // URL設定
    targetURL: formData.targetURL,
    setTargetURL,
    
    // 登録処理
    registerBook,
    isRegistering: addBookMutation.isLoading,
    
    // エラー状態
    error: searchQuery.error || seriesOptionsQuery.error,
  };
};
```

### 4.3 シリーズ詳細画面用フック

```typescript
// src/hooks/screens/useSeriesDetail.ts
import { useSeriesDetail } from '@/hooks/queries/useSeriesDetail';
import { useDeleteBook } from '@/hooks/mutations/useDeleteBook';
import { useMemo } from 'react';

export const useSeriesDetail = (seriesId: string) => {
  const seriesDetailQuery = useSeriesDetail(seriesId);
  const deleteBookMutation = useDeleteBook();
  
  const series = seriesDetailQuery.data;
  const books = series?.books || [];
  
  const stats = useMemo(() => ({
    volumeCount: books.length,
    latestVolume: books.reduce((latest, book) => {
      return book.volume && book.volume > (latest?.volume || 0) ? book : latest;
    }, books[0]),
    totalPages: books.reduce((sum, book) => sum + (book.pageCount || 0), 0),
  }), [books]);
  
  const deleteBook = async (bookId: string) => {
    await deleteBookMutation.mutateAsync(bookId);
  };
  
  return {
    // データ
    series,
    books,
    stats,
    
    // 状態
    isLoading: seriesDetailQuery.isLoading,
    error: seriesDetailQuery.error,
    
    // アクション
    deleteBook,
    isDeleting: deleteBookMutation.isLoading,
    refetch: seriesDetailQuery.refetch,
  };
};
```

### 4.4 書籍詳細モーダル用フック

```typescript
// src/hooks/screens/useBookDetailModal.ts
import { useState } from 'react';
import { useDeleteBook } from '@/hooks/mutations/useDeleteBook';
import { Book } from '@/db/types';

export const useBookDetailModal = (
  book: Book | null,
  onClose: () => void,
  onBookDeleted?: (bookId: string) => void
) => {
  const [isVisible, setIsVisible] = useState(false);
  const deleteBookMutation = useDeleteBook();
  
  const deleteBook = async () => {
    if (!book) return;
    
    try {
      await deleteBookMutation.mutateAsync(book.id);
      onBookDeleted?.(book.id);
      onClose();
    } catch (error) {
      // エラーハンドリングはmutation内で実行済み
      console.error('Delete book error:', error);
    }
  };
  
  return {
    isVisible,
    setIsVisible,
    deleteBook,
    isDeleting: deleteBookMutation.isLoading,
  };
};
```

## 5. 型定義

### 5.1 画面固有フックの型定義

```typescript
// src/types/hooks.ts
export interface UseHomeScreenReturn {
  seriesedBooks: SeriesWithBooks[];
  totalStats: AppStats | undefined;
  isLoading: boolean;
  error: Error | null;
  getSeriesStats: (books: Book[]) => SeriesStats;
  refetch: () => void;
}

export interface UseBookRegistrationReturn {
  formData: BookRegistrationForm;
  searchResults: BookSearchResult[];
  isSearching: boolean;
  searchBooks: (query: string) => void;
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
```

## 6. エラーハンドリング戦略

### 6.1 統一されたエラーハンドリング

```typescript
// src/hooks/shared/useErrorHandler.ts
export const useErrorHandler = () => {
  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    // エラーの種類に応じた処理
    if (error.name === 'NetworkError') {
      Toast.show({
        type: 'error',
        text1: 'ネットワークエラー',
        text2: 'インターネット接続を確認してください',
      });
    } else if (error.name === 'ValidationError') {
      Toast.show({
        type: 'error',
        text1: '入力エラー',
        text2: '入力内容を確認してください',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'エラー',
        text2: context || '処理中にエラーが発生しました',
      });
    }
  }, []);
  
  return { handleError };
};
```

## 7. 移行計画

### 7.1 Phase 2実装順序
1. 共通クエリフックの実装 (1日)
2. 共通ミューテーションフックの実装 (1日)
3. ホーム画面用フックの実装 (1日)
4. 登録画面用フックの実装 (1日)

### 7.2 テスト戦略
- 各フックの単体テスト
- React Testing Libraryでの統合テスト
- E2Eテストでの動作確認

## 8. パフォーマンス最適化

### 8.1 メモ化戦略
- 計算コストの高い処理はuseMemoでメモ化
- 関数はuseCallbackでメモ化
- React Queryのselectオプション活用

### 8.2 バンドルサイズ最適化
- tree-shakingに配慮したexport構造
- 必要な機能のみインポート
- 重複コードの排除