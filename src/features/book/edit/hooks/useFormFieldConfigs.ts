import { useMemo } from 'react';
import { KeyboardTypeOptions } from 'react-native';
import { EditBookFormData } from './useBookFormData';

// フォーム定数
const FORM_CONSTANTS = {
  DESCRIPTION_HEIGHT: 100,
  VOLUME_MAX_WIDTH: 120,
} as const;

// フォームフィールド設定型定義
export type FormFieldConfig = {
  label: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  maxWidth?: number;
  height?: number;
  required?: boolean;
};

export const useFormFieldConfigs = () => {
  const formFieldConfigs: Record<keyof Omit<EditBookFormData, 'seriesId'>, FormFieldConfig> = useMemo(() => ({
    title: {
      label: 'タイトル',
      placeholder: '書籍のタイトルを入力',
      multiline: true,
      required: true,
    },
    volume: {
      label: '巻数',
      placeholder: '巻数を入力（例: 1）',
      keyboardType: 'numeric',
      maxWidth: FORM_CONSTANTS.VOLUME_MAX_WIDTH,
    },
    author: {
      label: '著者',
      placeholder: '著者名を入力',
    },
    isbn: {
      label: 'ISBN',
      placeholder: 'ISBNを入力',
      keyboardType: 'numeric',
    },
    description: {
      label: '概要',
      placeholder: '概要を入力',
      multiline: true,
      height: FORM_CONSTANTS.DESCRIPTION_HEIGHT,
    },
  }), []);

  return {
    formFieldConfigs,
    FORM_CONSTANTS,
  };
};