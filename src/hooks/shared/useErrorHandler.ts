import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

/**
 * アプリ全体で統一されたエラーハンドリングを提供するフック
 */
export const useErrorHandler = () => {
  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    // エラーの種類に応じた処理
    if (error.name === 'NetworkError') {
      Toast.show({
        type: 'error',
        text1: 'ネットワークエラー',
        text2: 'インターネット接続を確認してください',
      });
    } else if (error.name === 'ValidationError') {
      Toast.show({
        type: 'error',
        text1: '入力エラー',
        text2: '入力内容を確認してください',
      });
    } else if (error.message.includes('failed to fetch') || error.message.includes('Failed to fetch')) {
      Toast.show({
        type: 'error',
        text1: 'ネットワークエラー',
        text2: 'データの取得に失敗しました',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'エラー',
        text2: context || '処理中にエラーが発生しました',
      });
    }
  }, []);
  
  return { handleError };
};