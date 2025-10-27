import { Text } from '@/components/Text';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { NewBook } from '@/db/types';
import { useAddBook } from '@/hooks/mutations/useAddBook';
import { useSeriesList } from '@/hooks/queries/useSeriesList';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, EMPTY_SERIES_ID, EMPTY_SHOP_ID, FONT_SIZES } from '@/utils/constants';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  // optional callbacks if parent wants to control navigation/modal close
  onCancel?: () => void;
  onRegistered?: (book: NewBook) => void;
};

type FormValues = {
  title: string;
  description?: string | null;
  volume?: string | null;
  targetUrl: string;
  seriesId?: string | null;
  imageUrl?: string | null;
};

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

const formFieldConfigs: Record<keyof Omit<FormValues, 'seriesId' | 'imageUrl'>, FormFieldConfig> = {
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
    placeholder: '書籍の購入URL（任意）',
  },
};

export default function RegisterManualContents({ onCancel, onRegistered }: Props) {
  const { data: series } = useSeriesList();
  const addBookMutation = useAddBook();

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      volume: '',
      targetUrl: '',
      seriesId: undefined,
      imageUrl: '',
    },
  });

  const { errors } = formState;

  const selectItems = useMemo(
    () =>
      series?.map((s) => ({
        value: s.id,
        label: s.title,
      })) ?? [],
    [series]
  );

  const onSubmit = async (values: FormValues) => {
    try {
      const formatted: NewBook = {
        title: values.title.trim(),
        description: values.description || '',
        volume: values.volume ? Number(values.volume) : undefined,
        targetUrl: values.targetUrl || '',
        seriesId: values.seriesId || EMPTY_SERIES_ID,
        shopId: EMPTY_SHOP_ID,
        imageUrl: values.imageUrl || '',
        googleBooksId: '', // 手動登録のため空にしておく
      } as Partial<NewBook> as NewBook;

      await addBookMutation.mutateAsync(formatted);

      // 呼び出し元に通知
      onRegistered?.(formatted);
    } catch (error) {
      // mutation 側でエラーハンドリングされる想定だが、必要ならここで追加ログ
      console.error('手動登録エラー:', error);
    }
  };

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        {Object.entries(formFieldConfigs).map(([name, config]) => (
          <View key={name} style={styles.fieldWrapper}>
            <Text style={styles.label}>
              {config.label}
              {config.required && ' *'}
            </Text>

            <Controller
              control={control}
              name={name as keyof Omit<FormValues, 'seriesId' | 'imageUrl'>}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    config.style,
                    errors[name as keyof typeof errors] ? styles.inputError : undefined,
                  ]}
                  value={String(value || '')}
                  onChangeText={onChange}
                  placeholder={config.placeholder}
                  keyboardType={config.keyboardType}
                  multiline={config.multiline}
                  textAlignVertical={config.multiline ? 'top' : 'center'}
                />
              )}
            />
          </View>
        ))}

        {/* シリーズ選択 */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>シリーズ</Text>
          <Controller
            control={control}
            name="seriesId"
            render={({ field: { onChange, value } }) => (
              <CustomSelect
                items={selectItems}
                value={value || undefined}
                onValueChange={onChange}
                placeholder="シリーズを選択（任意）"
              />
            )}
          />
        </View>
      </View>

      {/* アクションボタン */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel?.()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            // addBookMutation.isLoading && styles.saveButtonDisabled
          ]}
          onPress={handleSubmit(onSubmit)}
          // disabled={addBookMutation.isLoading}
          activeOpacity={0.8}
        >
          {/* {addBookMutation.isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primaryForeground} />
          ) : (
            <Text style={styles.saveButtonText}>登録する</Text>
          )} */}
          <Text style={styles.saveButtonText}>登録する</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    gap: 24,
  },
  fieldWrapper: {
    gap: 6,
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
