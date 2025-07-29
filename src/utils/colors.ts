export const COLORS = {
  primary: '#4A90E2', // ブルー
  primaryForeground: '#F0F8FF',
  primaryDark: '#357ABD',
  primaryLight: '#7BB3F0',
  accent: '#88C999', // 薄緑のアクセント
  accentDark: '#10B981', // 濃い緑のアクセント
  background: '#F0F8FF', // アリスブルー背景
  card: '#FFFFFF',
  text: '#2C3E50',
  textLight: '#5D6D7E',
  border: '#D6EAF8',
  success: '#27AE60',
  warning: '#F39C12',
  shadow: 'rgba(0,0,0,0.1)',
  shadowDark: 'rgba(0,0,0,0.15)',
  error: '#EF4444',
  muted: '#E8F0F2', // 薄いグレー
} as const;

export const GRADIENTS = {
  primary: [COLORS.primary, COLORS.primaryDark],
  card: [COLORS.card, COLORS.background],
} as const;

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
