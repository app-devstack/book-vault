import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";
import { DrizzleConfig } from "drizzle-orm";

const options = {
  casing: "snake_case" as const,
  schema: { ...schema },
  logger: true,
} satisfies DrizzleConfig<typeof schema>;

const expo = openDatabaseSync("db.db");
const db = drizzle(expo, options);

export default db;
