'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { http } from '@/lib/http';
import { routing } from '@/i18n/routing';

function resolveLocale(formData: FormData) {
  const locale = formData.get('locale');
  if (typeof locale === 'string' && routing.locales.includes(locale as any)) {
    return locale;
  }
  return routing.defaultLocale;
}

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const locale = resolveLocale(formData);
  let isSuccess = false;
  
  try {
    const result = await http<{ token: string, user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      requiresAuth: false
    });

    if (result.token) {
      const cookieStore = await cookies();
      cookieStore.set('jwt-token', result.token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      
      isSuccess = true;
    }
  } catch (error) {
    console.error('Login failed:', error);
  }

  if (isSuccess) {
    redirect(`/${locale}/dashboard`);
  }
  
  return { success: false, error: 'Invalid credentials' };
}

export async function register(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const locale = resolveLocale(formData);
  let isSuccess = false;
  
  try {
    const result = await http<{ token: string, user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requiresAuth: false
    });

    if (result.token) {
      // Registration successful
      isSuccess = true;
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }

  if (isSuccess) {
    redirect(`/${locale}/login`);
  }
  
  return { success: false, error: 'Registration failed' };
}

export async function logout(formData: FormData) {
  const locale = resolveLocale(formData);
  const cookieStore = await cookies();
  cookieStore.delete('jwt-token');
  redirect(`/${locale}/login`);
}
