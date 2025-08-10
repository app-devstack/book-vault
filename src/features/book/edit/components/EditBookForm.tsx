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
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { EditBookFormData } from '../hooks/useBookFormData';
import { useEditBookActions } from '../hooks/useEditBookActions';
import { useEditBookForm } from '../hooks/useEditBookForm';
import { FormFieldConfig, useFormFieldConfigs } from '../hooks/useFormFieldConfigs';

export const EditBookForm = ({ book }: { book: BookWithRelations | null | undefined }) => {
  const { data: seriesOptions } = useSeriesOptions();

  // カスタムフックの利用
  const form = useEditBookForm(book);
  const { onSubmit, handleCancel, isPending } = useEditBookActions(book);
  const { formFieldConfigs } = useFormFieldConfigs();

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
    (name: keyof Omit<EditBookFormData, 'seriesId'>, config: FormFieldConfig) => (
      <View key={name} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {config.label}
          {config.required && ' *'}
        </Text>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                ...(config.maxWidth ? [{ maxWidth: config.maxWidth }] : []),
                ...(config.height ? [{ height: config.height }] : []),
                ...(errors[name] ? [styles.inputError] : []),
              ]}
              value={value || ''}
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
      {/* テキスト入力フィールド */}
      {Object.entries(formFieldConfigs).map(([fieldName, config]) =>
        renderTextInputField(fieldName as keyof Omit<EditBookFormData, 'seriesId'>, config)
      )}

      {/* シリーズ選択 */}
      <View style={styles.fieldContainer}>
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
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 0,
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
  content: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
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
    marginTop: 4,
  },
  readOnlySection: {
    marginTop: 32,
    marginBottom: 20,
    padding: 16,
    backgroundColor: COLORS.muted,
    borderRadius: BORDER_RADIUS.medium,
  },
  readOnlyTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 12,
  },
  readOnlyField: {
    marginBottom: 8,
  },
  readOnlyLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  readOnlyValue: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontFamily: 'monospace',
    marginTop: 2,
  },
});
