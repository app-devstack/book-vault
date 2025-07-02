import { COLORS, GRADIENTS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { BookWithRelations } from '@/db/types';
import EmptyBooksState from '@/features/home/components/EmptyBooksState';
import { SeriesCard } from '@/features/home/components/SeriesCard';
import { useBooks, useBooksStats } from '@/hooks/tanstack';
import { router } from 'expo-router';

// 既存のデータ変換ロジックを再利用
const transformBooksToSeries = (books: BookWithRelations[]) => {
  const seriesMap = new Map();

  books.forEach((book) => {
    if (!book.series) return;

    const seriesId = book.series.id;
    if (!seriesMap.has(seriesId)) {
      seriesMap.set(seriesId, {
        id: seriesId,
        title: book.series.title,
        author: book.series.author,
        description: book.series.description,
        books: [],
      });
    }
    seriesMap.get(seriesId).books.push(book);
  });

  return Array.from(seriesMap.values());
};

const getSeriesStats = (books: BookWithRelations[]) => {
  return {
    volumeCount: books.length,
  };
};

export const HomeScreenTanStack = () => {
  // TanStack Query フックを使用
  const { data: books = [], isLoading: isBooksLoading, error: booksError } = useBooks();
  const { data: stats, isLoading: isStatsLoading } = useBooksStats();

  const onSeriesPress = (seriesId: string) => {
    router.push(`/series/${seriesId}`);
  };

  // データ変換をメモ化
  const seriesedBooks = useMemo(() => {
    return transformBooksToSeries(books);
  }, [books]);

  // ローディング状態
  if (isBooksLoading || isStatsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>データを読み込み中...</Text>
      </View>
    );
  }

  // エラー状態
  if (booksError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>データの読み込みに失敗しました</Text>
        <Text style={styles.errorDetail}>{booksError.message}</Text>
      </View>
    );
  }

  // 登録本がないときの見た目
  if (seriesedBooks.length === 0) {
    return <EmptyBooksState />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={seriesedBooks}
        renderItem={({ item: seriese }) => {
          const seriesStats = getSeriesStats(seriese.books);
          return (
            <SeriesCard
              seriesTitle={seriese.title}
              seriesBooks={seriese.books}
              stats={seriesStats}
              onPress={() => onSeriesPress(seriese.id)}
            />
          );
        }}
        keyExtractor={(seriese) => seriese.id}
        ListHeaderComponent={() => (
          <LinearGradient
            colors={GRADIENTS.primary}
            style={styles.headerCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.headerTitle}>📚 本ライブラリ</Text>
            <Text style={styles.headerSubtitle}>
              {stats?.totalSeries || 0}シリーズ • {stats?.totalBooks || 0}冊
            </Text>
          </LinearGradient>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SCREEN_PADDING,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SCREEN_PADDING,
  },
  errorText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  headerCard: {
    borderRadius: BORDER_RADIUS.xlarge + 4,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  headerTitle: {
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.large,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
});
