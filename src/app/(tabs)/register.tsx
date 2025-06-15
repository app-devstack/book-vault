import { RegisterScreen } from "@/features/register/RegisterScreen";
import { RegisterTab } from "@/features/register/_types";
import { useSearch } from "@/hooks/useSearch";
import { COLORS } from "@/utils/colors";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function RegisterPage() {
  const [registerTab, setRegisterTab] = useState<RegisterTab>("api");

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchBooks,
  } = useSearch();

  return (
    <View style={styles.container}>
      <RegisterScreen
        registerTab={registerTab}
        setRegisterTab={setRegisterTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        onSearch={searchBooks}
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
