import { ICON_SIZES } from '@/utils/constants';
import { ArrowLeftIcon, ChevronRightIcon, LucideProps } from 'lucide-react-native';

export type LucideIconName = 'chevron-right' | 'arrow-left';

type LucideIconProps = {
  name: LucideIconName;
  size?: keyof typeof ICON_SIZES | number;
} & LucideProps;

const LucideIcon = ({ name, color, size = 'medium' }: LucideIconProps) => {
  const iconSize = typeof size === 'number' ? size : ICON_SIZES[size];

  const mapping = {
    'chevron-right': ChevronRightIcon,
    'arrow-left': ArrowLeftIcon,
  } as const satisfies Record<LucideIconName, React.ComponentType<LucideProps>>;

  const Icon = mapping[name];

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
