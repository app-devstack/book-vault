import { uuidv7 } from "@/lib/uuid";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// type DatetimeTestTable = {
//     timestamp?: Date | undefined;
//     timestamp_ms?: Date | undefined;
//     datetime_iso_str?: string | undefined;
// }

const _schemaBase = {
  id: text()
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
};

// books
export const book = sqliteTable("book", {
  id: _schemaBase.id,
  title: text("title").notNull(),
  description: text("description"),
  targetURL: text("target_url").notNull(),
  imageURL: text("image_url"),

  addedAt: integer("added_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
});

export type Book = typeof book.$inferSelect;
