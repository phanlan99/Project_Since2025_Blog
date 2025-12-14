'use server'

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Đổi tên hàm thành updateProfileAction cho tổng quát
export async function updateProfileAction(formData: FormData) {
  const avatarUrl = formData.get('avatarUrl') as string;
  const displayName = formData.get('displayName') as string; // Lấy tên từ form
  
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) return;

  // Cập nhật cả 2 trường vào Database
  await db.update(users)
    .set({ 
      avatarUrl: avatarUrl || null,
      displayName: displayName || null // Lưu tên hiển thị
    })
    .where(eq(users.id, parseInt(userId)));

  // Làm mới dữ liệu toàn trang web
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
}