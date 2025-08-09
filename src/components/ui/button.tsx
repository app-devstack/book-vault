import { Text } from '@/components/Text';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
}

export default function CustomButton({ children, textStyle, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7} // タップ時の透明度（0-1）
      {...props}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
