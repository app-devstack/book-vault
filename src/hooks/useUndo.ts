import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';

export interface UndoAction {
  id: string;
  type: 'delete_book' | 'delete_series' | 'bulk_delete';
  description: string;
  data: any;
  timestamp: number;
  undo: () => Promise<void> | void;
}

export const useUndo = () => {
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [isUndoing, setIsUndoing] = useState(false);

  const executeUndo = useCallback(async (actionId: string) => {
    setIsUndoing(true);
    
    try {
      const action = undoStack.find(a => a.id === actionId);
      if (!action) {
        Toast.show({
          type: 'error',
          text1: 'エラー',
          text2: '元に戻す操作が見つかりません'
        });
        return;
      }

      // 5分以上経過した操作は実行不可
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      if (action.timestamp < fiveMinutesAgo) {
        Toast.show({
          type: 'error',
          text1: '操作の期限切れ',
          text2: '元に戻すことができる期限を過ぎています'
        });
        return;
      }

      await action.undo();

      // スタックから削除
      setUndoStack(prev => prev.filter(a => a.id !== actionId));

      Toast.show({
        type: 'success',
        text1: '元に戻しました',
        text2: action.description
      });

    } catch (error) {
      console.error('Undo failed:', error);
      Toast.show({
        type: 'error',
        text1: '元に戻せませんでした',
        text2: '操作の実行中にエラーが発生しました'
      });
    } finally {
      setIsUndoing(false);
    }
  }, [undoStack]);

  const addUndoAction = useCallback((action: Omit<UndoAction, 'id' | 'timestamp'>) => {
    const undoAction: UndoAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    setUndoStack(prev => {
      // 最大10個まで保持
      const newStack = [undoAction, ...prev].slice(0, 10);
      return newStack;
    });

    // 成功トーストにアンドゥボタンを表示
    Toast.show({
      type: 'success',
      text1: action.description,
      text2: 'タップして元に戻す',
      visibilityTime: 5000,
      onPress: () => {
        executeUndo(undoAction.id);
        Toast.hide();
      }
    });
  }, [executeUndo]);

  const clearUndoStack = useCallback(() => {
    setUndoStack([]);
  }, []);

  // 期限切れのアクションを自動削除
  const cleanupExpiredActions = useCallback(() => {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    setUndoStack(prev => prev.filter(action => action.timestamp >= fiveMinutesAgo));
  }, []);

  return {
    undoStack,
    isUndoing,
    addUndoAction,
    executeUndo,
    clearUndoStack,
    cleanupExpiredActions,
    canUndo: undoStack.length > 0 && !isUndoing
  };
};