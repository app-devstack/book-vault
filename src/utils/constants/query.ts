// TanStack Query関連の定数定義

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