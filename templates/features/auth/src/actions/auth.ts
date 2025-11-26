'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { http } from '@/lib/http';

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
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
    redirect('/dashboard');
  }
  
  return { success: false, error: 'Invalid credentials' };
}

export async function register(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
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
    redirect('/login');
  }
  
  return { success: false, error: 'Registration failed' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('jwt-token');
  redirect('/login');
}
