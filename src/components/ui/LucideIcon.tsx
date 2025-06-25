/* eslint-disable import/namespace */
import { ICON_SIZES } from '@/utils/constants';
import { icons, LucideProps } from 'lucide-react-native';

const LucideIcon = ({
  name,
  color,
  size = 'medium',
}: LucideProps & { name: keyof typeof icons; size?: keyof typeof ICON_SIZES | number }) => {
  const iconSize = typeof size === 'number' ? size : ICON_SIZES[size];
  const Icon = icons[name];

  return <Icon color={color} size={iconSize} />;
};

export default LucideIcon;

// 重い気がするので、マッピングは一旦コメントアウト
// import { icons, LucideProps } from 'lucide-react-native';

// type LowerName = Lowercase<keyof typeof icons>;

// // 大文字を小文字にマッピング
// type IconName = {
//   [K in keyof typeof icons as LowerName]: (typeof icons)[K];
// };

// const LucideIcon = ({ name, color, size }: LucideProps & { name: LowerName }) => {
//   const MapingIcon: IconName = Object.fromEntries(
//     Object.entries(icons).map(([key, value]) => [key.toLowerCase(), value])
//   ) as IconName;

//   const Icon = MapingIcon[name];

//   return <Icon color={color} size={size} />;
// };

// export default LucideIcon;
