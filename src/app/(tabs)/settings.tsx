import React from "react";
import { StyleSheet, View } from "react-native";
import { SettingsScreen } from "../../screens/SettingsScreen";
import { COLORS } from "../../utils/colors";

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
