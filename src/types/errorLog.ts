/**
 * エラーログエントリ
 */
export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  operation: string;
}