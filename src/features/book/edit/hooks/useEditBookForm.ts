import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BookWithRelations } from '@/db/types';
import { EditBookFormData } from './useBookFormData';

// フォームバリデーションスキーマ
const editBookFormSchema = z.object({
  title: z.string().optional(),
  volume: z.string().optional(),
  author: z.string().optional(),
  seriesId: z.string().optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
});

export const useEditBookForm = (book: BookWithRelations | null | undefined) => {
  const form = useForm<EditBookFormData>({
    resolver: zodResolver(editBookFormSchema),
    defaultValues: {
      title: book?.title || '',
      volume: book?.volume?.toString() || '',
      author: book?.author || '',
      seriesId: book?.seriesId || '',
      isbn: book?.isbn || '',
      description: book?.description || '',
    },
  });

  return form;
};