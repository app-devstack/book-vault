import { Icon } from "@/components/icons/Icons";
import { BookCard } from "@/features/series/components/BookCard";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Book } from "@/db/types";
import { SeriesDetailStats } from "@/hooks/screens/useSeriesDetail";
import { COLORS, GRADIENTS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from "@/utils/constants";

interface SeriesDetailScreenProps {
  seriesTitle: string;
  seriesBooks: Book[];
  stats: SeriesDetailStats;
  onBack: () => void;
}

export const SeriesDetailScreen: React.FC<SeriesDetailScreenProps> = ({
  seriesTitle,
  seriesBooks,
  stats,
  onBack,
}) => {

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size="medium" color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {seriesTitle}
          </Text>
          <Text style={styles.headerAuthor}>{seriesBooks[0].author}</Text>
        </View>
      </View>

      <FlatList
        data={seriesBooks}
        renderItem={({ item }) => <BookCard book={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <LinearGradient
            colors={GRADIENTS.primary}
            style={styles.statsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.volumeCount}</Text>
                <Text style={styles.statLabel}>所有巻数</Text>
              </View>
            </View>
          </LinearGradient>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: SCREEN_PADDING,
    gap: 12,
  },
  backButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerAuthor: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginTop: 4,
  },
  listContent: {
    padding: SCREEN_PADDING,
    paddingTop: 0,
    paddingBottom: 100,
  },
  statsCard: {
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.large,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: FONT_SIZES.hero,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.small,
    color: "rgba(255,255,255,0.9)",
  },
  storesInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    gap: 8,
  },
  storesLabel: {
    fontSize: FONT_SIZES.small,
    color: "rgba(255,255,255,0.9)",
  },
  storesList: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
    flexWrap: "wrap",
  },
  storeTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.medium,
  },
  storeTagText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "white",
  },
});
