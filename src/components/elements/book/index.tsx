import { IconSymbol } from "@/components/IconSymbol";
import { Text } from "@/components/Text";
import type { Book } from "@/db/types";
import { Image as ExpoImage } from "expo-image";
import { ExternalPathString, Link } from "expo-router";

import { View } from "react-native";

export default function BookItem(item: Book) {
  return (
    <Link target="_blank" href={item.targetURL as ExternalPathString}>
      <View
        style={{
          gap: 6,
          padding: 16,
          width: "100%",
          // borderRadius: 16,
          alignItems: "center",
          flexDirection: "row",
          // backgroundColor: "#262626",
          backgroundColor: "#fffaf0",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <ItemBookImg imageURL={item.imageURL} />

          <ItemTitleAndDescription
            title={item.title}
            description={item.description}
          />
        </View>
        <IconSymbol name="chevron.right" size={20} color="#666666" />
      </View>
    </Link>
  );
}

function ItemTitle({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Text style={{ fontSize: 17, color: "#262626" }}>{title}</Text>
    </View>
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
    <View style={{ gap: 4 }}>
      <ItemTitle title={title} />
      <Text style={{ fontSize: 13, color: "#666666" }}>{description}</Text>
    </View>
  );
}

function ItemBookImg({ imageURL }: { imageURL?: string | null }) {
  return (
    <>
      {imageURL ? (
        <ExpoImage source={imageURL} style={bookStyle.img} />
      ) : (
        <View style={bookStyle.img} />
      )}
    </>
  );
}

const bookStyle = {
  img: {
    width: 64,
    height: 90,
    backgroundColor: "#dcdcdc",
    borderRadius: 4,
  },
};
