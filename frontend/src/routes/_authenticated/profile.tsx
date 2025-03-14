import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { userQueryOptions } from "@/lib/api";
import { Button } from '@/components/ui/button';


export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})


function Profile() {
  const {isPending, error,data} = useQuery(userQueryOptions);
  if(isPending)return "Loading"
  if(error) return "not logged in"
  return <div className="p-2">Hello from About!
    <p>Hello {data.user.family_name}</p>
      <a href="/api/logout">
        <Button variant="destructive" className="px-6 py-2 text-lg">
            Logout
        </Button>
      </a>
  </div>
}