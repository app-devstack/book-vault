import { Text } from "@/components/Text";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7} // タップ時の透明度（0-1）
      onPress={() => console.log("タップされました")}
      onPressIn={() => console.log("タップ開始")} // 指が触れた時
      onPressOut={() => console.log("タップ終了")} // 指が離れた時
      onLongPress={() => console.log("長押し")} // 長押し時
      {...props}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
