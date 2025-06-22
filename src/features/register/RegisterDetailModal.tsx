import { Icon } from "@/components/icons/Icons";
import { useSharedUrlContext } from "@/components/providers/shared-url-provider";
import Badge from "@/components/ui/Badge";
import { SeriesSelector } from "@/components/ui/SeriesSelector";
import { useCreateSeries } from "@/hooks/mutations/useCreateSeries";
import { useSeriesOptions } from "@/hooks/queries/useSeriesOptions";
import { BookSearchResult } from "@/types/book";
import { COLORS, GRADIENTS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES, ICON_SIZES, SCREEN_PADDING } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// アニメーション用定数
const ANIMATION_CONFIG = {
  duration: 300,
  fadeOut: {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  },
  fadeIn: {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  },
} as const;

type RegisterDetailModalProps = {
  visible: boolean;
  book: BookSearchResult | null;
  onClose: () => void;
  onRegister: (book: BookSearchResult, targetURL: string, selectedSeriesId?: string | null) => Promise<void>;
};

export default function RegisterDetailModal({
  visible,
  book,
  onClose,
  onRegister,
}: RegisterDetailModalProps) {
  const [targetURL, setTargetURL] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSharedUrlVisible, setIsSharedUrlVisible] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const seriesOptionsQuery = useSeriesOptions();
  const createSeriesMutation = useCreateSeries();

  const { sharedUrl } = useSharedUrlContext();

  // Convert SeriesOption[] to Series[] for SeriesSelector
  const seriesedBooks = (seriesOptionsQuery.data || []).map(option => ({
    id: option.id,
    title: option.title,
    author: option.author,
    description: null,
    thumbnail: null,
    googleBooksSeriesId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Wrapper function to return series ID after creation
  const handleCreateSeries = async (seriesData: any) => {
    const newSeries = await createSeriesMutation.mutateAsync(seriesData);
    return newSeries.id;
  };

  // アニメーション関数
  const fadeOut = () => {
    Animated.timing(fadeAnim, ANIMATION_CONFIG.fadeOut).start(() => {
      setIsSharedUrlVisible(false);
    });
  };

  const fadeIn = () => {
    setIsSharedUrlVisible(true);
    Animated.timing(fadeAnim, ANIMATION_CONFIG.fadeIn).start();
  };

  useEffect(() => {
    if (book) {
      setTargetURL(``);
      setSelectedSeriesId(null);
      setIsSharedUrlVisible(true);
      fadeAnim.setValue(1);
    }
  }, [book, fadeAnim]);

  const handleRegister = async () => {
    if (!book) return;

    setIsRegistering(true);
    try {
      await onRegister(book, targetURL, selectedSeriesId);
      onClose();
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUseSharedUrl = () => {
    if (sharedUrl) {
      setTargetURL(sharedUrl.url);
      fadeOut();
    }
  };

  const handleBadgePress = () => {
    if (!isSharedUrlVisible) {
      fadeIn();
    }
  };

  if (!book) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* ヘッダー */}
        <LinearGradient
          colors={GRADIENTS.primary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="arrow-back" size="medium" color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>📚 書籍詳細</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 書籍詳細セクション */}
          <View style={styles.bookDetailCard}>
            <View style={styles.bookDetailContainer}>
              {book.imageUrl && (
                <Image
                  source={{ uri: book.imageUrl }}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>

                <View style={styles.infoRow}>
                  <Icon name="book" size="small" color={COLORS.primary} />
                  <Text style={styles.infoLabel}>著者:</Text>
                  <Text style={styles.infoText}>{book.author}</Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>検索結果</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 概要セクション */}
          {book.description && (
            <View style={styles.descriptionCard}>
              <View style={styles.sectionHeader}>
                <Icon name="library" size="medium" color={COLORS.primary} />
                <Text style={styles.sectionTitle}>概要</Text>
              </View>
              <Text style={styles.descriptionText} numberOfLines={3}>
                {/* {sliceTxt(book.description.replace(/<[^>]*>/g, ""), 200)} */}
                {book.description}
              </Text>
            </View>
          )}

          {/* シリーズ選択セクション */}
          <View style={styles.seriesCard}>
            <View style={styles.sectionHeader}>
              <Icon name="library" size="medium" color={COLORS.primary} />
              <Text style={styles.sectionTitle}>シリーズ</Text>
            </View>
            <SeriesSelector
              series={seriesedBooks}
              selectedSeriesId={selectedSeriesId}
              onSelectSeries={setSelectedSeriesId}
              onCreateSeries={handleCreateSeries}
              placeholder="既存シリーズから選択 または 新規作成"
              initialTitle={book?.title ? book.title.split(' ')[0] : ""}
              initialAuthor={book?.author || ""}
            />
          </View>

          {/* URL入力セクション */}
          <View style={styles.urlCard}>
            <View style={styles.sectionHeader}>
              <Icon name="open-outline" size="medium" color={COLORS.primary} />
              <Text style={styles.sectionTitle}>リンクURL</Text>

              {/* 共有URL検出インジケーター */}
              {sharedUrl && (
                <TouchableOpacity
                  onPress={handleBadgePress}
                  activeOpacity={0.7}
                  style={styles.sharedUrlBadgeButton}
                >
                  <Badge
                    variant="success"
                    size="small"
                    style={styles.sharedUrlBadgeCustom}
                  >
                    <View style={styles.badgeContent}>
                      <Icon name="link" size={ICON_SIZES.xsmall} color="white" />
                      <Text style={styles.badgeText}>共有URL</Text>
                    </View>
                  </Badge>
                </TouchableOpacity>
              )}
            </View>

            {/* プレミアムな共有URL表示 */}
            {sharedUrl && isSharedUrlVisible && (
              <Animated.View
                style={[
                  styles.premiumSharedUrlContainer,
                  { opacity: fadeAnim }
                ]}
              >
                <LinearGradient
                  colors={[COLORS.accent + '15', COLORS.accent + '08']}
                  style={styles.sharedUrlGradientCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.urlPreviewContainer}>
                    <Text style={styles.urlPreviewText} numberOfLines={2}>
                      {sharedUrl.url}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.useSharedUrlButton}
                    onPress={handleUseSharedUrl}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[COLORS.accentDark, COLORS.accentDark + 'DD']}
                      style={styles.useSharedUrlButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Icon name="checkmark" size="small" color="white" />
                      <Text style={styles.useSharedUrlButtonText}>このURLを使用</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            )}

            <TextInput
              style={styles.urlInput}
              value={targetURL}
              onChangeText={setTargetURL}
              placeholder="書籍のリンクURLを入力してください"
              placeholderTextColor={COLORS.textLight}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* フッター */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerButton, styles.registerButton]}
            onPress={handleRegister}
            disabled={isRegistering}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              style={styles.registerButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isRegistering ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon name="add" size="medium" color="white" />
              )}
              <Text style={styles.registerButtonText}>
                {isRegistering ? "登録中..." : "登録"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: SCREEN_PADDING,
    ...SHADOWS.large,
  },
  closeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: BORDER_RADIUS.medium,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    padding: SCREEN_PADDING,
    paddingBottom: 40,
  },
  bookDetailCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  bookDetailContainer: {
    flexDirection: "row",
    gap: 16,
  },
  bookImage: {
    width: 100,
    height: 140,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOWS.small,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.text,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  infoText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.xlarge,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: FONT_SIZES.small,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  descriptionCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    ...SHADOWS.medium,
  },
  seriesCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    ...SHADOWS.medium,
  },
  urlCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    ...SHADOWS.medium,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
  },
  descriptionText: {
    fontSize: FONT_SIZES.medium,
    lineHeight: 22,
    color: COLORS.text,
  },
  urlInput: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.large,
    padding: 16,
    fontSize: FONT_SIZES.medium,
    minHeight: 100,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  footer: {
    flexDirection: "row",
    padding: SCREEN_PADDING,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    ...SHADOWS.medium,
  },
  footerButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xlarge,
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  registerButton: {
    ...SHADOWS.medium,
  },
  registerButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  registerButtonText: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: "white",
  },
  // 共有URL検出インジケーター
  sharedUrlBadgeButton: {
    marginLeft: "auto",
  },
  sharedUrlBadgeCustom: {
    backgroundColor: COLORS.accentDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeText: {
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
    color: "white",
  },

  // プレミアム共有URLコンテナ
  premiumSharedUrlContainer: {
    ...SHADOWS.medium,
  },
  sharedUrlGradientCard: {
    borderRadius: BORDER_RADIUS.large,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.accent + "40",
  },

  // 共有URLヘッダー
  sharedUrlHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sharedUrlBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.medium,
    gap: 4,
  },
  sharedUrlDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    fontWeight: "500",
  },

  // URL プレビューコンテナ
  urlPreviewContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: BORDER_RADIUS.medium,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: COLORS.accent + "30",
    gap: 12,
  },
  urlIconContainer: {
    backgroundColor: COLORS.accent + "15",
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  urlPreviewText: {
    flex: 1,
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // 使用ボタン
  useSharedUrlButton: {
    borderRadius: BORDER_RADIUS.medium,
    overflow: "hidden",
    width: "100%",
    ...SHADOWS.small,
  },
  useSharedUrlButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  useSharedUrlButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    color: "white",
  },
});
