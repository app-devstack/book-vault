import { COLORS, GRADIENTS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HomeHeaderProps {
  seriesCount: number;
  bookCount: number;
  onEditPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ seriesCount, bookCount, onEditPress }) => {
  return (
    <View>
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.headerCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>📚 本ライブラリ</Text>
        <Text style={styles.headerSubtitle}>
          {seriesCount}シリーズ • {bookCount}冊
        </Text>
      </LinearGradient>

      <View style={styles.editModeButtons}>
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>並び替え</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: BORDER_RADIUS.xlarge + 4,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  headerTitle: {
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.large,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  editModeButtons: {
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  editButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
});
