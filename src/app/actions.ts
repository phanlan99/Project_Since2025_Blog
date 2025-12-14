'use server'

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Vui lòng nhập đầy đủ thông tin' };
  }

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (user.length === 0 || user[0].password !== password) {
    return { error: 'Email hoặc mật khẩu không đúng' };
  }

  /// --- SỬA ĐOẠN NÀY ---
  const cookieStore = await cookies();
  
  // Lưu ID người dùng vào cookie để dùng sau này
  cookieStore.set('userId', user[0].id.toString(), { httpOnly: true }); 
  cookieStore.set('isLoggedIn', 'true', { httpOnly: true });
  // --------------------

  redirect('/dashboard');
}