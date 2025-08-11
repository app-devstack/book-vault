/**
 * シリーズ詳細ヘッダーの定数定義
 */

export const HEADER_CONSTANTS = {
  ICONS: {
    SIZE: {
      SMALL: '$1' as const,
      MEDIUM: '$2' as const,
    },
    COLORS: {
      PRIMARY: '#4A90E2',
      ERROR: '#EF4444',
    },
  },
  BUTTON: {
    SIZE: 40,
  },
  MENU: {
    TOP_OFFSET: 60,
    MIN_WIDTH: 160,
  },
} as const;
