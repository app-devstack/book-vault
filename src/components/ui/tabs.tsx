import { COLORS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const TabsTrigger = ({
  onPress,
  isActive,
  text,
}: {
  onPress: () => void;
  isActive: boolean;
  text: string;
}) => {
  return (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>{text}</Text>
    </TouchableOpacity>
  );
};

export { TabsTrigger };

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  tabButtonTextActive: {
    color: COLORS.card,
  },
});
