import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AlertCircle, Trash2 } from '@tamagui/lucide-icons';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: string;
  iconType?: 'warning' | 'trash';
}

export const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  onConfirm,
  onCancel,
  confirmButtonColor = COLORS.primary,
  iconType = 'warning',
}: ConfirmDialogProps) => {
  const IconComponent = iconType === 'trash' ? Trash2 : AlertCircle;
  const iconColor = iconType === 'trash' ? '#EF4444' : '#F59E0B';
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <IconComponent size="$8" col={iconColor} />
            <Text style={styles.title}>{title}</Text>
          </View>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: confirmButtonColor }]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  confirmButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: 'white',
  },
});
