import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { createPostAction } from './actions';

export default async function MyPostsPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    // Lấy danh sách bài viết CHỈ CỦA USER ĐÓ
    const myPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, Number(userId))) // Lọc theo userId
        .orderBy(desc(posts.createdAt));

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CỘT TRÁI: Form Tạo Bài Mới */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow sticky top-6">
                    <h2 className="text-xl font-bold mb-4 text-indigo-600">✍️ Viết bài mới</h2>
                    <form
                        action={async (formData) => {
                            "use server"
                            await createPostAction(formData)
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                            <input name="title" required className="w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500" placeholder="Hôm nay bạn thế nào?" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link ảnh (tùy chọn)</label>
                            <input name="imageUrl" className="w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                            <textarea name="content" required rows={4} className="w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500" placeholder="Chia sẻ câu chuyện của bạn..." />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                            Đăng bài ngay
                        </button>
                    </form>
                </div>
            </div>

            {/* CỘT PHẢI: Danh sách bài đã đăng */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4 text-gray-800">🗂️ Bài viết của tôi ({myPosts.length})</h2>

                <div className="space-y-4">
                    {myPosts.length === 0 ? (
                        <p className="text-gray-500 bg-white p-4 rounded shadow">Bạn chưa có bài viết nào. Hãy viết bài đầu tiên nhé!</p>
                    ) : (
                        myPosts.map((post) => (
                            <div key={post.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
                                {/* Ảnh thumbnail nhỏ */}
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                    {post.imageUrl ? (
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                                    )}
                                </div>

                                {/* Nội dung tóm tắt */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">{post.content}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Đăng lúc: {post.createdAt?.toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}