import { db } from '@/db';
import { addCommentAction } from './comment-action';
import { cookies } from 'next/headers';
import CommentItem from './CommentItem';
import Link from 'next/link';
import PostLikeControl from './PostLikeControl'; // <--- Import Component mới

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const currentUserId = Number(cookieStore.get('userId')?.value || 0);

  const allPosts = await db.query.posts.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: {
      author: true,
      
      // Lấy thông tin user trong likes bài viết
      likes: {
        with: {
          user: true,
        },
      },

      comments: {
        with: {
          author: true,
          // Lấy thông tin user trong likes bình luận
          likes: {
            with: {
              user: true,
            },
          },
        },
        orderBy: (comments, { asc }) => [asc(comments.createdAt)],
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="bg-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold">Bảng tin cộng đồng 📢</h1>
        <p className="mt-2 text-indigo-100">
          Cùng thảo luận và chia sẻ quan điểm nhé!
        </p>
      </div>

      <div className="space-y-8">
        {allPosts.map((post) => {
          // 🔹 Chỉ lấy comment gốc (không có parent)
          const rootComments = post.comments.filter(
            (comment) => comment.parentId === null
          );

          return (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* HEADER */}
              <div className="p-4 flex items-center border-b border-gray-50 bg-gray-50/50">
                
                {/* --- AVATAR CÓ LINK --- */}
                <Link href={`/dashboard/user/${post.author?.id}`}>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition">
                    {post.author?.avatarUrl ? (
                      <img
                        src={post.author.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      post.author?.email?.[0].toUpperCase()
                    )}
                  </div>
                </Link>
                {/* ---------------------- */}

                <div className="ml-3">
                  {/* --- TÊN NGƯỜI ĐĂNG CÓ LINK --- */}
                  <Link 
                    href={`/dashboard/user/${post.author?.id}`} 
                    className="hover:underline"
                  >
                    <p className="text-sm font-bold text-gray-900">
                      {post.author?.displayName || post.author?.email}
                    </p>
                  </Link>
                  {/* ------------------------------ */}
                  
                  <p className="text-xs text-gray-500">
                    {post.createdAt?.toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full rounded-lg object-cover mb-4"
                  />
                )}

                {/* --- LIKE CONTROL COMPONENT (MỚI) --- */}
                <PostLikeControl 
                  postId={post.id} 
                  likes={post.likes} 
                  currentUserId={currentUserId} 
                />
                {/* ------------------------------------ */}
              </div>

              {/* COMMENTS */}
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                {/* LIST COMMENT (TREE) */}
                <div className="space-y-4 mb-4">
                  {rootComments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      allComments={post.comments}
                      currentUserId={currentUserId}
                      postId={post.id}
                    />
                  ))}
                </div>

                {/* FORM COMMENT GỐC */}
                <form
                  action={async (formData) => {
                    'use server';
                    await addCommentAction(formData);
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
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition"
                  >
                    Gửi
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}