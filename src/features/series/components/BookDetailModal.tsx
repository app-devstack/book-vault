import { Icon } from '@/components/icons/Icons';
import { Text } from '@/components/Text';
import Badge from '@/components/ui/Badge';
import { Book } from '@/db/types';
import { useDeleteBook } from '@/hooks/mutations/useDeleteBook';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const {
  // width: _screenWidth,
  height: screenHeight,
} = Dimensions.get('window');

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
  const router = useRouter();
  const deleteBookMutation = useDeleteBook();

  if (!book) return null;

  // 削除確認ダイアログ
  const handleDeletePress = async () => {
    Alert.alert(
      '本を削除',
      // prettier-ignore
      `「${book.title}${book.volume ? ` ${book.volume}巻` : ""}」を削除しますか？`,
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: handleDeleteConfirm,
        },
      ]
    );
  };

  // 削除実行
  const handleDeleteConfirm = async () => {
    if (deleteBookMutation.isPending) return;

    try {
      await deleteBookMutation.mutateAsync(book.id);
      onBookDeleted?.(book.id);
      onClose();
    } catch (error) {
      // エラーハンドリングはmutation内で実行済み
      console.error('Delete error:', error);
    }
  };

  const handleEditPress = () => {
    router.push(`/book/edit/${book.id}`);
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
        <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={onClose} />

        <AnimatedContainer>
          <View style={styles.modal}>
            {/* ヘッダー */}
            <ModalHeader onClose={onClose} />
            <View
              style={styles.content}
              // showsVerticalScrollIndicator={false}
            >
              {/* サムネイル */}
              <Thumbnail source={{ uri: book.imageUrl || '' }} />

              {/* 基本情報 */}
              <BookInfo {...book} />
            </View>

            {/* アクションボタン */}
            <ActionButton
              handleDeletePress={handleDeletePress}
              handleEditPress={handleEditPress}
              isPending={deleteBookMutation.isPending}
            />
          </View>
        </AnimatedContainer>
      </AnimatedBackdrop>
    </Modal>
  );
};

/** モーダルヘッダー */
const ModalHeader = ({ onClose }: { onClose: () => void }) => {
  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 16,
      paddingTop: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    closeButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS.small,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="close" size="medium" color={COLORS.textLight} />
      </TouchableOpacity>
    </View>
  );
};

/** サムネイル */
const Thumbnail = ({ source }: { source?: ImageSourcePropType }) => {
  const styles = StyleSheet.create({
    thumbnailContainer: {
      alignItems: 'center',
    },
    thumbnail: {
      width: 60,
      height: 80,
      borderRadius: BORDER_RADIUS.medium,
      ...SHADOWS.medium,
    },
  });

  return (
    <View style={styles.thumbnailContainer}>
      <Image source={source} style={styles.thumbnail} resizeMode="cover" />
    </View>
  );
};

/** 本の基本情報 */
const BookInfo = (book: Book) => {
  const styles = StyleSheet.create({
    title: {
      fontSize: FONT_SIZES.xlarge,
      fontWeight: 'bold',
      color: COLORS.text,
      marginBottom: 8,
      lineHeight: FONT_SIZES.xlarge * 1.3,
    },
    volume: {
      color: COLORS.primaryForeground,
    },

    author: {
      fontSize: FONT_SIZES.large,
      color: COLORS.textLight,
      marginBottom: 12,
    },
    isbnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    isbnLabel: {
      fontSize: FONT_SIZES.small,
      color: COLORS.textLight,
      fontWeight: '600',
    },
    isbn: {
      fontSize: FONT_SIZES.small,
      color: COLORS.text,
      fontFamily: 'monospace',
    },
  });

  return (
    <View style={{ gap: 8 }}>
      {/* タイトル */}
      <Text style={styles.title}>{book.title}</Text>

      {/* 巻数 */}
      {book.volume !== null && <Badge style={{ alignSelf: 'flex-start' }}>{book.volume}巻</Badge>}

      {/* 著者名 */}
      {book.author && <Text style={styles.author}>{book.author}</Text>}

      {/* ISBN情報 */}
      {book.isbn && (
        <View style={styles.isbnContainer}>
          <Text style={styles.isbnLabel}>ISBN:</Text>
          <Text style={styles.isbn}>{book.isbn}</Text>
        </View>
      )}

      {/* 説明文 */}
      {book.description && (
        <View>
          {/* <Text style={styles.sectionTitle}>あらすじ</Text> */}
          <Text
            style={{
              fontSize: FONT_SIZES.medium,
              color: COLORS.text,
              lineHeight: FONT_SIZES.medium * 1.5,
            }}
            numberOfLines={3}
          >
            {book.description}
          </Text>
        </View>
      )}
    </View>
  );
};

const ActionButton = ({
  handleDeletePress,
  handleEditPress,
  isPending,
}: {
  handleDeletePress: () => void;
  handleEditPress: () => void;
  isPending: boolean;
}) => {
  const styles = StyleSheet.create({
    actions: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: BORDER_RADIUS.medium,
      gap: 8,
    },
    deleteButton: {
      backgroundColor: COLORS.error,
    },
    deleteButtonText: {
      color: 'white',
      fontSize: FONT_SIZES.medium,
      fontWeight: '600',
    },
    editButton: {
      backgroundColor: COLORS.card,
      borderWidth: 2,
      borderColor: COLORS.primary,
    },
    editButtonText: {
      color: COLORS.primary,
      fontSize: FONT_SIZES.medium,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.actions}>
      {/* 将来の編集ボタン用（コメントアウト） */}
      <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEditPress}>
        <Icon name="pencil" size="small" color={COLORS.primary} />
        <Text style={styles.editButtonText}>編集</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={handleDeletePress}
        disabled={isPending}
      >
        <Icon name="trash" size="small" color={COLORS.primaryForeground} />
        <Text style={styles.deleteButtonText}>{isPending ? '削除中...' : '削除'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modal: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.8,
    ...SHADOWS.large,
  },

  content: {
    flex: 1,
    padding: 20,
    rowGap: 24,
  },
});
