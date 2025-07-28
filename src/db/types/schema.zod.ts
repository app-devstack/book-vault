import schema from '@/db/schema';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

export const bookSelectSchema = createSelectSchema(schema.books);
export const bookInsertSchema = createInsertSchema(schema.books);
export const bookUpdateSchema = createUpdateSchema(schema.books);
