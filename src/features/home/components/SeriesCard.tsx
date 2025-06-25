import LucideIcon from '@/components/ui/LucideIcon';
import { Book } from '@/db/types';
import { SeriesStats } from '@/types/book';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SeriesCardProps {
  seriesTitle: string;
  seriesBooks: Book[];
  stats: SeriesStats;
  onPress: () => void;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({
  seriesTitle,
  seriesBooks,
  stats,
  onPress,
}) => {
  const latestBook = seriesBooks.reduce((latest, book) =>
    new Date(book.purchaseDate) > new Date(latest.purchaseDate) ? book : latest
  );

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        <Image
          source={{ uri: latestBook.imageUrl || '' }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {seriesTitle}
          </Text>

          <Text style={styles.author} numberOfLines={1}>
            {seriesBooks[0].author}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <Text style={styles.statText}>{stats.volumeCount}冊所有</Text>
            </View>

            {/* <View style={[styles.statBadge, styles.priceBadge]}>
              <Text style={[styles.statText, styles.priceText]}>
                ¥{stats.totalPrice.toLocaleString()}
              </Text>
            </View> */}
          </View>

          {/* <View style={styles.storesContainer}>
            {stats.stores.map((store) => (
              <View
                key={store}
                style={[
                  styles.storeDot,
                  { backgroundColor: STORES[store].color },
                ]}
              />
            ))}
            <Text style={styles.storeCount}>{stats.stores.length}ストア</Text>
          </View> */}
        </View>

        <View style={styles.chevronContainer}>
          <LucideIcon name="ChevronRight" color="white" size="medium" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  thumbnail: {
    width: 80,
    height: 100,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOWS.small,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  author: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priceBadge: {
    backgroundColor: COLORS.accent + '20',
  },
  statText: {
    fontSize: FONT_SIZES.small,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  priceText: {
    color: COLORS.success,
  },
  storesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  storeCount: {
    fontSize: 11,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  chevronContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
