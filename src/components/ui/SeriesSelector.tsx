import { Icon } from '@/components/icons/Icons';
import { SeriesCreationModal } from '@/components/ui/SeriesCreationModal';
import { NewSeries, Series } from '@/db/types';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SeriesSelectorProps {
  series: Series[];
  selectedSeriesId: string | null;
  onSelectSeries: (seriesId: string | null) => void;
  onCreateSeries?: (
    seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  placeholder?: string;
  initialTitle?: string;
  initialAuthor?: string;
}

export const SeriesSelector: React.FC<SeriesSelectorProps> = ({
  series: seriesProps,
  selectedSeriesId,
  onSelectSeries,
  onCreateSeries,
  placeholder = 'シリーズを選択',
  initialTitle = '',
  initialAuthor = '',
}) => {
  const [series, setSeries] = useState<Series[]>(seriesProps);

  useEffect(() => {
    // propsで渡されたシリーズデータを使用し、重複取得を避ける
    setSeries(seriesProps);
  }, [seriesProps]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreationModalVisible, setIsCreationModalVisible] = useState(false);

  const selectedSeries = selectedSeriesId ? series.find((s) => s.id === selectedSeriesId) : null;

  const handleSeriesSelect = (seriesId: string | null) => {
    onSelectSeries(seriesId);
    setIsModalVisible(false);
  };

  const handleCreateNewSeries = () => {
    setIsModalVisible(false);
    setIsCreationModalVisible(true);
  };

  const handleSeriesCreated = async (
    seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!onCreateSeries) return '';

    const newSeriesId = await onCreateSeries(seriesData);
    onSelectSeries(newSeriesId);
    return newSeriesId;
  };

  const renderSeriesItem = ({ item }: { item: Series }) => (
    <TouchableOpacity
      style={[styles.seriesItem, selectedSeriesId === item.id && styles.selectedSeriesItem]}
      onPress={() => handleSeriesSelect(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.seriesInfo}>
        <Text style={styles.seriesTitle}>{item.title}</Text>
        {item.author && <Text style={styles.seriesAuthor}>著者: {item.author}</Text>}
      </View>
      {selectedSeriesId === item.id && (
        <Icon name="checkmark" size="medium" color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.selectorText, !selectedSeries && styles.placeholder]}>
          {selectedSeries ? selectedSeries.title : placeholder}
        </Text>
        <Icon name="chevron-down" size="medium" color={COLORS.textLight} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>シリーズを選択</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Icon name="close" size="medium" color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[styles.seriesItem, styles.newSeriesItem]}
              onPress={onCreateSeries ? handleCreateNewSeries : () => handleSeriesSelect(null)}
              activeOpacity={0.8}
            >
              <View style={styles.seriesInfo}>
                <Text style={styles.newSeriesText}>新しいシリーズを作成</Text>
              </View>
              <Icon name="add" size="medium" color={COLORS.primary} />
            </TouchableOpacity>

            <FlatList
              data={series}
              renderItem={renderSeriesItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.seriesList}
            />
          </View>
        </View>
      </Modal>

      {onCreateSeries && (
        <SeriesCreationModal
          visible={isCreationModalVisible}
          onClose={() => setIsCreationModalVisible(false)}
          onCreateSeries={handleSeriesCreated}
          initialTitle={initialTitle}
          initialAuthor={initialAuthor}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.large,
    padding: 16,
    minHeight: 54,
  },
  selectorText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    flex: 1,
  },
  placeholder: {
    color: COLORS.textLight,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  modalTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  seriesList: {
    flex: 1,
  },
  seriesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  selectedSeriesItem: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  newSeriesItem: {
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  seriesInfo: {
    flex: 1,
  },
  seriesTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  seriesAuthor: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
  },
  newSeriesText: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
