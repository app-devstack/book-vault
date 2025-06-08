export type GoogleBooksResponse = {
  items: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      publisher?: string;

      description?: string;

      // publishedDate?: string;
      // pageCount?: number;

      industryIdentifiers?: { type: string; identifier: string }[];

      // 画像リング
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };

      // 巻数
      seriesInfo?: {
        bookDisplayNumber: string;
        volumeSeries: { seriesId: string; orderNumber: number };
      };

      //Googleブックスの正規のリンク
      canonicalVolumeLink?: string;
    };
  }[];
};

export type BookSearchItemType = GoogleBooksResponse["items"][number];
