import { SCREEN_PADDING } from '@/utils/constants';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SeriesStats, SeriesWithBooks } from '../types';
import { HomeHeader } from './HomeHeader';
import { SeriesListItem } from './SeriesListItem';

interface SeriesListProps {
  data: SeriesWithBooks[];
  onSeriesPress: (seriesId: string) => void;
  getSeriesStats: (books: SeriesWithBooks['books']) => SeriesStats;
  // ヘッダー用のprops
  seriesCount: number;
  bookCount: number;
  onEditPress: () => void;
}

export const SeriesList: React.FC<SeriesListProps> = ({
  data,
  onSeriesPress,
  getSeriesStats,
  seriesCount,
  bookCount,
  onEditPress,
}) => {
  const renderNormalItem = ({ item: seriese }: { item: SeriesWithBooks }) => {
    return (
      <SeriesListItem
        series={seriese}
        stats={getSeriesStats(seriese.books)}
        onPress={() => onSeriesPress(seriese.id)}
      />
    );
  };

  const renderHeader = () => (
    <HomeHeader seriesCount={seriesCount} bookCount={bookCount} onEditPress={onEditPress} />
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={data}
      renderItem={renderNormalItem}
      keyExtractor={(seriese) => seriese.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: SCREEN_PADDING,
  },
});
