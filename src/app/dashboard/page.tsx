import { db } from '@/db';
import { addCommentAction } from './comment-action';
import { togglePostLike, toggleCommentLike } from './like-actions'; // Import action like
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const currentUserId = Number(cookieStore.get('userId')?.value || 0);

  // Query dữ liệu lồng nhau: Post -> Likes, Post -> Comments -> Likes
  const allPosts = await db.query.posts.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: {
      author: true,
      likes: true, // Lấy danh sách like của bài viết
      comments: {
        with: {
          author: true,
          likes: true, // Lấy danh sách like của comment
        },
        orderBy: (comments, { asc }) => [asc(comments.createdAt)],
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="bg-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold">Bảng tin cộng đồng 📢</h1>
        <p className="mt-2 text-indigo-100">Cùng thảo luận và chia sẻ quan điểm nhé!</p>
      </div>

      <div className="space-y-8">
        {allPosts.map((post) => {
          // Check xem mình đã like bài này chưa
          const isPostLiked = post.likes.some(like => like.userId === currentUserId);

          return (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-4 flex items-center border-b border-gray-50 bg-gray-50/50">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {post.author?.email?.[0].toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-gray-900">{post.author?.email}</p>
                  <p className="text-xs text-gray-500">{post.createdAt?.toLocaleString('vi-VN')}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg object-cover mb-4" />
                )}

                {/* --- NÚT LIKE BÀI VIẾT --- */}
                <form action={togglePostLike}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button 
                    type="submit" 
                    className={`flex items-center gap-1 text-sm font-medium transition ${isPostLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isPostLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {post.likes.length > 0 && <span>{post.likes.length}</span>}
                  </button>
                </form>
              </div>

              {/* Comments */}
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                {post.comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {post.comments.map((comment) => {
                      // Check xem mình đã like comment này chưa
                      const isCommentLiked = comment.likes.some(like => like.userId === currentUserId);
                      
                      return (
                        <div key={comment.id} className="flex gap-3 group">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
                            {comment.author?.email?.[0].toUpperCase()}
                          </div>
                          
                          <div className="flex-1">
                            <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 inline-block pr-8 relative">
                                <span className="text-xs font-bold text-gray-900 block">{comment.author?.email}</span>
                                <span className="text-sm text-gray-700">{comment.content}</span>
                                
                                {/* --- NÚT LIKE BÌNH LUẬN (Nhỏ góc phải) --- */}
                                <div className="absolute -bottom-3 right-0">
                                   <form action={toggleCommentLike}>
                                     <input type="hidden" name="commentId" value={comment.id} />
                                     <input type="hidden" name="postId" value={post.id} />
                                     <button 
                                       type="submit" 
                                       className={`bg-white shadow border border-gray-100 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 text-xs ${isCommentLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                     >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={isCommentLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                        {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
                                     </button>
                                   </form>
                                </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Form nhập bình luận (Giữ nguyên, chỉ thêm async wrapper cho chắc) */}
                <form 
                  action={async (formData) => {
                    "use server"
                    await addCommentAction(formData)
                  }} 
                  className="flex gap-2"
                >
                  <input type="hidden" name="postId" value={post.id} />
                  <input 
                    name="content" 
                    required 
                    autoComplete="off"
                    placeholder="Viết bình luận..." 
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition">Gửi</button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}