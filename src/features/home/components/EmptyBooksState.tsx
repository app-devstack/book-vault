import { COLORS, GRADIENTS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { Image } from "expo-image";
import { router } from "expo-router";
export default function EmptyBooksState() {
  const onTabPress = () => {
    router.push("/register");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.emptyContainer}
    >
      {/* <Text style={styles.emptyIcon}>📚</Text> */}
      <Image
        source={require('@/assets/images/chi-book.png')}
        style={styles.emptyIcon}
        contentFit="contain"
      />
      <Text style={styles.emptyTitle}>まだ本が登録されていません</Text>
      <Text style={styles.emptyDescription}>
        「登録」タブからお気に入りの本を追加してみましょう！
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={onTabPress}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // listContent: {
  //   padding: SCREEN_PADDING,
  //   paddingBottom: 100,
  // },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SCREEN_PADDING,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 120,
    height: 120,
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
});
