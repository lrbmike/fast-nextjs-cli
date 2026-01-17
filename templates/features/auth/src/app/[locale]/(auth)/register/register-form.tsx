"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/actions/auth";
import type { AuthActionState } from "@/lib/types/auth";

type RegisterFormProps = {
  locale: string;
};

const initialState: AuthActionState = {
  success: false,
  error: null,
};

export default function RegisterForm({ locale }: RegisterFormProps) {
  const t = useTranslations("Auth");
  const [state, formAction, isPending] = useActionState(register, initialState);
  const errorMessage = state.error ? t(state.error) : null;

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
        />
      </div>
      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}
      <Button className="w-full" type="submit" disabled={isPending}>
        {t("signUp")}
      </Button>
    </form>
  );
}
