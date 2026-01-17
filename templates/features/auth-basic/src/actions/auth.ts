"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { http, ApiResponse } from "@/lib/http";
import type { AuthActionState } from "@/lib/types/auth";

type LoginResponse = {
  token: string;
  user: { id: number; name: string; email: string };
};

type RegisterResponse = {
  success: true;
  user: { id: number; name: string; email: string };
};

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  let isSuccess = false;

  if (typeof email !== "string" || typeof password !== "string") {
    return { success: false, error: "invalidCredentials" };
  }

  try {
    const result = await http<ApiResponse<LoginResponse>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    });

    const token = result.data?.token;
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("jwt-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      isSuccess = true;
    }
  } catch (error) {
    console.error("Login failed:", error);
    if (error instanceof Error && error.message.includes("401")) {
      return { success: false, error: "invalidCredentials" };
    }
    return { success: false, error: "loginFailed" };
  }

  if (isSuccess) {
    redirect("/dashboard");
  }

  return { success: false, error: "invalidCredentials" };
}

export async function register(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  let isSuccess = false;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return { success: false, error: "invalidRegistrationData" };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "passwordMismatch" };
  }

  try {
    const result = await http<ApiResponse<RegisterResponse>>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    });

    if (result.data?.success) {
      isSuccess = true;
    }
  } catch (error) {
    console.error("Registration failed:", error);
    if (error instanceof Error && error.message.includes("400")) {
      return { success: false, error: "invalidRegistrationData" };
    }
    return { success: false, error: "registrationFailed" };
  }

  if (isSuccess) {
    redirect("/login");
  }

  return { success: false, error: "registrationFailed" };
}

export async function logout(formData: FormData) {
  const _unused = formData;
  const cookieStore = await cookies();
  cookieStore.delete("jwt-token");
  redirect("/login");
}
