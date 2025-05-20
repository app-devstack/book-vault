import db from "@/db";
import { book } from "@/db/schema";
import { Book } from "@/db/types";
import migrations from "@/packages/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "../Text";

export default function RootLayoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<Book[] | null>(null);

  useEffect(() => {
    if (!success) return;
    (async () => {
      await db.delete(book);
      await db.insert(book).values([
        {
          title: "文豪ストレイドッグス(26)",
          targetURL:
            "https://booklive.jp/product/index/title_id/206670/vol_no/026",
          imageURL: "https://res.booklive.jp/206670/026/thumbnail/2L.jpg",
          addedAt: new Date(),
        },
      ]);
      const books = await db.select().from(book);
      setItems(books);
    })();
  }, [success]);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  console.log("items", items);

  return <>{children}</>;
}
