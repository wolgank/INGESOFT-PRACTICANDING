import { z } from "zod";
import { expensesInsertSchema } from "./db/schema/expenses";
export const createExpenseSchema = z.object({
  ...expensesInsertSchema.omit({ id: true,userId: true, createdAt: true }).shape, // Mantiene las otras reglas
  date: z.string(), // Sobrescribe el campo date
});
export type CreateExpense=z.infer<typeof createExpenseSchema>;