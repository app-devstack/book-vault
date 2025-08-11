import { useEffect, useState } from 'react';

interface UseSeriesEditStateProps {
  initialTitle: string;
  isEditing: boolean;
}

/**
 * シリーズ編集時の状態管理を行うフック
 */
export const useSeriesEditState = ({ initialTitle, isEditing }: UseSeriesEditStateProps) => {
  const [editValue, setEditValue] = useState(initialTitle);

  // 編集開始時にinitialTitleで初期化
  useEffect(() => {
    if (isEditing) {
      setEditValue(initialTitle);
    }
  }, [isEditing, initialTitle]);

  const resetEditValue = () => {
    setEditValue(initialTitle);
  };

  const isValueChanged = editValue.trim() !== initialTitle && editValue.trim().length > 0;

  return {
    editValue,
    setEditValue,
    resetEditValue,
    isValueChanged,
  };
};
