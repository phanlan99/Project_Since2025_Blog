import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PublicProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const targetUserId = parseInt(params.id);

  if (isNaN(targetUserId)) return notFound();

  // 1. Lấy thông tin người dùng (Target User)
  const userProfile = await db.query.users.findFirst({
    where: eq(users.id, targetUserId),
  });

  if (!userProfile) return <div>Người dùng không tồn tại</div>;

  // 2. Lấy danh sách bài viết của người đó
  const userPosts = await db.query.posts.findMany({
    where: eq(posts.userId, targetUserId),
    orderBy: [desc(posts.createdAt)],
    with: {
        likes: true,
        comments: true
    }
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* --- PHẦN HEADER PROFILE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        <div className="px-8 pb-8 flex flex-col items-center -mt-16">
          
          {/* Avatar to */}
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avt" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-4xl font-bold">
                {(userProfile.displayName || userProfile.email)[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Tên và Email */}
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {userProfile.displayName || userProfile.email}
          </h1>
          {userProfile.displayName && (
              <p className="text-gray-500">{userProfile.email}</p>
          )}
          
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
              <span>📅 Tham gia: {userProfile.createdAt?.toLocaleDateString('vi-VN')}</span>
              <span>📝 <b>{userPosts.length}</b> bài viết</span>
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH BÀI VIẾT CỦA HỌ --- */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Bài viết đã đăng</h2>
      
      {userPosts.length === 0 ? (
          <p className="text-center text-gray-500 py-10 bg-white rounded-lg shadow">Người này chưa đăng bài viết nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userPosts.map((post) => (
                <Link key={post.id} href={`/dashboard/posts/${post.id}`} className="block group">
                    <div className="bg-white rounded-lg shadow border border-transparent group-hover:border-indigo-400 transition overflow-hidden h-full flex flex-col">
                        {/* Ảnh bìa bài viết */}
                        <div className="h-48 bg-gray-200 w-full relative">
                            {post.imageUrl ? (
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">No Image</div>
                            )}
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{post.content}</p>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                                <span>{post.createdAt?.toLocaleDateString('vi-VN')}</span>
                                <div className="flex gap-3">
                                    <span>❤️ {post.likes.length}</span>
                                    <span>💬 {post.comments.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      )}
    </div>
  );
}