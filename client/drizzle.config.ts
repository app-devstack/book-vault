import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/packages/drizzle",
  dialect: "sqlite",
  driver: "expo", // <--- very important
} satisfies Config;
