import { IconSymbol } from "@/components/IconSymbol";
import { Text } from "@/components/Text";
import type { Book } from "@/db/types";
import { Image as ExpoImage } from "expo-image";

import {
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookItem(item: Book) {
  const openExternalLink = async () => {
    try {
      const url = item.targetURL;
      const supported = await Linking.canOpenURL(url); // URLが開けるかどうかをチェック

      if (supported) await Linking.openURL(url);
    } catch (error) {
      Alert.alert("エラー", `リンクを開く際にエラーが発生しました \n${error}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={openExternalLink}
    >
      <View style={styles.content}>
        <ItemBookImg imageURL={item.imageURL} />

        <ItemTitleAndDescription
          title={item.title}
          description={item.description}
        />
      </View>
      <IconSymbol name="chevron.right" size={20} color="#666666" />
    </TouchableOpacity>
  );
}

function ItemTitleAndDescription({
  title,
  description,
}: {
  title: string;
  description?: string | null;
}) {
  return (
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {/* <Text style={{ fontSize: 13, color: "#666666" }}>{description}</Text> */}
    </View>
  );
}

function ItemBookImg({ imageURL }: { imageURL?: string | null }) {
  return (
    <>
      {imageURL ? (
        <ExpoImage source={imageURL} style={styles.thumbnail} />
      ) : (
        <View style={styles.noThumbnail} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 64,
    height: 90,
    backgroundColor: "#dcdcdc",
    borderRadius: 4,
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
  },
  thumbnail: {
    width: 50,
    height: 75,
    marginRight: 12,
    borderRadius: 4,
  },
  noThumbnail: {
    width: 50,
    height: 75,
    marginRight: 12,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  author: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  tapHint: {
    color: "#3868AA",
    fontSize: 12,
    fontStyle: "italic",
  },
});
