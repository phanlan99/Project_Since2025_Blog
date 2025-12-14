import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kiểm tra đăng nhập (Bảo vệ toàn bộ các trang con của dashboard)
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('isLoggedIn');

  if (!isLoggedIn) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- PHẦN MENU (NAVBAR) --- */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl text-indigo-600">MyBrand</span>
              </div>
              {/* Các Link điều hướng */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Trang chủ
                </Link>
                <Link href="/dashboard/about" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Giới thiệu
                </Link>
                <Link href="/dashboard/products" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Sản phẩm
                </Link>
              </div>
            </div>
            
            {/* Nút Đăng xuất (Logout) */}
            <div className="flex items-center">
               <form action={async () => {
                 'use server';
                 const c = await cookies();
                 c.delete('isLoggedIn');
                 redirect('/');
               }}>
                 <button type="submit" className="text-sm text-red-600 hover:text-red-800">
                   Đăng xuất
                 </button>
               </form>
            </div>
          </div>
        </div>
      </nav>

      {/* --- PHẦN NỘI DUNG CHÍNH (Thay đổi theo từng trang) --- */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}