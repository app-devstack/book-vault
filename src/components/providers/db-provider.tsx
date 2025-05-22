import db, { DATABASE_NAME } from "@/db";
import { SQLiteProvider } from "expo-sqlite";
import { ReactNode, Suspense, useEffect } from "react";

import { Text } from "@/components/Text";
import migrations from "@/packages/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

export default function DBProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success) return;
    (async () => {
      // const books = await createDummyBook();
      // setItems(books);
    })();

    Toast.show({
      type: "success",
      text1: "DB Migration",
      text2: "Executed!!🤖",
    });
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
      </SQLiteProvider>
    </Suspense>
  );
}
