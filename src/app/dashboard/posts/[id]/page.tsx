import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { addCommentAction } from '../../comment-action'; // Lưu ý đường dẫn ../
import { togglePostLike } from '../../like-actions';   // Import action like post
import Link from 'next/link';
import { cookies } from 'next/headers';
import CommentItem from '../../CommentItem'; // Import component hiển thị bình luận (đường dẫn ../../)

export default async function PostDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const postId = parseInt(params.id);

    // 1. Lấy User ID hiện tại
    const cookieStore = await cookies();
    const currentUserId = Number(cookieStore.get('userId')?.value || 0);

    if (isNaN(postId)) return <div>Bài viết không tồn tại</div>;

    // 2. Lấy dữ liệu bài viết (Kèm Likes và Comments + Likes của Comment)
    const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
        with: {
            author: true,
            likes: true, // Lấy danh sách like bài viết
            comments: {
                with: {
                    author: true,
                    likes: true // Lấy danh sách like comment
                },
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

    // Check xem user đã like bài viết này chưa
    const isPostLiked = post.likes.some(like => like.userId === currentUserId);

    // Lọc ra các bình luận gốc (Cấp 1)
    const rootComments = post.comments.filter(c => c.parentId === null);

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Nút quay lại */}
            <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Quay lại Bảng tin
            </Link>

            {/* Nội dung bài viết */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="p-4 flex items-center border-b border-gray-50 bg-gray-50/50">
                    
                    {/* --- AVATAR CÓ LINK --- */}
                    <Link href={`/dashboard/user/${post.author?.id}`}>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition">
                            {post.author?.avatarUrl ? (
                                <img src={post.author.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                post.author?.email?.[0].toUpperCase()
                            )}
                        </div>
                    </Link>
                    {/* ---------------------- */}

                    <div className="ml-3">
                         {/* --- TÊN CÓ LINK --- */}
                        <Link href={`/dashboard/user/${post.author?.id}`} className="hover:underline">
                            <p className="text-sm font-bold text-gray-900">
                                {post.author?.displayName || post.author?.email}
                            </p>
                        </Link>
                         {/* ------------------- */}
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

                    {/* Nút Like Bài Viết (Cập nhật mới) */}
                    <form action={togglePostLike}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button
                            type="submit"
                            className={`flex items-center gap-1 text-sm font-medium transition ${isPostLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isPostLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            {post.likes.length > 0 && <span>{post.likes.length} Thích</span>}
                        </button>
                    </form>
                </div>

                {/* Khu vực Bình luận */}
                <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4">Bình luận ({post.comments.length})</h3>

                    {/* Render danh sách bình luận bằng Component thông minh */}
                    <div className="space-y-4 mb-6">
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

                    {/* Form Comment Gốc */}
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