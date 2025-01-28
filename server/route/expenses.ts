import { Hono } from "hono";
import {z} from "zod";
import { zValidator } from "@hono/zod-validator";
import { OuterExpressionKinds } from "typescript";

const expenseSchema=z.object({
    id:z.number().int().positive().min(1),
    category:z.string().min(3).max(100),
    description:z.string().min(3).max(250),
    amount:z.number().positive()
})
type Expense=z.infer<typeof expenseSchema>
const createPostSquema=expenseSchema.omit({id:true})

const fakeExpenses: Expense[]=[
    {
      id: 1,
      category: "Food & Dining",
      description: "Grocery shopping",
      amount: 75.50
    },
    {
      id: 2,
      category: "Transportation",
      description: "Gas refill",
      amount: 45.00
    },
    {
      id: 3,
      category: "Entertainment",
      description: "Movie tickets",
      amount: 25.00
    },
    {
      id: 4,
      category: "Bills",
      description: "Electricity bill",
      amount: 120.00
    },
    {
      id: 5,
      category: "Food & Dining",
      description: "Restaurant dinner",
      amount: 60.75
    },
    {
      id: 6,
      category: "Health",
      description: "Pharmacy - medications",
      amount: 18.90
    }
  ]

export const expensesRoute = new Hono()
.get("/",(c)=>{
    return c.json({expenses:fakeExpenses})
})
.post("/",zValidator("json",createPostSquema), async (c)=>{
    const data=await c.req.valid("json")
    const expense=createPostSquema.parse(data)
    fakeExpenses.push({...expense,id:fakeExpenses.length+1})
    c.status(201)
    return c.json(expense);
})
.get("/total-spent",(c)=>{
  const total=fakeExpenses.reduce((acc,expense)=>acc+expense.amount,0);
  return c.json({total});
})
.get("/:id",(c)=>{
    const id=Number.parseInt(c.req.param("id"))
    const expense=fakeExpenses.find(expense=>expense.id===id)
    if(!expense){
        return c.notFound()
    }
    return c.json({expense})
})
.delete("/:id{[0-9]+}",(c)=>{
    const id=Number.parseInt(c.req.param("id"))
    const index=fakeExpenses.findIndex(expense=>expense.id===id)
    if(index===-1){
        return c.notFound();
    }
    const deletedExpense=fakeExpenses.slice(index,1)[0];
    return c.json({expense:deletedExpense});
})
//.put