import { createFileRoute, Outlet } from "@tanstack/react-router";
import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
// src/routes/_authenticated.tsx
const Login = () => {
  return (
    <div>
        You have to login
        <a href="/api/login">
            <Button variant="outline" className="px-6 py-2 text-lg">
                Login
            </Button>
        </a>
    </div>
  );
};
const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }
  return <Outlet />;
};
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (e) {
        console.log(e);
        return { user: null };
    }

    //userQueryOptions
    //return {user:{name:""}};
    //return {user:null};
  },
  component: Component,
});
