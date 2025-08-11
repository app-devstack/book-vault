import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSeriesEditActions } from '@/features/series/hooks/useSeriesEditActions';
import { useSeriesDeleteActions } from '@/hooks/screens/useSeriesDeleteActions';
import { COLORS, SHADOWS } from '@/utils/colors';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { useSeriesEditState } from '../hooks/useSeriesEditState';

import { BORDER_RADIUS, SCREEN_PADDING } from '@/utils/constants';
import { router } from 'expo-router';
import { HEADER_CONSTANTS } from '../constants/headerConstants';
import { ActionButtons } from './ActionButtons';
import { EditButtons } from './EditButtons';
import { EditableTitle } from './EditableTitle';
import { HeaderMenu } from './HeaderMenu';

interface SeriesDetailHeaderProps {
  seriesTitle: string;
  seriesId: string;
  bookCount: number;
}

export const SeriesDetailHeader = ({
  seriesTitle,
  seriesId,
  bookCount,
}: SeriesDetailHeaderProps) => {
  // ===== State Management =====
  const [showMenu, setShowMenu] = useState(false);

  // シリーズ削除関連のアクション
  const { showDeleteDialog, handleDeleteSeries, handleConfirmDelete, handleCancelDelete } =
    useSeriesDeleteActions({ seriesId, seriesTitle });

  // シリーズ編集関連のアクション
  const { isEditing, handleStartEdit, handleSaveEdit, handleCancelEdit, isUpdating } =
    useSeriesEditActions({
      seriesId,
      initialTitle: seriesTitle,
    });

  // 編集中の値とバリデーション状態
  const { editValue, setEditValue, resetEditValue, isValueChanged } = useSeriesEditState({
    initialTitle: seriesTitle,
    isEditing,
  });

  // ===== Navigation Handlers =====
  /**
   * ホーム画面に戻る
   */
  const navigateToHome = () => {
    router.push('/');
  };

  /**
   * 本の登録画面に移動（シリーズ名で検索）
   */
  const navigateToBookRegistration = () => {
    router.push(`/register?search=${seriesTitle}`);
  };

  // ===== Edit Handlers =====
  /**
   * タイトル編集を保存する
   * 変更がない場合はキャンセル扱い
   */
  const saveEditedTitle = () => {
    if (isValueChanged) {
      handleSaveEdit(editValue);
    } else {
      cancelTitleEdit();
    }
  };

  /**
   * タイトル編集をキャンセルする
   * 入力値をリセットし編集モードを終了
   */
  const cancelTitleEdit = () => {
    resetEditValue();
    handleCancelEdit();
  };

  // ===== Menu Handlers =====
  /**
   * ヘッダーメニューの表示切り替え
   */
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  /**
   * メニューから編集を開始
   * メニューを閉じてから編集モードに入る
   */
  const startEditFromMenu = () => {
    setShowMenu(false);
    handleStartEdit();
  };

  /**
   * メニューから削除を開始
   * メニューを閉じてから削除確認ダイアログを表示
   */
  const startDeleteFromMenu = () => {
    setShowMenu(false);
    handleDeleteSeries();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={navigateToHome}
        activeOpacity={0.7}
        accessibilityLabel="戻る"
      >
        <ChevronLeft
          size={HEADER_CONSTANTS.ICONS.SIZE.MEDIUM}
          col={HEADER_CONSTANTS.ICONS.COLORS.PRIMARY}
        />
      </TouchableOpacity>

      <View style={styles.headerText}>
        <EditableTitle
          title={seriesTitle}
          isEditing={isEditing}
          onStartEdit={handleStartEdit}
          editValue={editValue}
          onEditValueChange={setEditValue}
        />
      </View>

      {isEditing ? (
        <EditButtons onSave={saveEditedTitle} onCancel={cancelTitleEdit} disabled={isUpdating} />
      ) : (
        <ActionButtons onAddBook={navigateToBookRegistration} onMenuPress={toggleMenu} />
      )}

      <HeaderMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onEditPress={startEditFromMenu}
        onDeletePress={startDeleteFromMenu}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="シリーズを削除"
        message={`「${seriesTitle}」を削除しますか？\n\n• このシリーズに登録された ${bookCount} 冊の本も削除されます\n• この操作は取り消せません`}
        confirmText="削除する"
        cancelText="キャンセル"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmButtonColor={COLORS.error}
        iconType="trash"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SCREEN_PADDING,
    gap: 12,
    position: 'relative',
  },
  backButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    width: HEADER_CONSTANTS.BUTTON.SIZE,
    height: HEADER_CONSTANTS.BUTTON.SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerText: {
    flex: 1,
  },
});
