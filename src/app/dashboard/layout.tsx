import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notifications } from '@/db/schema'; // Import bảng
import { count, eq, and } from 'drizzle-orm'; // Import hàm count, and
import { db } from '@/db';
import { users } from '@/db/schema'; // Import bảng users



export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('isLoggedIn');
    const userId = cookieStore.get('userId')?.value;

    if (!isLoggedIn) redirect('/');

    // --- LẤY THÔNG TIN USER (AVATAR / EMAIL) ---
    let currentUser = null;
    if (userId) {
        currentUser = await db.query.users.findFirst({
            where: eq(users.id, parseInt(userId)),
        });
    }
    // ------------------------------------------

    // --- LẤY SỐ THÔNG BÁO CHƯA ĐỌC ---
    let unreadCount = 0;
    if (userId) {
        const result = await db
            .select({ value: count() })
            .from(notifications)
            .where(
                and(
                    eq(notifications.userId, parseInt(userId)),
                    eq(notifications.isRead, false)
                )
            );

        unreadCount = result[0].value;
    }
    // ----------------------------------

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        {/* LOGO + MENU TRÁI */}
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/dashboard" className="cursor-pointer">
                                    <span className="font-bold text-xl text-indigo-600 hover:text-indigo-800 transition">
                                        MyBrand
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/dashboard"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Trang chủ
                                </Link>
                                <Link
                                    href="/dashboard/about"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Giới thiệu
                                </Link>
                                <Link
                                    href="/dashboard/products"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Sản phẩm
                                </Link>
                            </div>
                        </div>

                        {/* PHẦN PHẢI */}
                        <div className="flex items-center space-x-4">

                            {/* CHUÔNG THÔNG BÁO */}
                            <Link
                                href="/dashboard/notifications"
                                className="relative p-2 text-gray-400 hover:text-gray-500"
                            >
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>

                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/dashboard/my-posts"
                                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition"
                            >
                                Quản lý bài đăng
                            </Link>

                            {/* PROFILE + LOGOUT */}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 ml-2">

                                {/* AVATAR */}
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center gap-2 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 group-hover:border-indigo-500 transition">
                                        {currentUser?.avatarUrl ? (
                                            <img
                                                src={currentUser.avatarUrl}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 bg-gray-100">
                                                {currentUser?.email?.[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[100px] truncate">
                                        {/* SỬA DÒNG NÀY: Ưu tiên displayName */}
                                        {currentUser?.displayName || currentUser?.email}
                                    </span>
                                </Link>

                                {/* LOGOUT ICON */}
                                <form
                                    action={async () => {
                                        'use server';
                                        const c = await cookies();
                                        c.delete('isLoggedIn');
                                        c.delete('userId');
                                        redirect('/');
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="text-gray-400 hover:text-red-600 p-1"
                                        title="Đăng xuất"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                            />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>

            <footer className="bg-gray-900 text-gray-300 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        {/* Cột 1: Thông tin thương hiệu */}
                        <div className="col-span-1 md:col-span-1">
                            <span className="font-bold text-2xl text-white">MyBrand</span>
                            <p className="mt-4 text-sm text-gray-400">
                                Nền tảng mạng xã hội và thương mại điện tử kết hợp, mang đến trải nghiệm kết nối và mua sắm tuyệt vời nhất.
                            </p>
                        </div>

                        {/* Cột 2: Liên kết nhanh */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Khám phá</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/dashboard" className="hover:text-white transition">Trang chủ</Link></li>
                                <li><Link href="/dashboard/about" className="hover:text-white transition">Về chúng tôi</Link></li>
                                <li><Link href="/dashboard/products" className="hover:text-white transition">Sản phẩm mới</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Tin tức</Link></li>
                            </ul>
                        </div>

                        {/* Cột 3: Hỗ trợ */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Hỗ trợ</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition">Trung tâm trợ giúp</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Chính sách bảo mật</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Điều khoản sử dụng</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Liên hệ quảng cáo</Link></li>
                            </ul>
                        </div>

                        {/* Cột 4: Liên hệ */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Liên hệ</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start">
                                    <span className="mr-2">📍</span>
                                    <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">📧</span>
                                    <span>contact@mybrand.com</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">📞</span>
                                    <span>+84 909 123 456</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Dòng bản quyền dưới cùng */}
                    <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} MyBrand Inc. All rights reserved. Designed with Next.js & Neon.
                    </div>
                </div>
            </footer>
        </div>
    );
}




