import { COLORS } from '@/utils/colors';
import { FONT_SIZES } from '@/utils/constants';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'primary' | 'secondary';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: string | ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small': return styles.badgeSmall;
      case 'large': return styles.badgeLarge;
      default: return styles.badgeMedium;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'success': return styles.badgeSuccess;
      case 'warning': return styles.badgeWarning;
      case 'error': return styles.badgeError;
      case 'secondary': return styles.badgeSecondary;
      default: return styles.badgePrimary;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small': return styles.textSmall;
      case 'large': return styles.textLarge;
      default: return styles.textMedium;
    }
  };

  const renderContent = () => {
    if (typeof children === 'string') {
      return <Text style={[styles.text, getTextSizeStyle(), textStyle]}>{children}</Text>;
    }
    return children;
  };

  return (
    <View style={[styles.badge, getSizeStyle(), getVariantStyle(), style]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sizes
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeMedium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  // Variants
  badgePrimary: {
    backgroundColor: COLORS.primary,
  },
  badgeSecondary: {
    backgroundColor: COLORS.textLight,
  },
  badgeSuccess: {
    backgroundColor: COLORS.success,
  },
  badgeWarning: {
    backgroundColor: COLORS.warning,
  },
  badgeError: {
    backgroundColor: COLORS.error,
  },

  // Text styles
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: FONT_SIZES.xsmall,
  },
  textMedium: {
    fontSize: FONT_SIZES.small,
  },
  textLarge: {
    fontSize: FONT_SIZES.medium,
  },
});

export default Badge;