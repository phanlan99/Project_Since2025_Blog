'use server';

import { db } from '@/db';
import { comments, posts, notifications } from '@/db/schema';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function addCommentAction(formData: FormData) {
  // 1. Lấy dữ liệu từ form
  const content = formData.get('content') as string;
  const postId = formData.get('postId') as string;

  const cookieStore = await cookies();
  const currentUserId = cookieStore.get('userId')?.value;

  // Check lỗi cơ bản
  if (!currentUserId || !content || !postId) return;

  const parsedPostId = parseInt(postId);
  const parsedUserId = parseInt(currentUserId);

  // 2. Lưu bình luận (GIỮ NGUYÊN)
  await db.insert(comments).values({
    content: content,
    postId: parsedPostId,
    userId: parsedUserId,
  });

  // 3. LOGIC THÔNG BÁO
  // Lấy thông tin bài viết để biết chủ bài viết là ai
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parsedPostId),
    with: { author: true },
  });

  // Nếu bài viết tồn tại và người comment KHÔNG phải chủ bài viết
  if (post && post.userId !== parsedUserId) {
    await db.insert(notifications).values({
      userId: post.userId!, // Gửi cho chủ bài viết
      message: `Ai đó vừa bình luận vào bài viết "${post.title}" của bạn.`,
      
      // 👉 Dẫn thẳng về trang chi tiết bài viết
      link: `/dashboard/posts/${postId}`,

      isRead: false,
    });
  }

  // 4. Revalidate cache
  // Làm mới trang chi tiết bài viết
  revalidatePath(`/dashboard/posts/${postId}`);

  // Làm mới dashboard (để cập nhật danh sách thông báo)
  revalidatePath('/dashboard');
}
