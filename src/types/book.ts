export interface Book {
  id: number;
  title: string;
  volume: number;
  author: string;
  thumbnail: string;
  store: StoreKey;
  purchaseDate: string;
  price: number;
  url: string;
  description?: string;
}

export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  description: string;
}

export type StoreKey = "kindle" | "kobo" | "bookwalker";

export interface SeriesStats {
  volumeCount: number;
  minVolume: number;
  maxVolume: number;
  stores: StoreKey[];
  totalPrice: number;
  latestPurchase: Date;
}

export interface GroupedBooks {
  [seriesTitle: string]: Book[];
}
