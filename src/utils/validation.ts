import { NewBook, NewSeries } from "@/db/types";
import { BookValidationResult, BookValidationSchema, SeriesValidationResult, SeriesValidationSchema } from "@/types/provider.types";
import { createValidationError } from "@/types/errors";

// Validation schemas
export const BOOK_VALIDATION_SCHEMA: BookValidationSchema = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 500
  },
  isbn: {
    required: false,
    format: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
  },
  author: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  targetUrl: {
    required: true,
    format: /^https?:\/\/.+/
  },
  volume: {
    required: false,
    min: 1,
    max: 9999
  }
};

export const SERIES_VALIDATION_SCHEMA: SeriesValidationSchema = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 500,
    unique: true
  },
  author: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  description: {
    required: false,
    maxLength: 2000
  }
};

// Validation utilities
export const sanitizeString = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
};

export const validateISBN = (isbn: string): boolean => {
  if (!isbn) return true; // ISBN is optional
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  return BOOK_VALIDATION_SCHEMA.isbn.format.test(cleanISBN);
};

export const validateURL = (url: string): boolean => {
  if (!url) return false;
  return BOOK_VALIDATION_SCHEMA.targetUrl.format.test(url);
};

// Book validation
export const validateBook = (bookData: Partial<NewBook>): BookValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!bookData.title || sanitizeString(bookData.title).length === 0) {
    errors.push('タイトルは必須です');
  } else {
    const sanitizedTitle = sanitizeString(bookData.title);
    if (sanitizedTitle.length < BOOK_VALIDATION_SCHEMA.title.minLength) {
      errors.push('タイトルが短すぎます');
    }
    if (sanitizedTitle.length > BOOK_VALIDATION_SCHEMA.title.maxLength) {
      errors.push('タイトルが長すぎます（500文字以内）');
    }
  }

  // Author validation
  if (!bookData.author || sanitizeString(bookData.author).length === 0) {
    errors.push('著者名は必須です');
  } else {
    const sanitizedAuthor = sanitizeString(bookData.author);
    if (sanitizedAuthor.length < BOOK_VALIDATION_SCHEMA.author.minLength) {
      errors.push('著者名が短すぎます');
    }
    if (sanitizedAuthor.length > BOOK_VALIDATION_SCHEMA.author.maxLength) {
      errors.push('著者名が長すぎます（200文字以内）');
    }
  }

  // Target URL validation
  if (!bookData.targetUrl || !validateURL(bookData.targetUrl)) {
    errors.push('有効な購入URLを入力してください');
  }

  // ISBN validation (optional)
  if (bookData.isbn && !validateISBN(bookData.isbn)) {
    warnings.push('ISBN形式が正しくない可能性があります');
  }

  // Volume validation (optional)
  if (bookData.volume !== undefined && bookData.volume !== null) {
    if (bookData.volume < BOOK_VALIDATION_SCHEMA.volume.min) {
      errors.push('巻数は1以上である必要があります');
    }
    if (bookData.volume > BOOK_VALIDATION_SCHEMA.volume.max) {
      errors.push('巻数は9999以下である必要があります');
    }
  }

  // Purchase date validation
  if (bookData.purchaseDate) {
    const purchaseDate = new Date(bookData.purchaseDate);
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    if (purchaseDate > oneYearFromNow) {
      warnings.push('購入日が未来すぎる可能性があります');
    }

    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(now.getFullYear() - 10);
    if (purchaseDate < tenYearsAgo) {
      warnings.push('購入日が古すぎる可能性があります');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Series validation
export const validateSeries = (seriesData: Partial<NewSeries>): SeriesValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!seriesData.title || sanitizeString(seriesData.title).length === 0) {
    errors.push('シリーズタイトルは必須です');
  } else {
    const sanitizedTitle = sanitizeString(seriesData.title);
    if (sanitizedTitle.length < SERIES_VALIDATION_SCHEMA.title.minLength) {
      errors.push('シリーズタイトルが短すぎます');
    }
    if (sanitizedTitle.length > SERIES_VALIDATION_SCHEMA.title.maxLength) {
      errors.push('シリーズタイトルが長すぎます（500文字以内）');
    }
  }

  // Author validation
  if (!seriesData.author || sanitizeString(seriesData.author).length === 0) {
    errors.push('著者名は必須です');
  } else {
    const sanitizedAuthor = sanitizeString(seriesData.author);
    if (sanitizedAuthor.length < SERIES_VALIDATION_SCHEMA.author.minLength) {
      errors.push('著者名が短すぎます');
    }
    if (sanitizedAuthor.length > SERIES_VALIDATION_SCHEMA.author.maxLength) {
      errors.push('著者名が長すぎます（200文字以内）');
    }
  }

  // Description validation (optional)
  if (seriesData.description) {
    const sanitizedDescription = sanitizeString(seriesData.description);
    if (sanitizedDescription.length > SERIES_VALIDATION_SCHEMA.description.maxLength) {
      errors.push('説明が長すぎます（2000文字以内）');
    }
  }

  // Thumbnail URL validation (optional)
  if (seriesData.thumbnail && !validateURL(seriesData.thumbnail)) {
    warnings.push('サムネイルURLの形式が正しくない可能性があります');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validation with error throwing
export const validateBookOrThrow = (bookData: Partial<NewBook>): Partial<NewBook> => {
  const validation = validateBook(bookData);
  
  if (!validation.isValid) {
    throw createValidationError(
      `Book validation failed: ${validation.errors.join(', ')}`,
      validation.errors.join('、')
    );
  }

  // Log warnings
  if (validation.warnings.length > 0) {
    console.warn('Book validation warnings:', validation.warnings);
  }

  // Return sanitized data
  return {
    ...bookData,
    title: bookData.title ? sanitizeString(bookData.title) : undefined,
    author: bookData.author ? sanitizeString(bookData.author) : undefined,
    description: bookData.description ? sanitizeString(bookData.description) : undefined,
    isbn: bookData.isbn ? sanitizeString(bookData.isbn) : undefined
  };
};

export const validateSeriesOrThrow = (seriesData: Partial<NewSeries>): Partial<NewSeries> => {
  const validation = validateSeries(seriesData);
  
  if (!validation.isValid) {
    throw createValidationError(
      `Series validation failed: ${validation.errors.join(', ')}`,
      validation.errors.join('、')
    );
  }

  // Log warnings
  if (validation.warnings.length > 0) {
    console.warn('Series validation warnings:', validation.warnings);
  }

  // Return sanitized data
  return {
    ...seriesData,
    title: seriesData.title ? sanitizeString(seriesData.title) : undefined,
    author: seriesData.author ? sanitizeString(seriesData.author) : undefined,
    description: seriesData.description ? sanitizeString(seriesData.description) : undefined
  };
};