import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) return <div>Vui lòng đăng nhập</div>;

  // 1. Lấy danh sách thông báo
  const myNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, parseInt(userId)))
    .orderBy(desc(notifications.createdAt));

  // 2. Đánh dấu tất cả là ĐÃ ĐỌC (Side effect)
  // Lưu ý: Trong thực tế nên dùng Server Action cho việc này, 
  // nhưng để đơn giản ta chạy luôn ở đây vì đây là Server Component.
  if (myNotifications.some(n => !n.isRead)) {
     await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, parseInt(userId)));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Thông báo của bạn</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {myNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Bạn chưa có thông báo nào.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {myNotifications.map((notif) => (
              <li key={notif.id} className={`p-4 hover:bg-gray-50 transition ${!notif.isRead ? 'bg-indigo-50' : ''}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <span className="text-xl">💬</span>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {notif.createdAt?.toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {notif.link && (
                       <Link href={notif.link} className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                         Xem
                       </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}