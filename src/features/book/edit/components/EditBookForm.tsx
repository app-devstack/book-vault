import { Text } from '@/components/Text';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { BookWithRelations } from '@/db/types';
import { useSeriesOptions } from '@/hooks/queries/useSeriesOptions';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import React, { useCallback, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEditBookActions } from '../hooks/useEditBookActions';
import { EditBookFormSchema, useEditBookForm } from '../hooks/useEditBookForm';

// フォームフィールド設定型定義
type FormFieldConfig = {
  label: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  style?: {
    maxWidth?: number;
    height?: number;
  };
  required?: boolean;
};

// フォームフィールド設定
const formFieldConfigs: Record<keyof Omit<EditBookFormSchema, 'seriesId'>, FormFieldConfig> = {
  title: {
    label: 'タイトル',
    placeholder: '書籍のタイトルを入力',
    multiline: true,
    required: true,
  },
  description: {
    label: '概要',
    placeholder: '概要を入力',
    multiline: true,
    style: { height: 100 },
  },
  volume: {
    label: '巻数',
    placeholder: '巻数を入力（例: 1）',
    keyboardType: 'numeric',
    style: { maxWidth: 120 },
  },
  targetUrl: {
    label: '購入URL',
    placeholder: '書籍の購入URLを入力',
    required: true,
  },
};

export const EditBookForm = ({ book }: { book: BookWithRelations | null | undefined }) => {
  const { data: seriesOptions } = useSeriesOptions();

  // カスタムフックの利用
  const form = useEditBookForm(book);
  const { onSubmit, handleCancel, isPending } = useEditBookActions(book);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // メモ化された値
  const selectItems = useMemo(() => {
    return (
      seriesOptions?.map((series) => ({
        value: series.id,
        label: series.title,
      })) ?? []
    );
  }, [seriesOptions]);

  // レンダリングヘルパー
  const renderTextInputField = useCallback(
    (name: keyof Omit<EditBookFormSchema, 'seriesId'>, config: FormFieldConfig) => (
      <View key={name} style={styles.fieldWrapper}>
        <Text style={styles.label}>
          {config.label}
          {config.required && ' *'}
        </Text>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, config.style, ...(errors[name] ? [styles.inputError] : [])]}
              value={String(value || '')}
              onChangeText={onChange}
              placeholder={config.placeholder}
              keyboardType={config.keyboardType}
              multiline={config.multiline}
              textAlignVertical={config.multiline ? 'top' : 'center'}
            />
          )}
        />
        {errors[name] && <Text style={styles.errorText}>{errors[name]?.message}</Text>}
      </View>
    ),
    [control, errors]
  );

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        {/* テキスト入力フィールド */}
        {Object.entries(formFieldConfigs).map(([fieldName, config]) =>
          renderTextInputField(fieldName as keyof Omit<EditBookFormSchema, 'seriesId'>, config)
        )}

        {/* シリーズ選択 */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>シリーズ</Text>
          <Controller
            control={control}
            name="seriesId"
            render={({ field: { onChange, value } }) => (
              <CustomSelect
                items={selectItems}
                value={value}
                onValueChange={onChange}
                placeholder="シリーズを選択"
              />
            )}
          />
        </View>
      </View>

      {/* アクションボタン */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isPending && styles.saveButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.primaryForeground} />
          ) : (
            <Text style={styles.saveButtonText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    gap: 24,
  },
  fieldWrapper: {
    gap: 2,
  },
  label: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    padding: 12,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    backgroundColor: COLORS.card,
    minHeight: 44,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.error,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingVertical: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    flex: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.primaryForeground,
  },
});
