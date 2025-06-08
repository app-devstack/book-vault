import { SeriesCard } from "@/components/manga/SeriesCard";
import { ActiveTab } from "@/types/store";
import { COLORS, GRADIENTS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useBooksContext } from "@/components/providers/BooksProvider";
import { router } from "expo-router";

export const HomeScreen = () => {
  const { groupedBooks, getSeriesStats, totalStats } = useBooksContext();

  const onSeriesPress = (seriesTitle: string) => {
    // エンコードしてルーティング
    const encodedTitle = encodeURIComponent(seriesTitle);
    router.push(`/series/${encodedTitle}`);
  };

  const onTabPress = (tab: string) => {
    if (tab === "register") {
      router.push("/register");
    } else if (tab === "settings") {
      router.push("/settings");
    }
  };

  const seriesEntries = Object.entries(groupedBooks);
  const isEmpty = seriesEntries.length === 0;

  // 登録本がないときの見た目
  if (isEmpty) return <EmptyState onTabPress={onTabPress} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={seriesEntries}
        renderItem={({ item: [seriesTitle, seriesBooks] }) => {
          const stats = getSeriesStats(seriesBooks);
          return (
            <SeriesCard
              seriesTitle={seriesTitle}
              seriesBooks={seriesBooks}
              stats={stats}
              onPress={() => onSeriesPress(seriesTitle)}
            />
          );
        }}
        keyExtractor={([seriesTitle]) => seriesTitle}
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

// 本がからのときのコンポーネント
const EmptyState = ({
  onTabPress,
}: {
  onTabPress: (tab: ActiveTab) => void;
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.emptyContainer}
    >
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyTitle}>まだ本が登録されていません</Text>
      <Text style={styles.emptyDescription}>
        「登録」タブからお気に入りの本を追加してみましょう！
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => onTabPress("register")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.emptyButtonText}>本を登録する</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SCREEN_PADDING,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyButton: {
    borderRadius: BORDER_RADIUS.xlarge,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  emptyButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "white",
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    textAlign: "center",
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
