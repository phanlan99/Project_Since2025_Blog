'use server'

import { db } from '@/db';
import { postLikes, commentLikes, notifications, posts, comments } from '@/db/schema'; 
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
    // Đã like -> Xóa (Unlike) -> Không cần thông báo
    await db.delete(postLikes).where(
      and(eq(postLikes.userId, uid), eq(postLikes.postId, pid))
    );
  } else {
    // Chưa like -> Thêm (Like)
    await db.insert(postLikes).values({ userId: uid, postId: pid });

    // --- LOGIC THÔNG BÁO TIM BÀI VIẾT ---
    // 1. Lấy thông tin bài viết để biết chủ nhân
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, pid),
    });

    // 2. Kiểm tra tồn tại + Có userId + Không phải tự like chính mình
    if (post && post.userId && post.userId !== uid) {
      await db.insert(notifications).values({
        userId: post.userId, 
        message: `Ai đó đã thả tim bài viết "${post.title}" của bạn ❤️`,
        link: `/dashboard/posts/${pid}`, 
        isRead: false,
      });
    }
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/posts/${postId}`);
}

// --- XỬ LÝ LIKE BÌNH LUẬN ---
export async function toggleCommentLike(formData: FormData) {
  const commentId = formData.get('commentId') as string;
  const postId = formData.get('postId') as string;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId || !commentId) return;

  const uid = parseInt(userId);
  const cid = parseInt(commentId);

  const existingLike = await db.select().from(commentLikes).where(
    and(eq(commentLikes.userId, uid), eq(commentLikes.commentId, cid))
  );

  if (existingLike.length > 0) {
    // Unlike -> Xóa
    await db.delete(commentLikes).where(
      and(eq(commentLikes.userId, uid), eq(commentLikes.commentId, cid))
    );
  } else {
    // Like -> Thêm
    await db.insert(commentLikes).values({ userId: uid, commentId: cid });

    // --- LOGIC THÔNG BÁO TIM BÌNH LUẬN ---
    // 1. Lấy thông tin bình luận để biết chủ nhân
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, cid),
    });

    // 2. Kiểm tra tồn tại + Có userId + Không phải tự like chính mình
    if (comment && comment.userId && comment.userId !== uid) {
       // Cắt ngắn nội dung comment để hiển thị cho đẹp
       const shortContent = comment.content.length > 20 
         ? comment.content.substring(0, 20) + '...' 
         : comment.content;

      await db.insert(notifications).values({
        userId: comment.userId,
        message: `Ai đó đã thả tim bình luận "${shortContent}" của bạn ❤️`,
        link: `/dashboard/posts/${postId}`, // Link đến bài viết chứa comment đó
        isRead: false,
      });
    }
  }

  revalidatePath('/dashboard');
  if (postId) revalidatePath(`/dashboard/posts/${postId}`);
}