# TanStack Query 移行ガイド

## 📋 概要

このドキュメントでは、既存のBooksProviderからTanStack Queryへの段階的な移行方法について説明します。

## 🚀 実装済み機能

### 1. 基本的なTanStack Queryフック

| フック名 | 説明 | 用途 |
|---------|------|------|
| `useBooks()` | 全書籍データを取得 | ホーム画面、一覧画面 |
| `useBook(id)` | 特定の書籍データを取得 | 詳細画面、編集画面 |
| `useSeriesBooks(seriesId)` | シリーズ別書籍データを取得 | シリーズ画面 |
| `useBooksStats()` | 統計情報を取得 | ダッシュボード、ヘッダー |
| `useRefreshBooks()` | 手動データ更新機能 | プルリフレッシュ、更新ボタン |

### 2. 新しいbook-serviceメソッド

- `getBookById(id: string)` - 特定書籍取得用のメソッドを追加済み

## 🔄 移行戦略

### Phase 1: 併用期間（推奨）

既存のBooksProviderとTanStack Queryを同時に使用しながら、段階的に移行します。

#### 移行前（現在）
```tsx
// 既存のBooksProviderを使用
import { useBooksContext } from "@/components/providers/books-provider";

const HomeScreen = () => {
  const { seriesedBooks, loading, error } = useBooksContext();
  // ...
};
```

#### 移行後（TanStack Query）
```tsx
// 新しいTanStack Queryフックを使用
import { useBooks } from "@/hooks/tanstack";

const HomeScreen = () => {
  const { data: books = [], isLoading, error } = useBooks();
  // データ変換は自分で行う
  const seriesedBooks = transformBooksToSeries(books);
  // ...
};
```

### Phase 2: 段階的な画面移行

#### 1. ホーム画面の移行

実装例: `src/features/home/HomeScreen.tanstack.tsx`

**主な変更点:**
- `useBooksContext()` → `useBooks()` + `useBooksStats()`
- 手動でのデータ変換（`transformBooksToSeries`）
- より詳細なローディング・エラーハンドリング

#### 2. 書籍詳細画面の移行

```tsx
// Before
const BookDetail = ({ bookId }: { bookId: string }) => {
  const { books } = useBooksContext();
  const book = books.find(b => b.id === bookId);
  // ...
};

// After
const BookDetail = ({ bookId }: { bookId: string }) => {
  const { data: book, isLoading, error } = useBook(bookId);
  // ...
};
```

#### 3. シリーズ画面の移行

```tsx
// Before
const SeriesScreen = ({ seriesId }: { seriesId: string }) => {
  const { seriesedBooks } = useBooksContext();
  const series = seriesedBooks.find(s => s.id === seriesId);
  // ...
};

// After
const SeriesScreen = ({ seriesId }: { seriesId: string }) => {
  const { data: books = [], isLoading, error } = useSeriesBooks(seriesId);
  // ...
};
```

## 🎯 主な利点

### 1. パフォーマンス向上

- **自動キャッシュ**: 同じデータを複数回取得しない
- **バックグラウンド更新**: ユーザーが気づかない間にデータを更新
- **ページネーション**: 大量データの効率的な取得

### 2. 開発体験の向上

- **TypeScript サポート**: 型安全性の向上
- **開発者ツール**: React Query DevToolsでデバッグが簡単
- **エラーハンドリング**: 統一されたエラー処理

### 3. ユーザー体験の向上

- **オフライン対応**: キャッシュされたデータで動作
- **楽観的更新**: ユーザーの操作に即座に反応
- **自動リトライ**: ネットワークエラー時の自動再試行

## 📦 使用方法

### 基本的な使用例

```tsx
import { useBooks, useRefreshBooks } from "@/hooks/tanstack";

const MyComponent = () => {
  const { data: books = [], isLoading, error } = useBooks();
  const { refreshAllBooks } = useRefreshBooks();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <View>
      <Button onPress={refreshAllBooks} title="更新" />
      {books.map(book => (
        <BookItem key={book.id} book={book} />
      ))}
    </View>
  );
};
```

### 条件付きクエリ

```tsx
const BookDetail = ({ bookId }: { bookId?: string }) => {
  // bookIdが存在する場合のみクエリを実行
  const { data: book, isLoading } = useBook(bookId);
  
  if (!bookId) return <div>書籍IDが必要です</div>;
  if (isLoading) return <LoadingSpinner />;
  
  return <BookDetailView book={book} />;
};
```

### 手動データ更新

```tsx
const RefreshButton = () => {
  const { refreshAllBooks, refetchAll } = useRefreshBooks();

  return (
    <View>
      <Button onPress={refreshAllBooks} title="キャッシュ無効化" />
      <Button onPress={refetchAll} title="強制再取得" />
    </View>
  );
};
```

## 🔧 設定とカスタマイズ

### 定数管理

TanStack Query関連の設定は `src/utils/constants/query.ts` で一元管理されています：

```typescript
export const QUERY_CACHE_TIME = {
  /** 5分間は fresh として扱う */
  STALE_TIME: 5 * 60 * 1000,
  /** 10分間キャッシュを保持 */
  GC_TIME: 10 * 60 * 1000,
} as const;

export const QUERY_KEYS = {
  /** 全書籍データ */
  BOOKS: ['books'] as const,
  /** 特定書籍データ */
  BOOK: (id: string) => ['books', id] as const,
  /** シリーズ別書籍データ */
  SERIES_BOOKS: (seriesId: string) => ['books', 'series', seriesId] as const,
  /** 統計情報 */
  BOOKS_STATS: ['books', 'stats'] as const,
} as const;

export const QUERY_OPTIONS = {
  /** デフォルトのクエリ設定 */
  DEFAULT: {
    staleTime: QUERY_CACHE_TIME.STALE_TIME,
    gcTime: QUERY_CACHE_TIME.GC_TIME,
  },
} as const;
```

### フックでの使用例

```typescript
import { QUERY_KEYS, QUERY_OPTIONS } from '@/utils/constants/query';

export const useBooks = (options?: BookQueryOptions) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.BOOKS, options],
    queryFn: () => bookService.getAllBooks(options),
    ...QUERY_OPTIONS.DEFAULT,
  });
};
```

## 🚧 注意点

### 1. データ変換の必要性

TanStack Queryは生データを返すため、既存の`seriesedBooks`のような変換されたデータは自分で作成する必要があります。

### 2. エラーハンドリング

BooksProviderとは異なるエラー形式のため、エラーハンドリングロジックの調整が必要です。

### 3. ローディング状態

複数のクエリを使用する場合、それぞれのローディング状態を管理する必要があります。

## 🔮 今後の拡張

### 1. Mutation フック

書籍の作成・更新・削除用のMutationフックを作成予定：

```typescript
const useCreateBook = () => {
  return useMutation({
    mutationFn: bookService.createBook,
    onSuccess: () => {
      // 成功時にキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
};
```

### 2. 無限スクロール

大量のデータを効率的に表示するための無限スクロール機能：

```typescript
const useInfiniteBooks = () => {
  return useInfiniteQuery({
    queryKey: ['books', 'infinite'],
    queryFn: ({ pageParam = 0 }) => 
      bookService.getAllBooks({ limit: 20, offset: pageParam }),
    // ...
  });
};
```

### 3. リアルタイム更新

WebSocketやServer-Sent Eventsを使用したリアルタイム更新機能の追加予定。

## 📝 実装チェックリスト

### 高優先度（完了済み）
- [x] TanStack Query プロバイダーの追加
- [x] useBooks() フック作成
- [x] useBook(id) フック作成
- [x] book-service に getBookById メソッド追加

### 中優先度（完了済み）
- [x] useSeriesBooks() フック作成
- [x] useBooksStats() フック作成
- [x] useRefreshBooks() フック作成
- [x] ホーム画面の実装例作成

### 低優先度（今後実装）
- [ ] Mutation フックの作成
- [ ] 無限スクロール機能の追加
- [ ] リアルタイム更新機能の追加
- [ ] 既存画面の段階的移行
- [ ] BooksProvider の段階的削除

## 📚 参考資料

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Cache Invalidation Strategies](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations)