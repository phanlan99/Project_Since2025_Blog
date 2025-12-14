'use server'

import { db } from '@/db';
import { posts, postImages } from '@/db/schema'; // Import thêm postImages
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Lấy TẤT CẢ các input có name="imageUrls"
  const imageUrls = formData.getAll('imageUrls') as string[];

  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId || !title || !content) return;

  // 1. Tạo bài viết trước để lấy ID
  // Hàm returning({ insertedId: posts.id }) giúp lấy ID vừa tạo
  const [newPost] = await db.insert(posts).values({
    title,
    content,
    imageUrl: null, // Cột cũ bỏ qua hoặc để null
    userId: parseInt(userId),
  }).returning({ insertedId: posts.id });

  // 2. Lưu danh sách ảnh vào bảng post_images
  // Lọc bỏ những dòng trống
  const validImages = imageUrls.filter(url => url.trim() !== '');
  
  if (validImages.length > 0) {
    await db.insert(postImages).values(
      validImages.map(url => ({
        postId: newPost.insertedId,
        url: url
      }))
    );
  }

  revalidatePath('/dashboard/my-posts');
  revalidatePath('/dashboard');
}