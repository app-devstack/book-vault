import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Trash2 } from '@tamagui/lucide-icons';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import { HEADER_CONSTANTS } from '../constants/headerConstants';

interface HeaderMenuProps {
  visible: boolean;
  onClose: () => void;
  onDeletePress: () => void;
}

export const HeaderMenu = ({ visible, onClose, onDeletePress }: HeaderMenuProps) => {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity 
        style={styles.overlay} 
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={onDeletePress}
          activeOpacity={0.7}
        >
          <Trash2 size={HEADER_CONSTANTS.ICONS.SIZE.SMALL} col={HEADER_CONSTANTS.ICONS.COLORS.ERROR} />
          <Text style={styles.menuItemText}>シリーズを削除</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: HEADER_CONSTANTS.MENU.TOP_OFFSET,
    right: SCREEN_PADDING,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 2,
    ...SHADOWS.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    minWidth: HEADER_CONSTANTS.MENU.MIN_WIDTH,
  },
  menuItemText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.error,
    fontWeight: '500',
  },
});