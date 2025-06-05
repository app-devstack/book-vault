import { Icon } from "@/components/icons/Icons";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SearchResults } from "../components/manga/SearchResults";
import { BookSearchResult } from "../types/book";
import { RegisterTab } from "../types/store";
import { COLORS, SHADOWS } from "../utils/colors";
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from "../utils/constants";

interface RegisterScreenProps {
  registerTab: RegisterTab;
  setRegisterTab: (tab: RegisterTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: BookSearchResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onAddBook: (bookData: any, store: any) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  registerTab,
  setRegisterTab,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  onSearch,
  onAddBook,
}) => {
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <View style={styles.container}>
      {/* タブセレクター */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            registerTab === "gmail" && styles.tabButtonActive,
          ]}
          onPress={() => setRegisterTab("gmail")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabButtonText,
              registerTab === "gmail" && styles.tabButtonTextActive,
            ]}
          >
            📧 Gmail連携
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            registerTab === "api" && styles.tabButtonActive,
          ]}
          onPress={() => setRegisterTab("api")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabButtonText,
              registerTab === "api" && styles.tabButtonTextActive,
            ]}
          >
            🔍 タイトル検索
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {registerTab === "gmail" ? (
          /* Gmail連携タブ（準備中） */
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonIcon}>🚧</Text>
            <Text style={styles.comingSoonTitle}>準備中です</Text>
            <Text style={styles.comingSoonDescription}>
              Gmail連携機能は現在開発中です。{"\n"}
              しばらくお待ちください。
            </Text>
          </View>
        ) : (
          /* タイトル検索タブ */
          <View style={styles.searchContainer}>
            {/* 検索バー */}
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="本タイトルを検索..."
                placeholderTextColor={COLORS.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={isSearching}
                activeOpacity={0.8}
              >
                {isSearching ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Icon name="search" size="medium" color="white" />
                )}
              </TouchableOpacity>
            </View>

            {/* 検索結果 */}
            <SearchResults results={searchResults} onAddBook={onAddBook} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabSelector: {
    flexDirection: "row",
    margin: SCREEN_PADDING,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  tabButtonTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SCREEN_PADDING,
    paddingTop: 0,
    paddingBottom: 100,
  },
  comingSoonContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    ...SHADOWS.medium,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.warning,
    marginBottom: 12,
  },
  comingSoonDescription: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  searchContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: "hidden",
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
