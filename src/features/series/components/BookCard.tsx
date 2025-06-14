import { Icon } from "@/components/icons/Icons";
import { Book } from "@/db/types";
import { BookDetailModal } from "@/features/series/components/BookDetailModal"; // パスは適宜調整
import { COLORS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES } from "@/utils/constants";
import React, { useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BookCardProps = {
  book: Book;
  showSeriesTitle?: boolean;
  onBookDeleted?: (bookId: string) => void; // 削除時のコールバック
};

export const BookCard = ({
  book,
  showSeriesTitle = false,
  onBookDeleted
}: BookCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleLinkPress = async () => {
    try {
      await Linking.openURL(book.targetUrl);
    } catch (error) {
      console.error("URLを開けませんでした:", error);
    }
  };

  const handleCardPress = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleBookDeleted = (bookId: string) => {
    onBookDeleted?.(bookId);
    setShowModal(false);
  };

  return (
    <>
      {/* カード本体 */}
      <TouchableOpacity
        style={[
          styles.container,
          // { borderColor: STORES[book.store].color + "20" },
        ]}
        onPress={handleCardPress} // カードタップでモーダル表示
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Image
            // TODO: 画像のURLがない場合はプレースホルダーを表示
            source={{ uri: book.imageUrl || "" }}
            style={styles.thumbnail}
            resizeMode="cover"
          />

          <View style={styles.details}>
            {showSeriesTitle && (
              <Text style={styles.seriesTitle} numberOfLines={1}>
                {book.title}
              </Text>
            )}

            {book.volume && (
              <Text style={styles.volumeTitle}>{book.volume}巻</Text>
            )}

            <Text style={styles.volumeTitle} numberOfLines={3}>
              {book.title}
            </Text>

            {/* 作者名を表示 */}
            {book.author && (
              <Text style={styles.author} numberOfLines={1}>
                {book.author}
              </Text>
            )}

            {/* <Text style={[styles.storeName, { color: STORES[book.store].color }]}>
              {STORES[book.store].name}
            </Text> */}

            {/* <Text style={styles.purchaseInfo}>
              {new Date(book.purchaseDate).toLocaleDateString("ja-JP")} • ¥
              {book.price}
            </Text> */}
          </View>

          {/* リンクボタン - イベントバブリング防止 */}
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={handleLinkPress}
            activeOpacity={0.7}
            // カードタップを防ぐ
            onPressIn={(e) => e.stopPropagation()}
          >
            <Icon name="open-outline" size="medium" color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* モーダル */}
      <BookDetailModal
        visible={showModal}
        book={book}
        onClose={handleCloseModal}
        onBookDeleted={handleBookDeleted}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  thumbnail: {
    width: 60,
    height: 80,
    borderRadius: BORDER_RADIUS.small,
    ...SHADOWS.small,
  },
  details: {
    flex: 1,
  },
  seriesTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  volumeTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  author: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    marginTop: 4,
  },
  storeName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    marginBottom: 4,
  },
  purchaseInfo: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
  },
  linkContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
