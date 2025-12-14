'use server'

import { db } from '@/db';
import { comments, posts, notifications } from '@/db/schema';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function addCommentAction(formData: FormData) {
  const content = formData.get('content') as string;
  const postId = formData.get('postId') as string;
  const parentId = formData.get('parentId') as string | null; // Lấy parentId từ form

  const cookieStore = await cookies();
  const currentUserId = cookieStore.get('userId')?.value;

  if (!currentUserId || !content || !postId) return;
  const uid = parseInt(currentUserId);
  const pid = parseInt(postId);

  // 1. Lưu bình luận
  await db.insert(comments).values({
    content: content,
    postId: pid,
    userId: uid,
    parentId: parentId ? parseInt(parentId) : null, // Lưu parentId nếu có
  });

  // 2. LOGIC THÔNG BÁO (NÂNG CẤP)
  
  if (parentId) {
    // TRƯỜNG HỢP 1: TRẢ LỜI BÌNH LUẬN -> Báo cho người bình luận gốc
    const parentComment = await db.query.comments.findFirst({
      where: eq(comments.id, parseInt(parentId)),
    });

    if (parentComment && parentComment.userId !== uid) {
      await db.insert(notifications).values({
        userId: parentComment.userId,
        message: `Ai đó đã trả lời bình luận của bạn: "${content.substring(0, 20)}..." 💬`,
        link: `/dashboard/posts/${pid}`,
        isRead: false,
      });
    }

  } else {
    // TRƯỜNG HỢP 2: BÌNH LUẬN BÀI VIẾT -> Báo cho chủ bài viết (Logic cũ)
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, pid),
    });

    if (post && post.userId !== uid) {
      await db.insert(notifications).values({
        userId: post.userId!,
        message: `Ai đó vừa bình luận bài viết "${post.title}" của bạn.`,
        link: `/dashboard/posts/${pid}`,
        isRead: false,
      });
    }
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/posts/${postId}`);
}