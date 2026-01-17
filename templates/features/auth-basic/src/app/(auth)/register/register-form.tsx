"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/actions/auth";
import type { AuthActionState, AuthErrorKey } from "@/lib/types/auth";

const initialState: AuthActionState = {
  success: false,
  error: null,
};

const errorMessages: Record<AuthErrorKey, string> = {
  invalidCredentials: "Invalid email or password.",
  loginFailed: "Login failed. Please try again.",
  invalidRegistrationData: "Please fill in all required fields.",
  passwordMismatch: "Passwords do not match.",
  registrationFailed: "Registration failed. Please try again.",
};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);
  const errorMessage = state.error ? errorMessages[state.error] : null;

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
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
        Sign Up
      </Button>
    </form>
  );
}
