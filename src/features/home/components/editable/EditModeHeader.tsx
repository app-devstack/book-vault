import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EditModeHeaderProps {
  onCancel: () => void;
  onSave: () => void;
  isUpdating: boolean;
}

export const EditModeHeader: React.FC<EditModeHeaderProps> = ({ onCancel, onSave, isUpdating }) => {
  return (
    <View style={styles.editModeHeader}>
      <TouchableOpacity style={styles.editCancelButton} onPress={onCancel}>
        <Text style={styles.editCancelButtonText}>キャンセル</Text>
      </TouchableOpacity>
      <Text style={styles.editModeTitle}>並び替え</Text>
      <TouchableOpacity
        style={[styles.editSaveButton, isUpdating && styles.savingButton]}
        onPress={onSave}
        disabled={isUpdating}
      >
        <View style={styles.saveButtonContent}>
          {isUpdating && (
            <ActivityIndicator size="small" color="white" style={styles.saveIndicator} />
          )}
          <Text style={styles.editSaveButtonText}>{isUpdating ? '保存中...' : '保存'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  editModeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SCREEN_PADDING,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  editModeTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  editCancelButton: {
    backgroundColor: COLORS.textLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  editCancelButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  editSaveButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  savingButton: {
    backgroundColor: COLORS.success + 'CC', // 少し透明化して保存中を表現
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIndicator: {
    marginRight: 6,
  },
  editSaveButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
});
