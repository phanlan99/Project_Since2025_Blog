'use server'

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(formData: FormData) {
  // Lấy dữ liệu từ form
  const avatarUrl = formData.get('avatarUrl') as string;
  const displayName = formData.get('displayName') as string;
  const coverImageUrl = formData.get('coverImageUrl') as string; // <--- Lấy link ảnh bìa

  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) return;

  // Cập nhật vào Database
  await db.update(users)
    .set({
      avatarUrl: avatarUrl || null,
      displayName: displayName || null,
      coverImageUrl: coverImageUrl || null // <--- Lưu vào DB
    })
    .where(eq(users.id, parseInt(userId)));

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  // Revalidate cả trang public profile của chính mình nếu có ai đang xem
  revalidatePath(`/dashboard/user/${userId}`);
}