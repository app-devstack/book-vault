import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SeriesCard } from './SeriesCard';
import { SeriesWithBooks, SeriesStats } from '../types';

interface SeriesListItemProps {
  series: SeriesWithBooks;
  stats: SeriesStats;
  onPress: () => void;
}

export const SeriesListItem: React.FC<SeriesListItemProps> = ({ series, stats, onPress }) => {
  return (
    <View style={styles.seriesCardContainer}>
      <TouchableOpacity style={styles.cardTouchable} onPress={onPress} activeOpacity={0.8}>
        <SeriesCard
          seriesTitle={series.title}
          seriesBooks={series.books}
          stats={stats}
          onPress={onPress}
          isDragMode={false}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  seriesCardContainer: {
    marginBottom: 16,
  },
  cardTouchable: {
    flex: 1,
  },
});
