import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RegisterGmailContents() {
  return (
    <View style={styles.comingSoonContainer}>
      <Text style={styles.comingSoonIcon}>🚧</Text>
      <Text style={styles.comingSoonTitle}>準備中です</Text>
      <Text style={styles.comingSoonDescription}>
        Gmail連携機能は現在開発中です。{'\n'}
        しばらくお待ちください。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  comingSoonContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    ...SHADOWS.medium,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginBottom: 12,
  },
  comingSoonDescription: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
