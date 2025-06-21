export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN'
}

export interface BookError {
  type: ErrorType;
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  details?: Record<string, any>;
}

export class BookVaultError extends Error {
  readonly type: ErrorType;
  readonly code: string;
  readonly userMessage: string;
  readonly retryable: boolean;
  readonly details?: Record<string, any>;

  constructor(
    type: ErrorType,
    code: string,
    message: string,
    userMessage: string,
    retryable: boolean = false,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'BookVaultError';
    this.type = type;
    this.code = code;
    this.userMessage = userMessage;
    this.retryable = retryable;
    this.details = details;
  }

  toBookError(): BookError {
    return {
      type: this.type,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      retryable: this.retryable,
      details: this.details
    };
  }

  static fromError(error: unknown, fallbackUserMessage: string = '予期しないエラーが発生しました'): BookVaultError {
    if (error instanceof BookVaultError) {
      return error;
    }

    if (error instanceof Error) {
      // SQLite error patterns
      if (error.message.includes('UNIQUE constraint failed')) {
        return new BookVaultError(
          ErrorType.VALIDATION,
          'DUPLICATE_ENTRY',
          error.message,
          'この本は既に登録されています',
          false
        );
      }

      if (error.message.includes('FOREIGN KEY constraint failed')) {
        return new BookVaultError(
          ErrorType.VALIDATION,
          'INVALID_REFERENCE',
          error.message,
          '関連するデータが見つかりません',
          false
        );
      }

      // Network error patterns
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return new BookVaultError(
          ErrorType.NETWORK,
          'NETWORK_ERROR',
          error.message,
          'ネットワークエラーが発生しました。しばらく待ってから再試行してください',
          true
        );
      }

      return new BookVaultError(
        ErrorType.UNKNOWN,
        'UNKNOWN_ERROR',
        error.message,
        fallbackUserMessage,
        true
      );
    }

    return new BookVaultError(
      ErrorType.UNKNOWN,
      'UNKNOWN_ERROR',
      String(error),
      fallbackUserMessage,
      true
    );
  }
}

export const createNetworkError = (message: string, userMessage?: string) =>
  new BookVaultError(
    ErrorType.NETWORK,
    'NETWORK_ERROR',
    message,
    userMessage || 'ネットワークエラーが発生しました',
    true
  );

export const createValidationError = (message: string, userMessage?: string) =>
  new BookVaultError(
    ErrorType.VALIDATION,
    'VALIDATION_ERROR',
    message,
    userMessage || '入力データに問題があります',
    false
  );

export const createDatabaseError = (message: string, userMessage?: string) =>
  new BookVaultError(
    ErrorType.DATABASE,
    'DATABASE_ERROR',
    message,
    userMessage || 'データベースエラーが発生しました',
    true
  );