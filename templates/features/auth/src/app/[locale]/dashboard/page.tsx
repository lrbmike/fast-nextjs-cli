import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logout } from "@/actions/auth";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function DashboardPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Dashboard");

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t('welcome')}</p>
          <form action={logout}>
            <input type="hidden" name="locale" value={locale} />
            <Button variant="destructive" type="submit">
              {t('logout')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
