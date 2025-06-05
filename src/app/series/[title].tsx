import { useBooksContext } from "@/provider/BooksProvider";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SeriesDetailScreen } from "../../screens/SeriesDetailScreen";
import { COLORS } from "../../utils/colors";

export default function SeriesDetailPage() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const { groupedBooks, getSeriesStats } = useBooksContext();

  // URLパラメータからデコード
  const seriesTitle = decodeURIComponent(title || "");
  const seriesBooks = groupedBooks[seriesTitle];

  // シリーズが見つからない場合はホームに戻る
  if (!seriesBooks || seriesBooks.length === 0) {
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
        seriesTitle={seriesTitle}
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
