import schema from '@/db/schema';
import { DrizzleConfig } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

/** The name of the database file to open. */

export const options = {
  casing: 'snake_case' as const,
  schema: { ...schema },
  logger: true,
} satisfies DrizzleConfig<typeof schema>;

const db = drizzle({} as Env['DB'], options);

export default db;
