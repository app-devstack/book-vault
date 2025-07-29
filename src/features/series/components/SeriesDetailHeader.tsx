import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '@/components/icons/Icons';
import { COLORS, SHADOWS } from '@/utils/colors';

import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import { router } from 'expo-router';

export const SeriesDetailHeader = ({
  onBack,
  seriesTitle,
}: {
  onBack: () => void;
  seriesTitle: string;
}) => {
  const handlePress = () => {
    router.push(`/register?search=${seriesTitle}`);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
        <Icon name="chevron-back" size="medium" color={COLORS.primary} />
      </TouchableOpacity>

      <View style={styles.headerText}>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {seriesTitle}
        </Text>
      </View>

      <TouchableOpacity style={styles.plusButton} onPress={handlePress} activeOpacity={0.7}>
        <Icon name="add" size="medium" color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SCREEN_PADDING,
    gap: 12,
  },
  plusButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
