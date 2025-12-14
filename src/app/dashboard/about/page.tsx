import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Phần Hero: Tiêu đề chính */}
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm mb-8 px-6">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">
          Kết Nối & Chia Sẻ Đam Mê
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Chào mừng bạn đến với <span className="font-bold text-indigo-600">MyBrand Social</span>. 
          Một không gian mở nơi bạn có thể tự do đăng bài, chia sẻ khoảnh khắc và kết nối với cộng đồng 
          giống như cách bạn làm trên Facebook, nhưng riêng tư và thú vị hơn.
        </p>
      </div>

      {/* Phần Tính năng: 3 cột */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Tính năng 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl">
            📝
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Đăng bài dễ dàng</h3>
          <p className="text-gray-600">
            Viết suy nghĩ, cập nhật trạng thái và chia sẻ câu chuyện của bạn ngay lập tức với trình soạn thảo đơn giản và tốc độ cao.
          </p>
        </div>

        {/* Tính năng 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl">
            🤝
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Kết nối cộng đồng</h3>
          <p className="text-gray-600">
            Không chỉ là nơi lưu trữ, đây là nơi mọi người cùng tương tác, xem các bài viết mới nhất và thảo luận về những chủ đề nóng hổi.
          </p>
        </div>

        {/* Tính năng 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 text-2xl">
            🚀
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Hiệu suất tối đa</h3>
          <p className="text-gray-600">
            Được xây dựng trên nền tảng Next.js và Neon Database hiện đại, trải nghiệm lướt "News Feed" của bạn sẽ mượt mà chưa từng thấy.
          </p>
        </div>
      </div>

      {/* Phần Kêu gọi hành động (CTA) */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Bạn đã sẵn sàng chia sẻ câu chuyện của mình?</h2>
        <p className="mb-6 text-indigo-100">
          Hãy quay lại trang chủ và bắt đầu bài viết đầu tiên của bạn ngay hôm nay.
        </p>
        <Link 
          href="/dashboard" 
          className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          Đến Bảng Tin Ngay
        </Link>
      </div>
    </div>
  );
}