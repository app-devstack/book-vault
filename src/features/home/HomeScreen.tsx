import { COLORS, GRADIENTS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { useBooksContext } from "@/components/providers/BooksProvider";
import EmptyBooksState from "@/features/home/components/EmptyBooksState";
import { SeriesCard } from "@/features/home/components/SeriesCard";
import { router } from "expo-router";

export const HomeScreen = () => {
  const { seriesedBooks, getSeriesStats, totalStats } = useBooksContext();

  const onSeriesPress = (seriesTitle: string) => {
    // エンコードしてルーティング
    const encodedTitle = encodeURIComponent(seriesTitle);
    router.push(`/series/${encodedTitle}`);
  };

  // 登録本がないときの見た目
  if (seriesedBooks.length === 0) return <EmptyBooksState />;

  return (
    <View style={styles.container}>
      <FlatList
        data={seriesedBooks}
        renderItem={({ item:seriese }) => {
          const stats = getSeriesStats(seriese.books);
          return (
            <SeriesCard
              seriesTitle={seriese.title}
              seriesBooks={seriese.books}
              stats={stats}
              onPress={() => onSeriesPress(seriese.title)}
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
});
