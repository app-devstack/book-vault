import { COLORS } from '@/utils/colors';
import { BORDER_RADIUS } from '@/utils/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SeriesStats, SeriesWithBooks } from '../types';
import { SeriesCard } from './SeriesCard';

interface DraggableSeriesItemProps {
  series: SeriesWithBooks;
  stats: SeriesStats;
  onDrag: () => void;
  isActive: boolean;
}

export const DraggableSeriesItem: React.FC<DraggableSeriesItemProps> = ({
  series,
  stats,
  onDrag,
  isActive,
}) => {
  return (
    <View style={[styles.draggableCardContainer, isActive && styles.activeSeriesCard]}>
      <TouchableOpacity
        style={styles.dragCardTouchable}
        onLongPress={onDrag}
        delayLongPress={300}
        disabled={isActive}
        activeOpacity={0.7}
      >
        <SeriesCard
          seriesTitle={series.title}
          seriesBooks={series.books}
          stats={stats}
          onPress={() => {}} // 編集時はタップ無効
          isDragMode={true}
        />
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
    backgroundColor: COLORS.card + '50', // 半透明
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 2,
    borderColor: COLORS.primary + '20',
    borderStyle: 'dashed',
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
  },
  dragHandle: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandleText: {
    fontSize: 18,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
});
