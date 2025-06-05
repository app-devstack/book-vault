import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { COLORS } from "../utils/colors";
import { FONT_SIZES, SCREEN_PADDING } from "../utils/constants";

export const SettingsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.icon}>⚙️</Text>
      <Text style={styles.title}>設定画面</Text>
      <Text style={styles.description}>
        こちらは作成済みとのことなので、実装は省略しています。
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SCREEN_PADDING,
    paddingVertical: 60,
    paddingBottom: 100,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
});
