import db from '@/db';
import { ReactNode, Suspense, useEffect } from 'react';

import { Text } from '@/components/Text';
import { initializeDatabaseSeed } from '@/db/seed';
import migrations from '@/packages/drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function DBProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success) return;
    (async () => {
      await initializeDatabaseSeed();
      // console.log("DB Migration executed successfully");
      // const data = await db.query.books.findMany();
      // console.log("Current books in DB:", JSON.stringify(data, null, 2));
      // const books = await createDummyBook();
      // setItems(books);
    })();

    Toast.show({
      type: 'success',
      text1: 'DB Migration',
      text2: 'Executed!!🤖',
    });
  }, [success]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  return <Suspense fallback={<ActivityIndicator size="large" />}>{children}</Suspense>;
}
