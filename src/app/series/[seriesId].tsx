import { SeriesDetailScreen } from '@/features/series/SeriesDetailScreen';
import { useSeriesDetail } from '@/hooks/screens/useSeriesDetail';
import { COLORS } from '@/utils/colors';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function SeriesDetailPage() {
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  const { series, books, isLoading, error } = useSeriesDetail(seriesId!);

  const handleBack = () => {
    router.back();
  };

  // ローディング状態
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>シリーズ情報を読み込み中...</Text>
      </View>
    );
  }

  // エラー状態
  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>シリーズ情報の読み込みに失敗しました</Text>
      </View>
    );
  }

  // シリーズが見つからない場合はホームに戻る
  if (!series || !books || books.length === 0) {
    router.push('/');
    Toast.show({
      type: 'error',
      text1: 'シリーズが見つかりません',
      text2: 'ホーム画面に戻ります',
    });

    return null;
  }

  return (
    <View style={styles.container}>
      <SeriesDetailScreen seriesTitle={series.title} seriesBooks={books} onBack={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
