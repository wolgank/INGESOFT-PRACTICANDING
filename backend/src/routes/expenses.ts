import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import { expenses as expensesTable, expensesInsertSchema } from "../db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";
import { createExpenseSchema } from "../sharedTypes";


export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);
    return c.json({ expenses: expenses });
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const expense = await c.req.valid("json");
    console.log("Expense recibido:", expense);
    const user = c.var.user;
    const validatedExpenses=expensesInsertSchema.parse({
      ...expense,
      userId: user.id,
      date: new Date(expense.date),
    });
    const lastInsertId  = await db
      .insert(expensesTable)
      .values(validatedExpenses)
      .$returningId()
      .then((res)=>res[0]);
    const result = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, lastInsertId.id),eq(expensesTable.userId, user.id)))
      .then((res)=>res[0]);
    c.status(201);
    return c.json(result);
  })
  .get("/total-spent", getUser, async(c) => {
    const user = c.var.user;
    const result = await db
      .select({total: sum(expensesTable.amount)})
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then(res=>res[0]);
    return c.json(result);
  })
  .get("/:id", getUser, async(c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id),eq(expensesTable.userId, user.id)))
      .then(res=>res[0]);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", getUser, async(c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const expense = await db
      .select({ id: expensesTable.id })
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .then((res) => res[0]?.id);

    if (!expense) {
      return c.notFound();
    }

    await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.id, id),eq(expensesTable.userId, user.id)))
    return c.json({ expense: expense });
  });
//.put
