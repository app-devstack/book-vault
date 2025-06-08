import { Icon } from "@/components/icons/Icons";
import { Book } from "@/db/types";
import { COLORS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES } from "@/utils/constants";
import React from "react";
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
};

export const BookCard = ({ book, showSeriesTitle = false }: BookCardProps) => {
  const handlePress = async () => {
    try {
      await Linking.openURL(book.targetUrl);
    } catch (error) {
      console.error("URLを開けませんでした:", error);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        // { borderColor: STORES[book.store].color + "20" },
      ]}
      onPress={handlePress}
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

          {/* <Text style={[styles.storeName, { color: STORES[book.store].color }]}>
            {STORES[book.store].name}
          </Text> */}

          {/* <Text style={styles.purchaseInfo}>
            {new Date(book.purchaseDate).toLocaleDateString("ja-JP")} • ¥
            {book.price}
          </Text> */}
        </View>

        <View style={styles.linkContainer}>
          <Icon name="open-outline" size="medium" color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    marginBottom: 12,
    borderWidth: 2,
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
