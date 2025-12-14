import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { addCommentAction } from '../../comment-action';// Import action comment (chú ý đường dẫn ../)
import Link from 'next/link';

// Định nghĩa params cho Next.js 15/16 (dạng Promise)
export default async function PostDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; // Phải await params trước
  const postId = parseInt(params.id);

  if (isNaN(postId)) return <div>Bài viết không tồn tại</div>;

  // Lấy đúng bài viết theo ID
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    with: {
      author: true,
      comments: {
        with: { author: true },
        orderBy: (comments, { asc }) => [asc(comments.createdAt)],
      },
    },
  });

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-gray-700">Bài viết không tồn tại hoặc đã bị xóa.</h2>
        <Link href="/dashboard" className="text-indigo-600 hover:underline mt-4 block">
          &larr; Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Nút quay lại */}
      <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Quay lại Bảng tin
      </Link>

      {/* Nội dung bài viết (Tái sử dụng giao diện cũ) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
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
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">
            {post.content}
          </p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg object-cover mb-4" />
          )}
        </div>

        {/* Comment Section */}
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Bình luận ({post.comments.length})</h3>
          
          <div className="space-y-4 mb-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
                  {comment.author?.email?.[0].toUpperCase()}
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex-1">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-900">{comment.author?.email}</span>
                      <span className="text-xs text-gray-400">{comment.createdAt?.toLocaleTimeString('vi-VN')}</span>
                   </div>
                  <span className="text-sm text-gray-700">{comment.content}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form Comment */}
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
              placeholder="Viết bình luận của bạn..." 
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
              Gửi
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}