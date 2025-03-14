import { createFileRoute,useNavigate } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import {api} from '@/lib/api'
export const Route = createFileRoute('/create-expense')({
  component: CreateExpense,
})




function CreateExpense() {
  const navigate=useNavigate()
  const form = useForm({
    defaultValues: {
      category: '',
      description: '',
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      const res=await api.expenses.$post({json:value});
      if(!res.ok){
        throw Error("server error")
      }
      navigate({to:"/expenses"})
      console.log(value)
    },
  })
  return (
    <div className="p-2">
      <h2>Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="max-w-xl mx-auto p-4 border rounded-md shadow-md"
      >
        {/* Campo Category */}
        <form.Field name="category">
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
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <em>{field.state.meta.errors.join(", ")}</em>
              )}
            </>
          )}
        </form.Field>
  
        {/* Campo Description */}
        <form.Field name="description">
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
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <em>{field.state.meta.errors.join(", ")}</em>
              )}
            </>
          )}
        </form.Field>
  
        {/* Campo Amount */}
        <form.Field name="amount">
          {(field) => (
            <>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <em>{field.state.meta.errors.join(", ")}</em>
              )}
            </>
          )}
        </form.Field>
  
        {/* Botón de Submit */}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="button" variant="outline" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
