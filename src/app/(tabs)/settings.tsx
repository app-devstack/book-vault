import { SettingsScreen } from "@/features/settings/SettingsScreen";
import { COLORS } from "@/utils/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function SettingsPage() {
  return (
    <View style={styles.container}>
      <SettingsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
