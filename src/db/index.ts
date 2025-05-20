import { DrizzleConfig } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const options = {
  casing: "snake_case" as const,
  schema: { ...schema },
  logger: true,
} satisfies DrizzleConfig<typeof schema>;

const expo = openDatabaseSync("db.db", { enableChangeListener: true });
const db = drizzle(expo, options);

export default db;
