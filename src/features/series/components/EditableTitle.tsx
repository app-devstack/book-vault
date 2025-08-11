import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import { COLORS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';

interface EditableTitleProps {
  title: string;
  isEditing: boolean;
  onStartEdit: () => void;
  editValue?: string;
  onEditValueChange?: (value: string) => void;
  maxLength?: number;
}

export const EditableTitle = ({
  title,
  isEditing,
  onStartEdit,
  editValue = '',
  onEditValueChange,
  maxLength = 100,
}: EditableTitleProps) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        value={editValue}
        onChangeText={onEditValueChange}
        maxLength={maxLength}
        multiline={false}
        returnKeyType="done"
        placeholder="シリーズタイトルを入力"
        placeholderTextColor={COLORS.textLight}
      />
    );
  }

  return (
    <TouchableOpacity onPress={onStartEdit} activeOpacity={0.7}>
      <Text style={styles.titleText} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
    padding: 8,
    backgroundColor: COLORS.card,
    height: 40,
    textAlignVertical: 'center',
  },
  titleText: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
