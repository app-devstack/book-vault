import { IconSymbol } from "@/components/IconSymbol";
import { Text } from "@/components/Text";
import { Book } from "@/utils/types";
import { Image as ExpoImage } from "expo-image";
// import { appwriteConfig, database } from "@/utils/appwrite";
import { Link } from "expo-router";

import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
// import { Query } from "react-native-appwrite";

export default function Index() {
  const [chatRooms, setChatRooms] = useState<Book[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchChatRooms();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchChatRooms = async () => {
    try {
      // const { documents, total } = await database.listDocuments(
      //   appwriteConfig.db,
      //   appwriteConfig.col.chatRooms,
      //   [Query.limit(100)]
      // );

      const documents = [
        {
          id: "1",
          title: "文豪ストレイドッグス(26)",
          description: "Description 1",
          targetURL:
            "https://booklive.jp/product/index/title_id/206670/vol_no/026",
          imageURL: "https://res.booklive.jp/206670/026/thumbnail/2L.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "ワールドトリガー 28",
          description: "Description 2",
          targetURL:
            "https://booklive.jp/product/index/title_id/222604/vol_no/028",
          imageURL: "https://res.booklive.jp/222604/028/thumbnail/2L.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3",
          title: "本のタイトル",
          description: "ジャンプSQ. RISE 2023 SPRING",
          targetURL:
            "https://booklive.jp/product/index/title_id/514170/vol_no/021",
          imageURL: "https://res.booklive.jp/514170/021/thumbnail/2L.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] satisfies Book[];

      const total = documents.length;

      console.log("total", total);

      // console.log("docs", JSON.stringify(documents, null, 2));

      // Map the Document objects to ChatRoom objects
      // const rooms = documents.map((doc) => ({
      //   id: doc.id,
      //   title: doc.title,
      //   description: doc.description,
      //   createdAt: new Date(doc.createdAt),
      //   updatedAt: new Date(doc.updatedAt),
      // }));

      setChatRooms(documents);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FlatList
      data={chatRooms}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      renderItem={({ item }) => {
        return (
          <Link
            href={{
              pathname: item.targetURL,
              params: { book: item.id },
            }}
          >
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
      }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        // padding: 16,
        gap: 2,
      }}
    />
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
  description: string;
}) {
  return (
    <View style={{ gap: 4 }}>
      <ItemTitle title={title} />
      <Text style={{ fontSize: 13, color: "#666666" }}>{description}</Text>
    </View>
  );
}

function ItemBookImg({ imageURL }: { imageURL?: string }) {
  if (!imageURL) {
    return (
      <View
        style={{
          width: 64,
          height: 110,
          backgroundColor: "#dcdcdc",
          borderRadius: 4,
        }}
      />
    );
  }

  return (
    <ExpoImage
      source={imageURL}
      style={{
        width: 64,
        height: 110,
        backgroundColor: "#dcdcdc",
        borderRadius: 4,
      }}
    />
  );
}
