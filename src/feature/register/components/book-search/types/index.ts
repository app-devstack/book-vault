export type GoogleBooksResponse = {
  items: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      imageLinks?: {
        thumbnail: string;
      };
      description?: string;
      publishedDate?: string;
      publisher?: string;
      pageCount?: number;
    };
  }[];
};

export type BookSearchItemType = GoogleBooksResponse["items"][number];
