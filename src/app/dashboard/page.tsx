import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Component phải có từ khóa 'async'
export default async function Dashboard() {
  
  // --- SỬA ĐOẠN NÀY ---
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('isLoggedIn');
  // --------------------

  if (!isLoggedIn) {
    redirect('/');
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Chào mừng đến với trang chính!</h1>
      <p>Dữ liệu này được bảo vệ.</p>
    </div>
  );
}