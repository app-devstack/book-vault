import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ICON_SIZES } from '../../utils/constants';

export type IconName =
  | 'home'
  | 'home-outline'
  | 'search'
  | 'search-outline'
  | 'add'
  | 'add-outline'
  | 'settings'
  | 'settings-outline'
  | 'arrow-back'
  | 'open-outline'
  | 'mail'
  | 'mail-outline'
  | 'book'
  | 'book-outline'
  | 'library'
  | 'library-outline'
  | 'trash'
  | 'close'
  | 'checkmark'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-forward'
  | 'chevron-back'
  | 'person'
  | 'document-text'
  | 'link'
  | 'information-circle';

interface IconProps {
  name: IconName;
  size?: keyof typeof ICON_SIZES | number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 'medium', color = '#000' }) => {
  const iconSize = typeof size === 'number' ? size : ICON_SIZES[size];

  return <Ionicons name={name} size={iconSize} color={color} />;
};
