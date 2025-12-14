'use server'

import { db } from '@/db';
import { postLikes, commentLikes } from '@/db/schema';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';

// --- XỬ LÝ LIKE BÀI VIẾT ---
export async function togglePostLike(formData: FormData) {
  const postId = formData.get('postId') as string;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId || !postId) return;

  const uid = parseInt(userId);
  const pid = parseInt(postId);

  // Kiểm tra xem đã like chưa
  const existingLike = await db.select().from(postLikes).where(
    and(eq(postLikes.userId, uid), eq(postLikes.postId, pid))
  );

  if (existingLike.length > 0) {
    // Đã like -> Xóa (Unlike)
    await db.delete(postLikes).where(
      and(eq(postLikes.userId, uid), eq(postLikes.postId, pid))
    );
  } else {
    // Chưa like -> Thêm (Like)
    await db.insert(postLikes).values({ userId: uid, postId: pid });
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/posts/${postId}`);
}

// --- XỬ LÝ LIKE BÌNH LUẬN ---
export async function toggleCommentLike(formData: FormData) {
  const commentId = formData.get('commentId') as string;
  const postId = formData.get('postId') as string; // Cần postId để reload trang
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId || !commentId) return;

  const uid = parseInt(userId);
  const cid = parseInt(commentId);

  const existingLike = await db.select().from(commentLikes).where(
    and(eq(commentLikes.userId, uid), eq(commentLikes.commentId, cid))
  );

  if (existingLike.length > 0) {
    await db.delete(commentLikes).where(
      and(eq(commentLikes.userId, uid), eq(commentLikes.commentId, cid))
    );
  } else {
    await db.insert(commentLikes).values({ userId: uid, commentId: cid });
  }

  revalidatePath('/dashboard');
  if (postId) revalidatePath(`/dashboard/posts/${postId}`);
}