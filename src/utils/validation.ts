import { NewBook, NewSeries } from "@/db/types";
import { createValidationError } from "@/types/errors";
import { z } from "zod";

 interface BookValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

 interface SeriesValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}


// ISBN正規表現パターン
const ISBN_REGEX = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;

// URL正規表現パターン
const URL_REGEX = /^https?:\/\/.+/;

// Zodスキーマ定義
export const BOOK_VALIDATION_SCHEMA = z.object({
  title: z
    .string({ required_error: "タイトルは必須です" })
    .min(1, "タイトルは1文字以上である必要があります")
    .max(500, "タイトルは500文字以内である必要があります")
    .transform(str => str.trim().replace(/\s+/g, ' ')),

  author: z
    .string({ required_error: "著者名は必須です" })
    .min(1, "著者名は1文字以上である必要があります")
    .max(200, "著者名は200文字以内である必要があります")
    .transform(str => str.trim().replace(/\s+/g, ' ')),

  targetUrl: z
    .string({ required_error: "購入URLは必須です" })
    .regex(URL_REGEX, "有効なURLを入力してください"),

  isbn: z
    .string()
    .regex(ISBN_REGEX, "正しいISBN形式で入力してください")
    .transform(str => str.replace(/[-\s]/g, ''))
    .optional()
    .or(z.literal("")),

  volume: z
    .number()
    .int("巻数は整数である必要があります")
    .min(1, "巻数は1以上である必要があります")
    .max(9999, "巻数は9999以下である必要があります")
    .optional(),

  description: z
    .string()
    .max(2000, "説明は2000文字以内である必要があります")
    .transform(str => str?.trim().replace(/\s+/g, ' ') || "")
    .optional(),

  imageUrl: z
    .string()
    .url("有効なURL形式で入力してください")
    .optional()
    .or(z.literal("")),

  googleBooksId: z.string().optional(),

  purchaseDate: z
    .date({ required_error: "購入日は必須です" })
    .refine(
      (date) => {
        const now = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);
        return date <= oneYearFromNow;
      },
      "購入日が未来すぎます"
    )
    .refine(
      (date) => {
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(new Date().getFullYear() - 10);
        return date >= tenYearsAgo;
      },
      "購入日が古すぎます"
    ),

  seriesId: z.string({ required_error: "シリーズIDは必須です" }),
  shopId: z.string({ required_error: "ショップIDは必須です" })
});

export const SERIES_VALIDATION_SCHEMA = z.object({
  title: z
    .string({ required_error: "シリーズタイトルは必須です" })
    .min(1, "シリーズタイトルは1文字以上である必要があります")
    .max(500, "シリーズタイトルは500文字以内である必要があります")
    .transform(str => str.trim().replace(/\s+/g, ' ')),

  author: z
    .string({ required_error: "著者名は必須です" })
    .min(1, "著者名は1文字以上である必要があります")
    .max(200, "著者名は200文字以内である必要があります")
    .transform(str => str.trim().replace(/\s+/g, ' ')),

  description: z
    .string()
    .max(2000, "説明は2000文字以内である必要があります")
    .transform(str => str?.trim().replace(/\s+/g, ' ') || "")
    .optional(),

  thumbnail: z
    .string()
    .url("有効なURL形式で入力してください")
    .optional()
    .or(z.literal("")),

  googleBooksSeriesId: z.string().optional()
});

// Zod用の型定義
export type ValidatedBook = z.infer<typeof BOOK_VALIDATION_SCHEMA>;
export type ValidatedSeries = z.infer<typeof SERIES_VALIDATION_SCHEMA>;

// Zodベースのvalidation関数
export const validateBook = (bookData: Partial<NewBook>): BookValidationResult => {
  try {
    const result = BOOK_VALIDATION_SCHEMA.safeParse(bookData);

    if (result.success) {
      return {
        isValid: true,
        errors: [],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    result.error.issues.forEach(issue => {
      // カスタム警告の判定
      if (issue.message.includes('未来すぎ') || issue.message.includes('古すぎ')) {
        warnings.push(issue.message);
      } else {
        errors.push(issue.message);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  } catch {
    return {
      isValid: false,
      errors: ['予期しない検証エラーが発生しました'],
      warnings: []
    };
  }
};

export const validateSeries = (seriesData: Partial<NewSeries>): SeriesValidationResult => {
  try {
    const result = SERIES_VALIDATION_SCHEMA.safeParse(seriesData);

    if (result.success) {
      return {
        isValid: true,
        errors: [],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    result.error.issues.forEach(issue => {
      // URL形式の警告を分類
      if (issue.path.includes('thumbnail') && issue.message.includes('URL')) {
        warnings.push(`サムネイル${issue.message}`);
      } else {
        errors.push(issue.message);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  } catch {
    return {
      isValid: false,
      errors: ['予期しない検証エラーが発生しました'],
      warnings: []
    };
  }
};

// Validation with error throwing (Zodベース)
export const validateBookOrThrow = (bookData: Partial<NewBook>): ValidatedBook => {
  try {
    const result = BOOK_VALIDATION_SCHEMA.parse(bookData);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(issue => issue.message);
      throw createValidationError(
        `Book validation failed: ${errorMessages.join(', ')}`,
        errorMessages.join('、')
      );
    }
    throw createValidationError(
      `Unexpected validation error: ${error}`,
      '予期しない検証エラーが発生しました'
    );
  }
};

export const validateSeriesOrThrow = (seriesData: Partial<NewSeries>): ValidatedSeries => {
  try {
    const result = SERIES_VALIDATION_SCHEMA.parse(seriesData);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(issue => issue.message);
      throw createValidationError(
        `Series validation failed: ${errorMessages.join(', ')}`,
        errorMessages.join('、')
      );
    }
    throw createValidationError(
      `Unexpected validation error: ${error}`,
      '予期しない検証エラーが発生しました'
    );
  }
};

// 便利なヘルパー関数
export const sanitizeString = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
};

export const validateISBN = (isbn: string): boolean => {
  return ISBN_REGEX.test(isbn.replace(/[-\s]/g, ''));
};

export const validateURL = (url: string): boolean => {
  return URL_REGEX.test(url);
};