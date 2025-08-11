import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS } from '@/utils/constants';
import { Check, X } from '@tamagui/lucide-icons';
import { HEADER_CONSTANTS } from '../constants/headerConstants';

interface EditButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const EditButtons = ({ onSave, onCancel, disabled = false }: EditButtonsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={onCancel}
        activeOpacity={0.7}
        accessibilityLabel="編集をキャンセル"
        disabled={disabled}
      >
        <X
          size={HEADER_CONSTANTS.ICONS.SIZE.SMALL}
          col={disabled ? COLORS.textLight : COLORS.textLight}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.saveButton, disabled && styles.disabledButton]}
        onPress={onSave}
        activeOpacity={0.7}
        accessibilityLabel="編集を保存"
        disabled={disabled}
      >
        <Check
          size={HEADER_CONSTANTS.ICONS.SIZE.SMALL}
          col={disabled ? COLORS.textLight : 'white'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    borderRadius: BORDER_RADIUS.full,
    width: HEADER_CONSTANTS.BUTTON.SIZE,
    height: HEADER_CONSTANTS.BUTTON.SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.background,
    opacity: 0.5,
  },
});
