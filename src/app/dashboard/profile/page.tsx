import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { updateAvatarAction } from './actions';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) return <div>Vui lòng đăng nhập</div>;

  // Lấy thông tin user hiện tại
  const user = await db.query.users.findFirst({
    where: eq(users.id, parseInt(userId)),
  });

  if (!user) return <div>Không tìm thấy người dùng</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header màu sắc */}
      <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      
      <div className="px-8 pb-8">
        {/* Avatar hiển thị to */}
        <div className="relative -mt-16 mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-4xl font-bold">
                {user.email[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <h1 className="text-2xl font-bold text-gray-900">{user.email}</h1>
        <p className="text-gray-500 text-sm mb-6">
          Thành viên từ: {user.createdAt?.toLocaleDateString('vi-VN')}
        </p>

        <hr className="border-gray-100 mb-6" />

        {/* Form đổi Avatar */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thay đổi Avatar</h2>
          <form 
            action={async (formData) => {
              "use server"
              await updateAvatarAction(formData)
            }} 
            className="flex gap-4 items-end"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đường dẫn ảnh (URL)
              </label>
              <input 
                name="avatarUrl" 
                defaultValue={user.avatarUrl || ''}
                placeholder="https://example.com/my-photo.jpg" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                *Copy link ảnh từ Facebook, Google hoặc các trang ảnh dán vào đây.
              </p>
            </div>
            <button 
              type="submit" 
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition h-[42px]"
            >
              Lưu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}