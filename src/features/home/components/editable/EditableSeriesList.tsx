import { SeriesStats, SeriesWithBooks } from '@/features/home/types';
import { SCREEN_PADDING } from '@/utils/constants';
import React from 'react';
import { StyleSheet } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { EditDraggableSeriesItem } from './EditDraggableSeriesItem';

interface EditableSeriesListProps {
  data: SeriesWithBooks[];
  onDragEnd: ({ data }: { data: SeriesWithBooks[] }) => void;
  getSeriesStats: (books: SeriesWithBooks['books']) => SeriesStats;
}

export const EditableSeriesList: React.FC<EditableSeriesListProps> = ({
  data,
  onDragEnd,
  getSeriesStats,
}) => {
  const renderDraggableItem = ({
    item: seriese,
    drag,
    isActive,
  }: RenderItemParams<SeriesWithBooks>) => {
    return (
      <ScaleDecorator>
        <EditDraggableSeriesItem
          series={seriese}
          stats={getSeriesStats(seriese.books)}
          onDrag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={data}
      renderItem={renderDraggableItem}
      keyExtractor={(seriese: SeriesWithBooks) => seriese.id}
      onDragEnd={onDragEnd}
      contentContainerStyle={styles.editListContent}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      activationDistance={20}
      dragItemOverflow={true}
      autoscrollThreshold={50}
      autoscrollSpeed={100}
      animationConfig={{
        damping: 20,
        mass: 0.2,
        stiffness: 100,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }}
    />
  );
};

const styles = StyleSheet.create({
  editListContent: {
    padding: SCREEN_PADDING,
    paddingTop: 0, // ヘッダーが別なので上部パディングなし
  },
});
