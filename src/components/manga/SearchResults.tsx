import { useAddBook } from "@/hooks/mutations/useAddBook";
import { NewBook } from "@/db/types";
import { EmptySearchState } from "@/features/register/components/EmptySearchState";
import RegisterDetailModal from "@/features/register/RegisterDetailModal";
import { BookSearchResult } from "@/types/book";
import { COLORS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, EMPTY_SERIES_ID, EMPTY_SHOP_ID, FONT_SIZES } from "@/utils/constants";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SearchResultsProps = {
  results: BookSearchResult[];
};

type SearchResultItemProps = {
  item: BookSearchResult;
  handleBookSelect: (book: BookSearchResult) => void;
};

const SearchResultItem = ({
  item,
  handleBookSelect,
}: SearchResultItemProps) => {
  const handleAddBook = () => {
    handleBookSelect(item);
  };

  return (
    <View style={styles.resultItem}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.resultThumbnail}
        resizeMode="cover"
      />

      <View style={styles.resultDetails}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultAuthor}>{item.author}</Text>
        <Text style={styles.resultDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <TouchableOpacity
          style={[styles.storeButton, { backgroundColor: "#00A0DC" }]}
          onPress={handleAddBook}
          activeOpacity={0.8}
        >
          <Text style={styles.storeButtonText}>本を登録する</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SearchResults = ({ results }: SearchResultsProps) => {
  const addBookMutation = useAddBook();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(
    null
  );

  const handleBookSelect = (book: BookSearchResult) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBook(null);
  };

  const handleBookRegister = async (
    book: BookSearchResult,
    targetUrl: string,
    selectedSeriesId?: string | null
  ) => {
    try {
      const formattedBook = {
        ...book,
        seriesId: selectedSeriesId || book.seriesId || EMPTY_SERIES_ID,
        shopId: EMPTY_SHOP_ID,
        targetUrl
      } satisfies NewBook

      await addBookMutation.mutateAsync(formattedBook);
      closeModal();
    } catch (error) {
      // エラーハンドリングはmutation内で実行済み
      console.error("登録エラー:", error);
    }
  };

  if (results.length === 0) {
    return <EmptySearchState />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>検索結果</Text>
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <SearchResultItem
            key={item.googleBooksId}
            item={item}
            handleBookSelect={handleBookSelect}
          />
        )}
        keyExtractor={(item) => item.googleBooksId}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />

      <RegisterDetailModal
        visible={isModalVisible}
        book={selectedBook}
        onClose={closeModal}
        onRegister={handleBookRegister}
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
    alignItems: "center",
    justifyContent: "center",
  },
  storeButtonText: {
    color: "white",
    fontSize: FONT_SIZES.small,
    fontWeight: "bold",
  },
});
