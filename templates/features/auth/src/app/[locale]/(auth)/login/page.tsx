import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/actions/auth"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function LoginPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('loginTitle')}</CardTitle>
          <CardDescription>
            {t('loginDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={login} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required defaultValue="admin@example.com"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input id="password" name="password" type="password" required defaultValue="password"/>
            </div>
            <Button className="w-full" type="submit">{t('signIn')}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <div className="text-sm text-muted-foreground w-full text-center">
             {t('dontHaveAccount')} <Link href="/register" className="text-primary hover:underline">{t('signUp')}</Link>
           </div>
           <div className="text-xs text-muted-foreground w-full text-center">
             {t('demoCredentials')}
           </div>
        </CardFooter>
      </Card>
    </div>
  )
}
