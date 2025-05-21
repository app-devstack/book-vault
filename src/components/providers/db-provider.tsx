import db, { DATABASE_NAME } from "@/db";
import { SQLiteProvider } from "expo-sqlite";
import { ReactNode, Suspense, useEffect, useState } from "react";

import { Text } from "@/components/Text";
import { Book } from "@/db/types";
import migrations from "@/packages/drizzle/migrations";
import { createDummyBook } from "@/utils/service/_dummy";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { ActivityIndicator, View } from "react-native";

export default function DBProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<Book[] | null>(null);

  useEffect(() => {
    if (!success) return;
    (async () => {
      const books = await createDummyBook();
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

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        {children}

        {/* <Text>{JSON.stringify(items, null, 2)}</Text> */}
      </SQLiteProvider>
    </Suspense>
  );
}
