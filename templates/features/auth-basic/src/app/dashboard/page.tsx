import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logout } from "@/actions/auth";
import DashboardClient from "./dashboard-client";
import { getDashboardData } from "@/lib/api/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            This is a protected page. You can only see this if you are logged in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>Welcome back!</p>
          <DashboardClient data={data} />
          <form action={logout}>
            <Button variant="destructive" type="submit">
              Logout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
