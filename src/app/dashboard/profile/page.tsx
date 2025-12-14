import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { updateProfileAction } from './actions';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) return <div>Vui lòng đăng nhập</div>;

  const user = await db.query.users.findFirst({
    where: eq(users.id, parseInt(userId)),
  });

  if (!user) return <div>Không tìm thấy người dùng</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-10">

      {/* --- PHẦN ẢNH BÌA (HEADER) --- */}
      <div className="h-48 bg-gray-200 relative">
        {user.coverImageUrl ? (
          <img
            src={user.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 absolute inset-0"></div>
        )}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      {/* -------------------------------------- */}


      {/* --- SỬA Ở ĐÂY: Thêm pt-24 để tạo khoảng trống --- */}
      <div className="px-8 pb-8 pt-24 relative">
      {/* ----------------------------------------------- */}

        {/* Avatar (đẩy lên trên ảnh bìa) */}
        <div className="absolute -top-16 left-8">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-4xl font-bold">
                {(user.displayName || user.email)[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Thông tin cá nhân */}
        {/* --- SỬA Ở ĐÂY: Bỏ class mt-20 đi --- */}
        <div>
        {/* ----------------------------------- */}
            <h1 className="text-3xl font-bold text-gray-900 line-clamp-1"> {/* Thêm line-clamp-1 để tên quá dài không bị vỡ layout */}
            {user.displayName || user.email}
            </h1>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
        </div>

        <hr className="border-gray-100 mb-8" />

        {/* Form cập nhật thông tin (Giữ nguyên) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">⚙️ Cập nhật thông tin</h2>
          <form
            action={async (formData) => {
              "use server"
              await updateProfileAction(formData)
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên hiển thị</label>
              <input
                name="displayName"
                defaultValue={user.displayName || ''}
                placeholder="Ví dụ: Chiến Thần Code"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar (URL)</label>
                <input
                    name="avatarUrl"
                    defaultValue={user.avatarUrl || ''}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh bìa (URL)</label>
                <input
                    name="coverImageUrl"
                    defaultValue={user.coverImageUrl || ''}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
                </div>
            </div>

            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm hover:shadow">
              Lưu thay đổi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}