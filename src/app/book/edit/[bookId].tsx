import { Text } from '@/components/Text';
import { Icon } from '@/components/icons/Icons';
import { BookWithRelations } from '@/db/types';
import { useUpdataBook } from '@/hooks/mutations/useUpdataBook';
import { useBookDetail } from '@/hooks/queries/useBookDetail';
import { useSafeState } from '@/hooks/useSafeState';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

export default function EditBookPage() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  // bookIdからDBで本の情報を取得
  const { data: book, isLoading, error } = useBookDetail(bookId!);

  // ローディング状態
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>書籍情報を読み込み中...</Text>
      </SafeAreaView>
    );
  }

  // エラー状態
  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>書籍情報の読み込みに失敗しました</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>閉じる</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 書籍が見つからない場合
  if (!book) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>書籍情報が見つかりません</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>閉じる</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="chevron-back" size="medium" color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>本を編集</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* フォーム */}
        <EditBookForm book={book} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const EditBookForm = ({ book }: { book: BookWithRelations | null | undefined }) => {
  const router = useRouter();
  const updataBookMutation = useUpdataBook();
  const { safeSetState } = useSafeState();

  // 編集用フォームスキーマ（フォーム入力用）
  const editBookFormSchema = z.object({
    title: z.string().optional(),
    volume: z.string().optional(),
    author: z.string().optional(),
  });

  type EditBookFormData = z.infer<typeof editBookFormSchema>;

  // 更新データ変換用
  const transformFormData = (data: EditBookFormData) => {
    const updateData: Partial<{ title: string; volume: number | null; author: string | null }> = {};

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
    },
  });

  useEffect(() => {
    if (book) {
      setValue('title', book.title || '');
      setValue('volume', book.volume?.toString() || '');
      setValue('author', book.author || '');
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
    ...SHADOWS.small,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // backButtonと同じ幅でバランスを取る
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
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginTop: 16,
  },
  closeButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
  },
  closeButtonText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
});
