import { Icon } from "@/components/icons/Icons";
import { useBooksContext } from "@/components/providers/books-provider";
import { Book } from "@/db/types";
import { COLORS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES } from "@/utils/constants";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const {
  // width: _screenWidth,
  height: screenHeight,
} = Dimensions.get("window");

type BookDetailModalProps = {
  visible: boolean;
  book: Book | null;
  onClose: () => void;
  onBookDeleted?: (bookId: string) => void; // 削除後のコールバック
};

export const BookDetailModal = ({
  visible,
  book,
  onClose,
  onBookDeleted,
}: BookDetailModalProps) => {
  const {removeBook} = useBooksContext();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!book) return null;

  // 削除確認ダイアログ
  const handleDeletePress = async () => {
     Alert.alert(
      "本を削除",
     // prettier-ignore
      `「${book.title}${book.volume ? ` ${book.volume}巻` : ""}」を削除しますか？`,
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除",
          style: "destructive",
          onPress: handleDeleteConfirm,
        },
      ]
    );
  };

  // 削除実行
  const handleDeleteConfirm = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await removeBook(book.id);

      Toast.show({
        type: "success",
        text1: "削除完了",
        text2: "本が削除されました",
      });

      onBookDeleted?.(book.id);
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      Toast.show({
        type: "error",
        text1: "削除エラー",
        text2: "削除に失敗しました",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // react-native-reanimated移行時に置き換えるコンテナ
  const AnimatedContainer = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.container}>{children}</View>
  );

  const AnimatedBackdrop = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.backdrop}>{children}</View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade" // reanimated移行時に"none"に変更
      onRequestClose={onClose}
    >
      <AnimatedBackdrop>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <AnimatedContainer>
          <View style={styles.modal}>
            {/* ヘッダー */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size="medium" color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* サムネイル */}
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: book.imageUrl || "" }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </View>

              {/* 基本情報 */}
              <View style={styles.infoSection}>
                <Text style={styles.title}>
                  {book.title}
                  {book.volume && (
                    <Text style={styles.volume}> {book.volume}巻</Text>
                  )}
                </Text>

                {book.author && (
                  <Text style={styles.author}>{book.author}</Text>
                )}

                {/* {book.shop && (
                  <View style={styles.shopContainer}>
                    <Icon name="storefront" size="small" color={COLORS.primary} />
                    <Text style={styles.shopName}>{book.shop.displayName}</Text>
                  </View>
                )} */}

                {/* 購入日（コメントアウト） */}
                {/* {book.purchaseDate && (
                  <View style={styles.dateContainer}>
                    <Icon name="calendar" size="small" color={COLORS.textLight} />
                    <Text style={styles.purchaseDate}>
                      {new Date(book.purchaseDate).toLocaleDateString("ja-JP")}
                    </Text>
                  </View>
                )} */}

                {book.isbn && (
                  <View style={styles.isbnContainer}>
                    <Text style={styles.isbnLabel}>ISBN:</Text>
                    <Text style={styles.isbn}>{book.isbn}</Text>
                  </View>
                )}
              </View>

              {/* 説明文 */}
              {book.description && (
                <View style={styles.descriptionSection}>
                  {/* <Text style={styles.sectionTitle}>あらすじ</Text> */}
                  <Text style={styles.description} numberOfLines={4}>
                    {book.description}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* アクションボタン */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeletePress}
                disabled={isDeleting}
              >
                <Icon name="trash" size="small" color="white" />
                <Text style={styles.deleteButtonText}>
                  {isDeleting ? "削除中..." : "削除"}
                </Text>
              </TouchableOpacity>

              {/* 将来の編集ボタン用（コメントアウト） */}
              {/* <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => {}}
              >
                <Icon name="create" size="small" color={COLORS.primary} />
                <Text style={styles.editButtonText}>編集</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </AnimatedContainer>
      </AnimatedBackdrop>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  modal: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.75,
    ...SHADOWS.large,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    paddingTop:8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.small,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  thumbnailContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  thumbnail: {
    width: 120,
    height: 160,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOWS.medium,
  },
  infoSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: FONT_SIZES.xlarge * 1.3,
  },
  volume: {
    color: COLORS.primary,
  },
  author: {
    fontSize: FONT_SIZES.large,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  shopContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  shopName: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    fontWeight: "600",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  purchaseDate: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
  },
  isbnContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  isbnLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  isbn: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontFamily: "monospace",
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    lineHeight: FONT_SIZES.medium * 1.5,
  },
  actions: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.medium,
    gap: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  deleteButtonText: {
    color: "white",
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
  },
});
