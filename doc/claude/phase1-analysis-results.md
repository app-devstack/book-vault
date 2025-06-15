# Phase 1 分析結果

**作成日**: 2025年6月15日  
**対象**: Book-Vault アプリの現在の状態管理分析

## 1. 現在のBooksProviderの責務分析

### 1.1 BooksProviderの構造

現在のBooksProviderは以下の複数のフックを組み合わせて構成されています：

#### 使用しているフック
- `useErrorHandler`: エラーハンドリングと再試行ロジック
- `useLoadingStates`: ローディング状態管理
- `useUndo`: アンドゥ機能
- `useBookData`: 書籍データの状態管理と初期化
- `useDataTransform`: データの変換とメモ化
- `useBookMutations`: 書籍・シリーズの追加操作
- `useBulkOperations`: 一括更新操作
- `useBookDeletion`: 削除操作（単体・一括）

#### 提供している機能
```typescript
{
  // Data
  books: BookWithRelations[],
  seriesedBooks: SeriesWithBooks[],
  totalStats: { seriesCount: number, bookCount: number },

  // Loading states
  loading: { initialize: boolean },

  // Error handling
  error: any,
  clearError: () => void,

  // Actions
  initializeBooks: () => Promise<void>,
  addBook: (bookData: NewBook) => Promise<void>,
  removeBook: (bookId: string) => Promise<void>,
  removeSeries: (seriesId: string) => Promise<void>,
  createSeries: (seriesData) => Promise<string>,
  getSeriesStats: (books: Book[]) => SeriesStats,
  
  // Bulk operations
  removeBooksInBulk: (bookIds: string[]) => Promise<void>,
  updateBooksInBulk: (updates) => Promise<void>,
  
  // Undo functionality
  executeUndo: () => Promise<void>,
  canUndo: boolean,
  isUndoing: boolean,
  clearUndoStack: () => void,
}
```

### 1.2 問題点の特定

#### 過度な集約
- **全画面共通**: すべての画面で全ての書籍データを保持
- **重複データ管理**: `books`と`seriesedBooks`で同じデータを異なる形式で保持
- **不要な再レンダリング**: 一部の書籍が更新されても全画面が再レンダリング

#### 複雑性の増大
- **単一責任の原則違反**: データ取得、変換、CRUD操作、エラー処理、アンドゥ機能など多岐にわたる責務
- **テストの困難さ**: 複数の関心事が混在
- **デバッグの困難さ**: 状態変更の影響範囲が不明確

## 2. 各画面で実際に必要な状態の洗い出し

### 2.1 ホーム画面（HomeScreen）

#### 現在の使用状況
```typescript
const { seriesedBooks, getSeriesStats, totalStats } = useBooksContext();
```

#### 必要な状態
- **表示データ**: シリーズ一覧（SeriesWithBooks[]）
- **統計情報**: 総シリーズ数、総書籍数
- **画面固有状態**: なし（純粋な表示画面）

#### 最適化案
- **React Queryで直接取得**: `useSeriesQuery()`
- **統計情報も分離**: `useStatsQuery()`
- **キャッシュ活用**: 他画面での変更も自動反映

### 2.2 シリーズ詳細画面（SeriesDetailPage）

#### 現在の使用状況
```typescript
const { seriesedBooks, getSeriesStats } = useBooksContext();
const series = seriesedBooks.find(series => series.id === seriesId);
```

#### 必要な状態
- **表示データ**: 特定シリーズの詳細情報と書籍一覧
- **統計情報**: シリーズ内の書籍統計
- **画面固有状態**: なし（純粋な表示画面）

#### 最適化案
- **個別クエリ**: `useSeriesDetailQuery(seriesId)`
- **必要なデータのみ取得**: 全書籍データが不要
- **URLパラメータ活用**: seriesIdベースでの直接アクセス

### 2.3 登録画面（RegisterPage）

#### 現在の使用状況
```typescript
// RegisterPage自体はuseBooksContextを使用せず、useSearchを使用
const { searchQuery, setSearchQuery, searchResults, isSearching, searchBooks } = useSearch();
```

#### RegisterDetailModalでの使用状況
```typescript
const { seriesedBooks, createSeries } = useBooksContext();
```

#### 必要な状態
- **検索状態**: 検索クエリ、検索結果、ローディング状態
- **フォーム状態**: 登録対象書籍、選択シリーズ、URL入力
- **シリーズ選択**: 既存シリーズ一覧（選択用）
- **CRUD操作**: 書籍登録、シリーズ作成

#### 最適化案
- **検索状態分離**: `useBookSearchQuery(query)`（React Query）
- **フォーム状態**: `useState`または`useForm`
- **シリーズ選択**: `useSeriesOptionsQuery()`（軽量なシリーズ一覧）
- **ミューテーション**: `useAddBookMutation()`, `useCreateSeriesMutation()`

### 2.4 書籍詳細モーダル（BookDetailModal）

#### 現在の使用状況
```typescript
const { removeBook } = useBooksContext();
```

#### 必要な状態
- **表示データ**: 個別書籍の詳細情報
- **CRUD操作**: 書籍削除
- **UI状態**: 削除中フラグ

#### 最適化案
- **個別クエリ**: `useBookDetailQuery(bookId)`（必要に応じて）
- **ミューテーション**: `useDeleteBookMutation()`
- **楽観的更新**: 削除後の即座のUI反映

## 3. React Queryの現在の設定状況

### 3.1 現在の設定
```typescript
// root-layout-provider.tsx
const queryClient = new QueryClient(); // デフォルト設定

// query.ts
export const QUERY_CACHE_TIME = {
  STALE_TIME: 5 * 60 * 1000,  // 5分
  GC_TIME: 10 * 60 * 1000,    // 10分
} as const;

export const QUERY_OPTIONS = {
  DEFAULT: {
    staleTime: QUERY_CACHE_TIME.STALE_TIME,
    gcTime: QUERY_CACHE_TIME.GC_TIME,
  },
} as const;
```

### 3.2 現在使用されているクエリ
- `useBooks()`: 全書籍データ取得（TanStack Query）
- ただし、実際にはBooksProviderが主に使用されている状況

### 3.3 最適化の必要性
- **クエリキーの体系化**: より細かい粒度でのキャッシュ管理
- **楽観的更新**: ユーザビリティ向上
- **バックグラウンド更新**: データ鮮度の維持
- **エラーハンドリング**: 統一されたエラー処理

## 4. 新しい画面固有フックの設計方針

### 4.1 基本設計原則

#### 単一責任の原則
- 各フックは特定の画面または機能に特化
- 関心事の分離を徹底

#### React Queryベース
- サーバー状態はReact Queryで管理
- キャッシュ機能を最大限活用

#### 最小限のローカル状態
- 画面固有のUI状態のみuseStateで管理
- フォーム状態は適切なライブラリを使用

### 4.2 提案するフック構成

#### ホーム画面用
```typescript
// src/hooks/screens/useHomeScreen.ts
export const useHomeScreen = () => {
  const seriesQuery = useSeriesListQuery();
  const statsQuery = useStatsQuery();
  
  return {
    series: seriesQuery.data || [],
    stats: statsQuery.data,
    isLoading: seriesQuery.isLoading || statsQuery.isLoading,
    error: seriesQuery.error || statsQuery.error,
    refetch: () => {
      seriesQuery.refetch();
      statsQuery.refetch();
    }
  };
};
```

#### 登録画面用
```typescript
// src/hooks/screens/useBookRegistration.ts
export const useBookRegistration = () => {
  const [formData, setFormData] = useState<BookRegistrationForm>({});
  const searchQuery = useBookSearchQuery(formData.searchQuery);
  const seriesOptions = useSeriesOptionsQuery();
  const addBookMutation = useAddBookMutation();
  const createSeriesMutation = useCreateSeriesMutation();
  
  const handleRegister = async (bookData: NewBook) => {
    // フォームバリデーション
    // 書籍登録処理
    // フォームリセット
  };
  
  return {
    // 検索関連
    searchResults: searchQuery.data || [],
    isSearching: searchQuery.isLoading,
    searchBooks: (query: string) => searchQuery.refetch({ query }),
    
    // フォーム関連
    formData,
    setFormData,
    
    // シリーズ関連
    seriesOptions: seriesOptions.data || [],
    createSeries: createSeriesMutation.mutate,
    
    // 登録処理
    registerBook: handleRegister,
    isRegistering: addBookMutation.isLoading,
  };
};
```

#### シリーズ詳細画面用
```typescript
// src/hooks/screens/useSeriesDetail.ts
export const useSeriesDetail = (seriesId: string) => {
  const seriesDetailQuery = useSeriesDetailQuery(seriesId);
  const deleteBookMutation = useDeleteBookMutation();
  
  return {
    series: seriesDetailQuery.data,
    books: seriesDetailQuery.data?.books || [],
    isLoading: seriesDetailQuery.isLoading,
    error: seriesDetailQuery.error,
    deleteBook: deleteBookMutation.mutate,
    isDeleting: deleteBookMutation.isLoading,
  };
};
```

### 4.3 共通ユーティリティフック

#### クエリフック
```typescript
// src/hooks/queries/useSeriesQueries.ts
export const useSeriesListQuery = () => useQuery({
  queryKey: QUERY_KEYS.SERIES_LIST,
  queryFn: seriesService.getAllSeries,
  ...QUERY_OPTIONS.DEFAULT,
});

export const useSeriesDetailQuery = (seriesId: string) => useQuery({
  queryKey: QUERY_KEYS.SERIES_DETAIL(seriesId),
  queryFn: () => seriesService.getSeriesById(seriesId),
  ...QUERY_OPTIONS.DEFAULT,
});

export const useSeriesOptionsQuery = () => useQuery({
  queryKey: QUERY_KEYS.SERIES_OPTIONS,
  queryFn: seriesService.getSeriesOptions, // 軽量なシリーズ一覧
  ...QUERY_OPTIONS.DEFAULT,
});
```

#### ミューテーションフック
```typescript
// src/hooks/mutations/useBookMutations.ts
export const useAddBookMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookService.createBook,
    onSuccess: () => {
      // 関連するクエリを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
    },
  });
};
```

## 5. 移行戦略

### 5.1 段階的移行アプローチ

#### Phase 2: 画面固有フックの実装
1. 共通クエリ・ミューテーションフックの作成
2. 画面固有フックの実装
3. 各フックの単体テスト作成

#### Phase 3: 画面の段階的移行
1. 最もシンプルなホーム画面から開始
2. シリーズ詳細画面の移行
3. 登録画面の移行（最も複雑）
4. モーダルコンポーネントの移行

#### Phase 4: グローバル状態の整理
1. 不要になったBooksProviderの機能を特定
2. 必要最小限のグローバル状態（設定、認証など）の分離
3. 旧BooksProviderの段階的削除

### 5.2 品質保証
- 各段階での動作確認
- 型安全性の維持
- パフォーマンステストの実行
- E2Eテストによる回帰テスト

## 6. 期待される効果

### 6.1 パフォーマンス向上
- **メモリ使用量削減**: 必要なデータのみ保持
- **再レンダリング最適化**: 影響範囲の局所化
- **初期表示高速化**: 画面別の最適化されたデータフェッチ

### 6.2 開発体験向上
- **デバッグ容易性**: 状態管理の局所化
- **テスト容易性**: 単一責任のフック
- **保守性**: 明確な責務分離

### 6.3 ユーザビリティ向上
- **楽観的更新**: 即座のフィードバック
- **バックグラウンド更新**: 常に最新のデータ
- **エラーハンドリング**: 統一されたエラー処理