import BookItem from "@/components/elements/book";
import db from "@/db";
import { Book } from "@/db/types";
// import { appwriteConfig, database } from "@/utils/appwrite";

import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
// import { Query } from "react-native-appwrite";

export default function Index() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchBooks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const documents = await db.query.book.findMany();

      setBooks(documents);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      renderItem={({ item }) => <BookItem {...item} />}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        // padding: 16,
        gap: 2,
      }}
    />
  );
}
