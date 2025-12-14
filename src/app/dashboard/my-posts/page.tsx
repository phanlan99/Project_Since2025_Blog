import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import Link from 'next/link';

// --- IMPORT CÁC COMPONENT MỚI ---
import CreatePostForm from './CreatePostForm'; 
import ImageGrid from '../ImageGrid'; 
// -------------------------------

export default async function MyPostsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  // Sử dụng db.query để lấy relation (images) dễ dàng
  const myPosts = await db.query.posts.findMany({
    where: eq(posts.userId, Number(userId)),
    orderBy: [desc(posts.createdAt)],
    with: { 
        images: true // Lấy danh sách ảnh đi kèm
    } 
  });

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* CỘT TRÁI: Dùng Component Form Mới */}
      <div className="lg:col-span-1">
         <CreatePostForm /> 
      </div>

      {/* CỘT PHẢI: Danh sách bài đã đăng */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🗂️ Bài viết của tôi ({myPosts.length})</h2>
        
        <div className="space-y-4">
          {myPosts.length === 0 ? (
             <p className="text-gray-500 bg-white p-4 rounded shadow">Bạn chưa có bài viết nào. Hãy viết bài đầu tiên nhé!</p>
          ) : (
             myPosts.map((post) => (
                <Link key={post.id} href={`/dashboard/posts/${post.id}`} className="block group">
                   <div className="bg-white p-4 rounded-lg shadow border border-transparent group-hover:border-indigo-300 transition-all">
                    
                      {/* Dùng ImageGrid thay vì img thẻ thường */}
                      <ImageGrid images={post.images} />

                      <div className="mt-3">
                       <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                       <p className="text-gray-600 text-sm line-clamp-2 mt-1">{post.content}</p>
                       <p className="text-xs text-gray-400 mt-2">Đăng lúc: {post.createdAt?.toLocaleString('vi-VN')}</p>
                      </div>
                   </div>
                </Link>
             ))
          )}
        </div>
      </div>
    </div>
  );
}