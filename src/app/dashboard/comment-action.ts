'use server'

import { db } from '@/db';
import { comments } from '@/db/schema';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function addCommentAction(formData: FormData) {
  const content = formData.get('content') as string;
  const postId = formData.get('postId') as string;

  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return { error: 'Bạn chưa đăng nhập' };
  }

  if (!content || !postId) {
    return { error: 'Nội dung không hợp lệ' };
  }

  // Lưu bình luận vào DB
  await db.insert(comments).values({
    content: content,
    postId: parseInt(postId),
    userId: parseInt(userId),
  });

  // Load lại trang dashboard để hiện bình luận mới ngay lập tức
  revalidatePath('/dashboard');
}