import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { MoreVertical, Plus } from '@tamagui/lucide-icons';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS } from '@/utils/constants';
import { HEADER_CONSTANTS } from '../constants/headerConstants';

interface ActionButtonsProps {
  onAddBook: () => void;
  onMenuPress: () => void;
}

export const ActionButtons = ({ onAddBook, onMenuPress }: ActionButtonsProps) => {
  return (
    <View style={styles.rightActions}>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={onAddBook} 
        activeOpacity={0.7}
        accessibilityLabel="本を追加"
      >
        <Plus size={HEADER_CONSTANTS.ICONS.SIZE.MEDIUM} col={HEADER_CONSTANTS.ICONS.COLORS.PRIMARY} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={onMenuPress} 
        activeOpacity={0.7}
        accessibilityLabel="メニューを開く"
      >
        <MoreVertical size={HEADER_CONSTANTS.ICONS.SIZE.MEDIUM} col={HEADER_CONSTANTS.ICONS.COLORS.PRIMARY} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    width: HEADER_CONSTANTS.BUTTON.SIZE,
    height: HEADER_CONSTANTS.BUTTON.SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
});