import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorLogEntry } from '../types/errorLog';

const ERROR_LOG_KEY = 'book_vault_error_logs';
const MAX_LOGS = 100; // 最大保存件数

/**
 * エラーログを記録する
 */
export async function logError(error: Error, operation: string): Promise<void> {
  try {
    const logEntry: ErrorLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      operation,
    };

    const existingLogs = await getErrorLogs();
    const newLogs = [logEntry, ...existingLogs].slice(0, MAX_LOGS);
    
    await AsyncStorage.setItem(ERROR_LOG_KEY, JSON.stringify(newLogs));
  } catch (e) {
    // ログ記録自体でエラーが出ても何もしない
    console.error('Failed to log error:', e);
  }
}

/**
 * 保存されているエラーログを取得する
 */
export async function getErrorLogs(): Promise<ErrorLogEntry[]> {
  try {
    const logs = await AsyncStorage.getItem(ERROR_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.error('Failed to get error logs:', e);
    return [];
  }
}

/**
 * エラーログをクリアする
 */
export async function clearErrorLogs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ERROR_LOG_KEY);
  } catch (e) {
    console.error('Failed to clear error logs:', e);
  }
}