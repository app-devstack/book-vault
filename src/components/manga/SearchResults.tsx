import { NewBook } from "@/db/types";
import { EmptySearchState } from "@/features/register/components/EmptySearchState";
import RegisterDetailModal from "@/features/register/RegisterDetailModal";
import { useAddBook } from "@/hooks/mutations/useAddBook";
import { BookSearchResult } from "@/types/book";
import { COLORS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, EMPTY_SERIES_ID, EMPTY_SHOP_ID, FONT_SIZES } from "@/utils/constants";
import { bookService } from "@/utils/service/book-service";
import Badge from "@/components/ui/Badge";
import React, { useEffect, useState } from "react";
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
  isRegistered?: boolean;
};

const SearchResultItem = ({
  item,
  handleBookSelect,
  isRegistered = false,
}: SearchResultItemProps) => {
  const handleAddBook = () => {
    handleBookSelect(item);
  };

  return (
    <View style={[styles.resultItem, isRegistered && styles.registeredItem]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.resultThumbnail}
        resizeMode="cover"
      />

      <View style={styles.resultDetails}>
        <View style={styles.titleContainer}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          {isRegistered && (
            <Badge variant="success" size="small">
              登録済み
            </Badge>
          )}
        </View>
        <Text style={styles.resultAuthor}>{item.author}</Text>
        <Text style={styles.resultDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <TouchableOpacity
          style={[
            styles.storeButton,
            { backgroundColor: isRegistered ? COLORS.textLight : "#00A0DC" }
          ]}
          onPress={handleAddBook}
          activeOpacity={0.8}
          disabled={isRegistered}
        >
          <Text style={styles.storeButtonText}>
            {isRegistered ? "登録済み" : "本を登録する"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SearchResults = ({ results }: SearchResultsProps) => {
  const addBookMutation = useAddBook();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<Record<string, boolean>>({});

  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(
    null
  );

  // 検索結果が変更されたら登録状況をチェック
  useEffect(() => {
    if (results.length > 0) {
      const googleBooksIds = results.map(result => result.googleBooksId).filter(Boolean);

      bookService.getBooksRegistrationStatus(googleBooksIds)
        .then(status => setRegistrationStatus(status))
        .catch(error => console.error('Registration status check failed:', error));
    }
  }, [results]);

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

      // 登録成功後に登録状況を更新
      setRegistrationStatus(prev => ({
        ...prev,
        [book.googleBooksId]: true
      }));

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
            isRegistered={registrationStatus[item.googleBooksId] || false}
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
  registeredItem: {
    opacity: 0.7,
    backgroundColor: COLORS.background,
  },
  resultDetails: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  resultTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
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
