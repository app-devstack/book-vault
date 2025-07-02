import { BookSearchItemType } from '@/utils/googleBooks/types';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BookItemProps = {
  item: BookSearchItemType;
  onPress: (book: BookSearchItemType) => void;
};

export const BookItem = ({ item, onPress }: BookItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7} // タップ時の透明度（0-1）
    >
      <View style={styles.content}>
        {item.volumeInfo.imageLinks?.thumbnail ? (
          <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={styles.noThumbnail} />
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.volumeInfo.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {item.volumeInfo.authors?.join(', ') || '著者不明'}
          </Text>
          <Text style={styles.tapHint}>タップして詳細を表示</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 50,
    height: 75,
    marginRight: 12,
    borderRadius: 4,
  },
  noThumbnail: {
    width: 50,
    height: 75,
    marginRight: 12,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  author: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  tapHint: {
    color: '#3868AA',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
