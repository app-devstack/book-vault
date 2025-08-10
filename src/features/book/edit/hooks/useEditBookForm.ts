import { BookWithRelations } from '@/db/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// フォームバリデーションスキーマ
export const editBookFormSchema = z.object({
  title: z.string().optional(),
  volume: z.preprocess((val): number | undefined => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      // TextInputがstringしか受け付けないので、ここで変換
      const parsed = parseInt(val);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }, z.number().optional()) as z.ZodType<number | undefined>,
  seriesId: z.string().optional(),
  description: z.string().optional(),
  targetUrl: z.string().optional(),
});
export type EditBookFormSchema = z.infer<typeof editBookFormSchema>;

export const useEditBookForm = (book: BookWithRelations | null | undefined) => {
  const form = useForm<EditBookFormSchema>({
    resolver: zodResolver(editBookFormSchema),
    defaultValues: {
      title: book?.title || undefined,
      volume: book?.volume || undefined,
      seriesId: book?.seriesId || undefined,
      description: book?.description || undefined,
      targetUrl: book?.targetUrl || undefined,
    },
  });

  return form;
};
