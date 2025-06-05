import { useBooksContext } from "@/provider/BooksProvider";
import { HomeScreen } from "@/screens/HomeScreen";
import { COLORS } from "@/utils/colors";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomePage() {
  const { groupedBooks, getSeriesStats, totalStats } = useBooksContext();

  const handleSeriesPress = (seriesTitle: string) => {
    // エンコードしてルーティング
    const encodedTitle = encodeURIComponent(seriesTitle);
    router.push(`/series/${encodedTitle}`);
  };

  const handleTabPress = (tab: string) => {
    if (tab === "register") {
      router.push("/register");
    } else if (tab === "settings") {
      router.push("/settings");
    }
  };

  return (
    <View style={styles.container}>
      <HomeScreen
        groupedBooks={groupedBooks}
        getSeriesStats={getSeriesStats}
        totalStats={totalStats}
        onSeriesPress={handleSeriesPress}
        onTabPress={handleTabPress}
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
