import { BookCard } from '@/features/series/components/BookCard';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';

import { Book } from '@/db/types';
import { COLORS } from '@/utils/colors';
import { SCREEN_PADDING } from '@/utils/constants';
import { SeriesDetailHeader } from './components/SeriesDetailHeader';

interface SeriesDetailScreenProps {
  seriesTitle: string;
  seriesBooks: Book[];
  seriesId: string;
}

export const SeriesDetailScreen = ({
  seriesTitle,
  seriesBooks,
  seriesId,
}: SeriesDetailScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <SeriesDetailHeader
        seriesTitle={seriesTitle}
        seriesId={seriesId}
        bookCount={seriesBooks.length}
      />

      <FlatList
        data={seriesBooks}
        renderItem={({ item }) => <BookCard book={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SCREEN_PADDING,
    paddingTop: 0,
    paddingBottom: 100,
  },
});
