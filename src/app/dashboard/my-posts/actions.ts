'use server'

import { db } from '@/db';
import { posts } from '@/db/schema';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;

  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return { error: 'Bạn chưa đăng nhập' };
  }

  if (!title || !content) {
    return { error: 'Tiêu đề và nội dung là bắt buộc' };
  }

  // Lưu vào Database
  await db.insert(posts).values({
    title,
    content,
    imageUrl: imageUrl || null,
    userId: parseInt(userId), // Gắn bài viết với ID người dùng
  });

  // Làm mới dữ liệu trang danh sách bài viết
  revalidatePath('/dashboard/my-posts');
  revalidatePath('/dashboard'); // Làm mới cả trang chủ
}