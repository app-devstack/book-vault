import { Stores } from "../types/store";

export const STORES: Stores = {
  kindle: {
    name: "Kindle",
    color: "#FF9500",
    url: "https://kindle.amazon.co.jp",
  },
  kobo: {
    name: "楽天Kobo",
    color: "#ED1C24",
    url: "https://books.rakuten.co.jp",
  },
  bookwalker: {
    name: "BookWalker",
    color: "#00A0DC",
    url: "https://bookwalker.jp",
  },
};

export const SCREEN_PADDING = 20;
export const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
} as const;

export const ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
} as const;

export const FONT_SIZES = {
  xsmall: 10,
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 20,
  title: 24,
  hero: 28,
} as const;
