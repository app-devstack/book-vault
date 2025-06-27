import schema from '@/db/schema';
import { DrizzleConfig } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

/** The name of the database file to open. */
export const DATABASE_NAME = 'db.db';

const options = {
  casing: 'snake_case' as const,
  schema: { ...schema },
  logger: true,
} satisfies DrizzleConfig<typeof schema>;

const expo = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
const db = drizzle(expo, options);

export default db;
