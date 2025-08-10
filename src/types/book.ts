export interface BookSearchResult {
  // id: string;
  googleBooksId: string;
  title: string;
  author?: string;
  volume?: number;
  publisher?: string;
  description: string;
  isbn?: string;
  imageUrl?: string;
  targetUrl: string;
  seriesId?: string;
}

export interface SeriesStats {
  volumeCount: number;
  // stores: StoreKey[];
  // latestPurchase: Date;
}
