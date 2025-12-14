'use server'

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateAvatarAction(formData: FormData) {
  const avatarUrl = formData.get('avatarUrl') as string;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) return;

  // Cập nhật URL vào Database
  await db.update(users)
    .set({ avatarUrl: avatarUrl })
    .where(eq(users.id, parseInt(userId)));

  // Làm mới trang để hiển thị ảnh mới
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
}