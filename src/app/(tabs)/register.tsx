import { Text } from "@/components/Text";
import Button from "@/components/ui/button";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Register() {
  const initValue = {
    title: "",
    targetURL: "",
    imageURL: "",
  };

  const [inputValue, setInputValue] = useState(initValue);

  // フィールド設定を配列で管理
  const inputFields = [
    { key: "title", label: "タイトル", placeholder: "本のタイトルを入力" },
    { key: "targetURL", label: "リンクURL", placeholder: "URLを入力" },
    { key: "imageURL", label: "画像URL", placeholder: "画像URLを入力" },
  ] as const;

  type InputFieldKeyType = (typeof inputFields)[number]["key"];

  // 入力値更新の共通関数
  const handleInputChange = (key: InputFieldKeyType, text: string) => {
    setInputValue((prev) => ({ ...prev, [key]: text }));
  };

  const handlePress = () => {
    Toast.show({
      type: "success",
      text1: "送信テスト",
      text2: Object.values(inputValue).join(", "),
    });

    setTimeout(() => {
      Toast.hide();
      setInputValue(initValue);
    }, 2000);
  };

  // 入力フィールドコンポーネント
  const renderInputField = ({
    key,
    label,
    placeholder,
  }: (typeof inputFields)[number]) => (
    <View key={key} style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={inputValue[key]}
        onChangeText={(text) => handleInputChange(key, text)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {inputFields.map(renderInputField)}

      <Button style={styles.button} onPress={handlePress}>
        追加
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  inputContainer: {
    gap: 4,
  },
  label: {
    fontSize: 17,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#313131",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
