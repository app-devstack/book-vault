import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BookSearchResult, StoreKey } from "../../types/book";
import { COLORS, SHADOWS } from "../../utils/colors";
import { BORDER_RADIUS, FONT_SIZES, STORES } from "../../utils/constants";

interface SearchResultsProps {
  results: BookSearchResult[];
  onAddBook: (bookData: any, store: StoreKey) => void;
}

interface SearchResultItemProps {
  item: BookSearchResult;
  onAddBook: (bookData: any, store: StoreKey) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  onAddBook,
}) => {
  const handleAddBook = (store: StoreKey) => {
    const bookData = {
      title: item.title.replace(/\s*\d+巻$/, ""),
      volume: parseInt(item.title.match(/(\d+)巻/) || [0, 1])[1],
      author: item.author,
      thumbnail: item.thumbnail,
    };
    onAddBook(bookData, store);
  };

  return (
    <View style={styles.resultItem}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.resultThumbnail}
        resizeMode="cover"
      />

      <View style={styles.resultDetails}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultAuthor}>{item.author}</Text>
        <Text style={styles.resultDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.storeButtons}>
          {Object.entries(STORES).map(([key, store]) => (
            <TouchableOpacity
              key={key}
              style={[styles.storeButton, { backgroundColor: store.color }]}
              onPress={() => handleAddBook(key as StoreKey)}
              activeOpacity={0.8}
            >
              <Text style={styles.storeButtonText}>{store.name}に登録</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onAddBook,
}) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>検索結果</Text>
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <SearchResultItem item={item} onAddBook={onAddBook} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  resultItem: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    gap: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  resultThumbnail: {
    width: 100,
    height: 130,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOWS.small,
  },
  resultDetails: {
    flex: 1,
  },
  resultTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
  },
  resultAuthor: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  resultDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: 20,
  },
  storeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  storeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  storeButtonText: {
    color: "white",
    fontSize: FONT_SIZES.small,
    fontWeight: "bold",
  },
});
