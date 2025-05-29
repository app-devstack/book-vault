import { book } from "@/db/schema";

export type BookInsert = typeof book.$inferInsert;
