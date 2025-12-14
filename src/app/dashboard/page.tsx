import { db } from '@/db';
import { desc } from 'drizzle-orm';
import { addCommentAction } from './comment-action'; // Import action vừa tạo
import Image from 'next/image';

export default async function DashboardPage() {

  // Dùng db.query để lấy dữ liệu lồng nhau (Post -> Author, Post -> Comments -> Author)
  const allPosts = await db.query.posts.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)], // Sắp xếp mới nhất
    with: {
      author: true, // Lấy thông tin người đăng bài
      comments: {
        with: {
          author: true, // Lấy thông tin người bình luận
        },
        orderBy: (comments, { asc }) => [asc(comments.createdAt)] // Bình luận cũ ở trên
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Banner */}
      <div className="bg-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold">Bảng tin cộng đồng 📢</h1>
        <p className="mt-2 text-indigo-100">Cùng thảo luận và chia sẻ quan điểm nhé!</p>
      </div>

      {/* Danh sách bài viết */}
      <div className="space-y-8">
        {allPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header bài viết: Người đăng */}
            <div className="p-4 flex items-center border-b border-gray-50 bg-gray-50/50">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {post.author?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-900">{post.author?.email}</p>
                <p className="text-xs text-gray-500">
                  {post.createdAt?.toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

              {post.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover" />
                </div>
              )}
            </div>

            {/* --- KHU VỰC BÌNH LUẬN --- */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">

              {/* Danh sách các bình luận cũ */}
              {post.comments.length > 0 && (
                <div className="space-y-3 mb-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      {/* Avatar nhỏ */}
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
                        {comment.author?.email?.[0].toUpperCase()}
                      </div>
                      {/* Nội dung bình luận */}
                      <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex-1">
                        <span className="text-xs font-bold text-gray-900 block">
                          {comment.author?.email}
                        </span>
                        <span className="text-sm text-gray-700">{comment.content}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form nhập bình luận mới */}
              <form
                action={async (formData) => {
                  "use server"
                  await addCommentAction(formData)
                }}
                className="flex gap-2"
              >
                {/* Input ẩn để gửi ID bài viết */}
                <input type="hidden" name="postId" value={post.id} />

                <input
                  name="content"
                  required
                  autoComplete="off"
                  placeholder="Viết bình luận..."
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition"
                >
                  Gửi
                </button>
              </form>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}