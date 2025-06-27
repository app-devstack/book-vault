// TanStack Query関連の定数定義

export const QUERY_CACHE_TIME = {
  /** 1分間は fresh として扱う（頻繁に更新されるデータ用） */
  STALE_TIME_SHORT: 1 * 60 * 1000,
  /** 5分間は fresh として扱う（標準） */
  STALE_TIME: 5 * 60 * 1000,
  /** 15分間は fresh として扱う（あまり更新されないデータ用） */
  STALE_TIME_LONG: 15 * 60 * 1000,
  /** 10分間キャッシュを保持 */
  GC_TIME: 10 * 60 * 1000,
  /** 30分間キャッシュを保持（長期保持用） */
  GC_TIME_LONG: 30 * 60 * 1000,
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

  // 新しいクエリキー
  /** シリーズ一覧 */
  SERIES_LIST: ['series'] as const,
  /** 特定シリーズ詳細 */
  SERIES_DETAIL: (id: string) => ['series', id] as const,
  /** シリーズ選択用軽量一覧 */
  SERIES_OPTIONS: ['series', 'options'] as const,
  /** Google Books検索結果 */
  GOOGLE_BOOKS_SEARCH: (query: string) => ['google-books', 'search', query] as const,
  /** アプリ統計情報 */
  APP_STATS: ['app', 'stats'] as const,
} as const;

export const QUERY_OPTIONS = {
  /** デフォルトのクエリ設定 */
  DEFAULT: {
    staleTime: QUERY_CACHE_TIME.STALE_TIME,
    gcTime: QUERY_CACHE_TIME.GC_TIME,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  /** 頻繁に更新されるデータ用 */
  FREQUENT: {
    staleTime: QUERY_CACHE_TIME.STALE_TIME_SHORT,
    gcTime: QUERY_CACHE_TIME.GC_TIME,
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
  },
  /** あまり更新されないデータ用 */
  STATIC: {
    staleTime: QUERY_CACHE_TIME.STALE_TIME_LONG,
    gcTime: QUERY_CACHE_TIME.GC_TIME_LONG,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  /** 検索結果用（キャッシュ時間を短く） */
  SEARCH: {
    staleTime: QUERY_CACHE_TIME.STALE_TIME_SHORT,
    gcTime: QUERY_CACHE_TIME.GC_TIME,
    retry: 1,
    retryDelay: 1000,
  },
} as const;
