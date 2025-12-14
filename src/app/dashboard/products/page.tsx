import { db } from '@/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm';

// Hàm helper để format tiền tệ (Ví dụ: 150000 -> 150.000 ₫)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default async function ProductsPage() {
  // Lấy tất cả sản phẩm, cái nào mới thêm thì hiện lên đầu
  const productList = await db.select().from(products).orderBy(desc(products.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header của trang Product */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cửa Hàng Thời Trang</h1>
          <p className="mt-2 text-gray-600">Khám phá những mẫu quần áo hot nhất mùa này.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Giỏ hàng (0)
        </button>
      </div>

      {/* Grid Sản phẩm */}
      {productList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Chưa có sản phẩm nào được bày bán.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productList.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Phần ảnh sản phẩm */}
              <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
                {/* Badge Category */}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  {product.category || 'Sản phẩm'}
                </div>
              </div>

              {/* Phần thông tin */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[40px]">
                  {product.description || 'Chất liệu thoáng mát, thiết kế hiện đại...'}
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-indigo-600">
                    {formatCurrency(product.price)}
                  </span>
                  
                  <button className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}