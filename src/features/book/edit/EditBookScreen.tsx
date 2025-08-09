import { Text } from '@/components/Text';
import { Icon } from '@/components/icons/Icons';
import { EditBookForm } from '@/features/book/edit/components/EditBookForm';
import { useBookDetail } from '@/hooks/queries/useBookDetail';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditBookScreen() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
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
  errorText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.error,
    marginTop: 4,
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
