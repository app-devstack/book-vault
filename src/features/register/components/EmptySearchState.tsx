import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const EmptySearchState = () => {
  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require('@/assets/images/chi-book.png')}
        style={styles.emptyIcon}
        contentFit="contain"
      />
      <Text style={styles.emptyTitle}>検索してみましょう</Text>
      <Text style={styles.emptyDescription}>
        上の検索バーに本のタイトルを入力して{'\n'}
        お探しの本を検索してください！
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SCREEN_PADDING,
    paddingVertical: 60,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    ...SHADOWS.medium,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
