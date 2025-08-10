import { useCallback } from 'react';
import { NewBook } from '@/db/types';

export type EditBookFormData = {
  title?: string;
  volume?: string;
  author?: string;
  seriesId?: string;
  isbn?: string;
  description?: string;
};

export const useBookFormData = () => {
  // データ変換ヘルパー関数
  const trimStringOrNull = useCallback((value: string | undefined): string | null => {
    if (value === undefined) return null;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }, []);

  const parseVolumeNumber = useCallback((volume: string | undefined): number | null => {
    if (volume === undefined) return null;
    const trimmed = volume.trim();
    if (trimmed === '') return null;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  }, []);

  // フォームデータを更新用データに変換
  const transformFormData = useCallback((data: EditBookFormData): Partial<NewBook> => {
    return {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.volume !== undefined && { volume: parseVolumeNumber(data.volume) }),
      ...(data.author !== undefined && { author: trimStringOrNull(data.author) }),
      ...(data.seriesId && { seriesId: data.seriesId }),
      ...(data.isbn !== undefined && { isbn: trimStringOrNull(data.isbn) }),
      ...(data.description !== undefined && { description: trimStringOrNull(data.description) }),
    };
  }, [trimStringOrNull, parseVolumeNumber]);

  return {
    transformFormData,
  };
};