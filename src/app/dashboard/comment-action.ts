'use server'

import { db } from '@/db';
import { comments, posts, notifications } from '@/db/schema'; // Nhớ import notifications, posts
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function addCommentAction(formData: FormData) {
  const content = formData.get('content') as string;
  const postId = formData.get('postId') as string;

  const cookieStore = await cookies();
  const currentUserId = cookieStore.get('userId')?.value;
  const userEmail = "Một người dùng"; // Thực tế nên query lấy tên/email người comment

  if (!currentUserId || !content || !postId) return;

  // 1. Lưu bình luận bình thường
  await db.insert(comments).values({
    content: content,
    postId: parseInt(postId),
    userId: parseInt(currentUserId),
  });

  // 2. LOGIC THÔNG BÁO (MỚI THÊM)
  // Lấy thông tin bài viết để biết ai là chủ (author)
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(postId)),
    with: { author: true }
  });

  // Nếu bài viết tồn tại VÀ người comment KHÔNG PHẢI là chủ bài viết
  if (post && post.userId !== parseInt(currentUserId)) {
    await db.insert(notifications).values({
      userId: post.userId!, // Gửi cho chủ bài viết
      message: `Ai đó vừa bình luận vào bài viết "${post.title}" của bạn.`,
      link: '/dashboard', // Bấm vào sẽ về trang chủ
      isRead: false,
    });
  }

  revalidatePath('/dashboard');
}