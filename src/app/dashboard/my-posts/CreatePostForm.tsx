'use client'

import { useState } from 'react';
import { createPostAction } from './actions';

export default function CreatePostForm() {
  // State quản lý danh sách các ô nhập link ảnh
  const [imageInputs, setImageInputs] = useState(['']); // Mặc định có 1 ô trống

  // Thêm ô nhập mới
  const addInput = () => {
    setImageInputs([...imageInputs, '']);
  };

  // Xóa ô nhập
  const removeInput = (index: number) => {
    const newInputs = [...imageInputs];
    newInputs.splice(index, 1);
    setImageInputs(newInputs);
  };

  // Cập nhật giá trị ô nhập
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = value;
    setImageInputs(newInputs);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow sticky top-6">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">✍️ Viết bài mới</h2>
      <form 
        action={async (formData) => {
          // Gửi form đi
          await createPostAction(formData);
          // Reset form sau khi gửi (thủ công)
          setImageInputs(['']);
          const form = document.querySelector('form') as HTMLFormElement;
          form.reset();
        }} 
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input name="title" required className="w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500" placeholder="Tiêu đề bài viết..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh (Nhiều ảnh)</label>
          
          {imageInputs.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input 
                name="imageUrls" // Quan trọng: Đặt cùng tên để lấy mảng bên server
                value={url}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="flex-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
                placeholder={`Link ảnh số ${index + 1}...`} 
              />
              {imageInputs.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeInput(index)}
                  className="text-red-500 hover:bg-red-50 px-2 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button 
            type="button" 
            onClick={addInput}
            className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mt-2"
          >
            + Thêm link ảnh khác
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nội dung</label>
          <textarea name="content" required rows={4} className="w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500" placeholder="Chia sẻ câu chuyện..." />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition font-bold">
          Đăng bài ngay
        </button>
      </form>
    </div>
  );
}