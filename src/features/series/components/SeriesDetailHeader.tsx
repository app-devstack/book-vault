import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ChevronLeft } from '@tamagui/lucide-icons';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSeriesDeleteActions } from '@/hooks/screens/useSeriesDeleteActions';
import { COLORS, SHADOWS } from '@/utils/colors';

import { ActionButtons } from './ActionButtons';
import { HeaderMenu } from './HeaderMenu';
import { HEADER_CONSTANTS } from '../constants/headerConstants';
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import { router } from 'expo-router';

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
  const [showMenu, setShowMenu] = useState(false);
  
  const {
    showDeleteDialog,
    handleDeleteSeries,
    handleConfirmDelete,
    handleCancelDelete,
  } = useSeriesDeleteActions({ seriesId, seriesTitle });

  const handleBack = () => {
    router.push('/');
  };

  const handleAddBook = () => {
    router.push(`/register?search=${seriesTitle}`);
  };

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuDeletePress = () => {
    setShowMenu(false);
    handleDeleteSeries();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack} 
        activeOpacity={0.7}
        accessibilityLabel="戻る"
      >
        <ChevronLeft size={HEADER_CONSTANTS.ICONS.SIZE.MEDIUM} col={HEADER_CONSTANTS.ICONS.COLORS.PRIMARY} />
      </TouchableOpacity>

      <View style={styles.headerText}>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {seriesTitle}
        </Text>
      </View>

      <ActionButtons 
        onAddBook={handleAddBook}
        onMenuPress={handleMenuPress}
      />

      <HeaderMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onDeletePress={handleMenuDeletePress}
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
  headerTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
