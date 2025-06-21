import { COLORS, GRADIENTS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import EmptyBooksState from "@/features/home/components/EmptyBooksState";
import { SeriesCard } from "@/features/home/components/SeriesCard";
import { useHomeScreen } from "@/hooks/screens/useHomeScreen";
import { router } from "expo-router";

export const HomeScreen = () => {
  const { seriesedBooks, getSeriesStats, totalStats, isLoading, error } = useHomeScreen();

  const onSeriesPress = (seriesId: string) => {
    router.push(`/series/${seriesId}`);
  };

  // ローディング状態
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>データを読み込み中...</Text>
      </View>
    );
  }

  // エラー状態
  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>データの読み込みに失敗しました</Text>
      </View>
    );
  }

  // 登録本がないときの見た目（実際の書籍数で判定）
  if (totalStats.bookCount === 0) return <EmptyBooksState />;

  return (
    <View style={styles.container}>
      <FlatList
        data={seriesedBooks}
        renderItem={({ item:seriese }) => {
          const stats = getSeriesStats(seriese.books);

          if (seriese.books.length === 0) return null;
          return (
            <SeriesCard
              seriesTitle={seriese.title}
              seriesBooks={seriese.books}
              stats={stats}
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
              {totalStats.seriesCount}シリーズ • {totalStats.bookCount}冊
            </Text>
            {/* <View style={styles.totalPriceContainer}>
              <Text style={styles.totalPriceText}>
                総額: ¥{totalStats.totalPrice.toLocaleString()}
              </Text>
            </View> */}
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

  headerCard: {
    borderRadius: BORDER_RADIUS.xlarge + 4,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    ...SHADOWS.large,
  },
  headerTitle: {
    fontSize: FONT_SIZES.hero,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.large,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
  },
  totalPriceContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalPriceText: {
    fontSize: FONT_SIZES.medium,
    color: "white",
    fontWeight: "bold",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginTop: 16,
  },
  errorText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.error,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
