import { useBooksContext } from "@/components/providers/BooksProvider";
import { SeriesDetailScreen } from "@/features/series/SeriesDetailScreen";
import { COLORS } from "@/utils/colors";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function SeriesDetailPage() {
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  const { seriesedBooks, getSeriesStats } = useBooksContext();

  const series = seriesedBooks.find(
    (series) => series.id === seriesId
  );
  const seriesBooks = series?.books || [];

  // シリーズが見つからない場合はホームに戻る
  if (!series || !seriesBooks || seriesBooks.length === 0) {
    router.replace("/");
    return null;
  }

  const stats = getSeriesStats(seriesBooks);

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SeriesDetailScreen
        seriesTitle={series.title}
        seriesBooks={seriesBooks}
        stats={stats}
        onBack={handleBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
