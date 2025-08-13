import { Book } from '@/db/types';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SeriesStats, SeriesWithBooks } from '../../types';

interface EditDraggableSeriesItemProps {
  series: SeriesWithBooks;
  stats: SeriesStats;
  onDrag: () => void;
  isActive: boolean;
}

export const EditDraggableSeriesItem: React.FC<EditDraggableSeriesItemProps> = ({
  series,
  stats,
  onDrag,
  isActive,
}) => {
  const latestBook: Book | null =
    series.books.length > 0
      ? series.books.reduce((latest, book) =>
          new Date(book.purchaseDate) > new Date(latest.purchaseDate) ? book : latest
        )
      : null;

  return (
    <View style={[styles.draggableCardContainer, isActive && styles.activeSeriesCard]}>
      <TouchableOpacity
        style={styles.dragCardTouchable}
        onLongPress={onDrag}
        delayLongPress={300}
        disabled={isActive}
        activeOpacity={0.7}
      >
        {/* 編集時専用カード内容 */}
        <View style={styles.editCardContent}>
          <Image
            source={{ uri: latestBook?.imageUrl || '' }}
            style={styles.thumbnail}
            resizeMode="cover"
          />

          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={2}>
              {series.title}
            </Text>

            <Text style={styles.author} numberOfLines={1}>
              {series.books.length > 0 ? series.books[0].author : '著者未設定'}
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statBadge}>
                <Text style={styles.statText}>{stats.volumeCount}冊所有</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ドラッグハンドル */}
        <View style={styles.dragHandle}>
          <Text style={styles.dragHandleText}>⋮⋮</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  draggableCardContainer: {
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
    borderStyle: 'dashed',
    ...SHADOWS.small,
  },
  dragCardTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeSeriesCard: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    borderColor: COLORS.primary,
    borderStyle: 'solid',
    ...SHADOWS.medium,
  },
  editCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  thumbnail: {
    width: 60,
    height: 75,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOWS.small,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  author: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statText: {
    fontSize: FONT_SIZES.small,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dragHandle: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border + '40',
  },
  dragHandleText: {
    fontSize: 18,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
});
