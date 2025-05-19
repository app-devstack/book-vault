interface Book {
  id: string;
  title: string;
  description: string;
  targetURL: string;
  imageURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { Book };
