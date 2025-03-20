import { mysqlTable, serial, decimal, index, varchar, timestamp, date } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
export const expenses = mysqlTable('expenses', {
  id: serial('id').primaryKey(),
  userId:varchar('user_id', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: decimal('amount',{precision:12,scale:2}).notNull(),
  date: date("date").notNull(),
  createdAt: timestamp('created_at').defaultNow(),
},(t)=>[
    index("name_idx").on(t.userId),
]);

export const expensesInsertSchema= createInsertSchema(expenses,{
  category: z.string().min(3).max(100),
  description: z.string().min(3).max(250),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/,{message:"Amount must be positive"}),
});
export const expensesSelectSchema = createSelectSchema(expenses);