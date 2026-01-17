import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import RegisterForm from "./register-form"

export default async function RegisterPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('registerTitle')}</CardTitle>
          <CardDescription>
            {t('registerDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <RegisterForm locale={locale} />
        </CardContent>
        <CardFooter>
           <div className="text-sm text-muted-foreground w-full text-center">
             {t('alreadyHaveAccount')} <Link href="/login" className="text-primary hover:underline">{t('signIn')}</Link>
           </div>
        </CardFooter>
      </Card>
    </div>
  )
}
