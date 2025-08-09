import { Text } from '@/components/Text';
import { BookWithRelations, NewBook } from '@/db/types';
import { useUpdataBook } from '@/hooks/mutations/useUpdataBook';
import { useSeriesOptions } from '@/hooks/queries/useSeriesOptions';
import { useSafeState } from '@/hooks/useSafeState';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Select } from 'tamagui';
import { z } from 'zod';

export const EditBookForm = ({ book }: { book: BookWithRelations | null | undefined }) => {
  const router = useRouter();
  const updataBookMutation = useUpdataBook();
  const { safeSetState } = useSafeState();
  const { data: seriesOptions } = useSeriesOptions();

  // 編集用フォームスキーマ（フォーム入力用）
  const editBookFormSchema = z.object({
    title: z.string().optional(),
    volume: z.string().optional(),
    author: z.string().optional(),
    seriesId: z.string().optional(),
    isbn: z.string().optional(),
    description: z.string().optional(),
  });

  type EditBookFormData = z.infer<typeof editBookFormSchema>;

  // 更新データ変換用
  const transformFormData = (data: EditBookFormData) => {
    const updateData: Partial<NewBook> = {};

    if (data.title !== undefined) {
      updateData.title = data.title.trim();
    }

    if (data.volume !== undefined) {
      const volume = data.volume.trim();
      updateData.volume = volume === '' ? null : Number(volume) || null;
    }

    if (data.author !== undefined) {
      updateData.author = data.author.trim() || null;
    }

    if (data.seriesId) {
      updateData.seriesId = data.seriesId;
    }

    if (data.isbn !== undefined) {
      updateData.isbn = data.isbn.trim() || null;
    }

    if (data.description !== undefined) {
      updateData.description = data.description.trim() || null;
    }

    return updateData;
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditBookFormData>({
    resolver: zodResolver(editBookFormSchema),
    defaultValues: {
      title: '',
      volume: '',
      author: '',
      seriesId: '',
      isbn: '',
      description: '',
    },
  });

  useEffect(() => {
    if (book) {
      setValue('title', book.title || '');
      setValue('volume', book.volume?.toString() || '');
      setValue('author', book.author || '');
      setValue('seriesId', book.seriesId || '');
      setValue('isbn', book.isbn || '');
      setValue('description', book.description || '');
    }
  }, [book, setValue]);

  const onSubmit = async (data: EditBookFormData) => {
    if (updataBookMutation.isPending) return;

    try {
      const updateData = transformFormData(data);

      await updataBookMutation.mutateAsync({
        bookId: book?.id || '',
        data: updateData,
      });

      safeSetState(() => {
        router.back();
      });
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    Alert.alert('変更を破棄', '編集内容が失われますがよろしいですか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '破棄', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const selectItems = useMemo(() => {
    if (!seriesOptions) return [];
    return seriesOptions.map((series) => ({
      value: series.id,
      label: series.title,
    }));
  }, [seriesOptions]);

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* タイトル */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>タイトル *</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={value || ''}
              onChangeText={onChange}
              placeholder="書籍のタイトルを入力"
              multiline
              textAlignVertical="top"
            />
          )}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
      </View>

      {/* 巻数 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>巻数</Text>
        <Controller
          control={control}
          name="volume"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.volumeInput, errors.volume && styles.inputError]}
              value={value || ''}
              onChangeText={onChange}
              placeholder="巻数を入力（例: 1）"
              keyboardType="numeric"
            />
          )}
        />
        {errors.volume && <Text style={styles.errorText}>{errors.volume.message}</Text>}
      </View>

      {/* 著者 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>著者</Text>
        <Controller
          control={control}
          name="author"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value || ''}
              onChangeText={onChange}
              placeholder="著者名を入力"
            />
          )}
        />
      </View>

      {/* Series */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>シリーズ</Text>
        <Controller
          control={control}
          name="seriesId"
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <Select.Trigger iconAfter={<ChevronDown />}>
                <Select.Value placeholder="シリーズを選択" />
              </Select.Trigger>
              <Select.Content>
                <Select.Viewport>
                  {selectItems.map((item, index) => (
                    <Select.Item index={index} key={item.value} value={item.value}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select>
          )}
        />
      </View>

      {/* ISBN */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>ISBN</Text>
        <Controller
          control={control}
          name="isbn"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value || ''}
              onChangeText={onChange}
              placeholder="ISBNを入力"
              keyboardType="numeric"
            />
          )}
        />
      </View>

      {/* Description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>概要</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={value || ''}
              onChangeText={onChange}
              placeholder="概要を入力"
              multiline
              textAlignVertical="top"
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
          style={[styles.saveButton, updataBookMutation.isPending && styles.saveButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={updataBookMutation.isPending}
        >
          {updataBookMutation.isPending ? (
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
  volumeInput: {
    maxWidth: 120,
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
