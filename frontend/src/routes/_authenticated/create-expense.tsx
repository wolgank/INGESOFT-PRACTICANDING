import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { createExpense,getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { createExpenseSchema } from "@server/src/sharedTypes";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";


export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});


function CreateExpense() {
  const queryClient=useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      category: "",
      description: "",
      amount: "0",
      date: new Date().toISOString().split("T")[0],
    },
    validators: {
      onChange: createExpenseSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Expense antes de enviar:", value);

      const existingExpenses=await queryClient.ensureQueryData(getAllExpensesQueryOptions);

      navigate({ to: "/expenses" });

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey,{expense: value})
      try{
        const newExpense=await createExpense({value});
        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey,{
          ...existingExpenses,
          expenses:[newExpense,...existingExpenses.expenses]
        });
        toast("Expense Created", {
          description: `Successfully created new expense:${newExpense.id}`,
        })
      }catch(error){
        toast("Error", {
          description: "Failed to create new expense: " + ( error),
        });
      }finally{
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey,{})
      }
      
     
      
      
    },
  });
  return (
    <div className="w-full p-2 mx-auto">
      <h2>Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="max-w-xl mx-auto p-4 border rounded-md shadow-md flex flex-col gap-4"
      >
        {/* Campo Category */}
        <form.Field
          name="category"
          validators={{
            onChange: createExpenseSchema.shape.category,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Category</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <em className="text-red-500 text-sm">
                    {field.state.meta.errors
                      .filter(Boolean) // Filtra valores undefined o falsy
                      .map((err) =>
                        typeof err === "string"
                          ? err
                          : err?.message || "Unknown error"
                      )
                      .join(", ")}
                  </em>
                )}
            </>
          )}
        </form.Field>

        {/* Campo Description */}
        <form.Field
          name="description"
          validators={{
            onChange: createExpenseSchema.shape.description,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Description</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <em className="text-red-500 text-sm">
                    {field.state.meta.errors
                      .filter(Boolean) // Filtra valores undefined o falsy
                      .map((err) =>
                        typeof err === "string"
                          ? err
                          : err?.message || "Unknown error"
                      )
                      .join(", ")}
                  </em>
                )}
            </>
          )}
        </form.Field>

        {/* Campo Amount */}
        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <em className="text-red-500 text-sm">
                    {field.state.meta.errors
                      .filter(Boolean) // Filtra valores undefined o falsy
                      .map((err) =>
                        typeof err === "string"
                          ? err
                          : err?.message || "Unknown error"
                      )
                      .join(", ")}
                  </em>
                )}
            </>
          )}
        </form.Field>
        
        {/* Campo Date */}
        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date
          }}
        >
          {(field) => (
            <div className="self-center">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) => field.handleChange((date ?? new Date()).toISOString().split("T")[0])}
                className="rounded-md border shadow"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <em className="text-red-500 text-sm">
                    {field.state.meta.errors
                      .filter(Boolean) // Filtra valores undefined o falsy
                      .map((err) =>
                        typeof err === "string"
                          ? err
                          : err?.message || "Unknown error"
                      )
                      .join(", ")}
                  </em>
                )}
            </div>
          )}
        </form.Field>
        {/* Botón de Submit */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" variant="outline" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
