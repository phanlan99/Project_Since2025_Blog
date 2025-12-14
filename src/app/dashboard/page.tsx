import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Image from 'next/image'; // Dùng thẻ Image của Next.js cho tối ưu

// Component này là Server Component (mặc định), nên có thể gọi DB trực tiếp
export default async function DashboardPage() {
  
  // Lấy danh sách bài viết, sắp xếp mới nhất lên đầu
  const latestPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div>
      {/* Banner chào mừng */}
      <div className="bg-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold">Xin chào! 👋</h1>
        <p className="mt-2 text-indigo-100">Chào mừng bạn quay trở lại trang quản trị.</p>
      </div>

      {/* Phần: Các bài đăng mới nhất */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Các bài đăng mới nhất</h2>

      {latestPosts.length === 0 ? (
        <p className="text-gray-500">Chưa có bài đăng nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              {/* Ảnh bài viết */}
              <div className="h-48 w-full relative bg-gray-200">
                {post.imageUrl ? (
                   // Lưu ý: Để dùng External Image (như picsum), cần cấu hình next.config.ts. 
                   // Tạm thời dùng thẻ img thường cho đơn giản nhé.
                   <img 
                     src={post.imageUrl} 
                     alt={post.title} 
                     className="w-full h-full object-cover"
                   />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
              </div>
              
              {/* Nội dung bài viết */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.content}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  Đăng ngày: {post.createdAt?.toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}