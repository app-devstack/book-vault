import { useBooksContext } from "@/components/providers/BooksProvider";
import { NewBook } from "@/db/types";
import { RegisterScreen } from "@/features/register/RegisterScreen";
import { useSearch } from "@/hooks/useSearch";
import { RegisterTab } from "@/types/store";
import { COLORS } from "@/utils/colors";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function RegisterPage() {
  const [registerTab, setRegisterTab] = useState<RegisterTab>("api");

  const { addBook } = useBooksContext();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchBooks,
  } = useSearch();

  const handleAddBook = (bookData: any, store: StoreKey) => {
    addBook(bookData, store);
    // ホーム画面に戻る
    router.push("/");
  };

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
        onAddBook={handleAddBook}
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
