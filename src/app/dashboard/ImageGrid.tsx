'use client' // <--- 1. QUAN TRỌNG: Chuyển thành Client Component

import { useState } from 'react';
import ImageViewerModal from './ImageViewerModal'; // <--- 2. Import modal vừa tạo

export default function ImageGrid({ images }: { images: { url: string }[] }) {
  // State để lưu index của ảnh đang được chọn để xem (null là không xem ảnh nào)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const count = images.length;

  // Hàm helper để mở modal tại index cụ thể
  const openViewer = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Hàm helper để đóng modal
  const closeViewer = () => {
    setSelectedImageIndex(null);
  };

  // --- CSS class chung cho các ảnh để có hiệu ứng click ---
  const imgClickableClass = "w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity";

  // --- Phần render lưới ảnh (đã thêm onClick) ---
  let gridContent;

  if (count === 1) {
    gridContent = (
      <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
        <img 
            src={images[0].url} 
            alt="Post" 
            className={`${imgClickableClass} max-h-[500px]`} 
            onClick={() => openViewer(0)} // <--- Thêm sự kiện click
        />
      </div>
    );
  } else if (count === 2) {
    gridContent = (
      <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden border border-gray-100 h-[300px]">
        {images.map((img, idx) => (
          <img 
            key={idx} 
            src={img.url} 
            className={imgClickableClass}
            onClick={() => openViewer(idx)} // <--- Thêm sự kiện click với index
          />
        ))}
      </div>
    );
  } else if (count === 3) {
    gridContent = (
      <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden border border-gray-100 h-[300px]">
         <img src={images[0].url} className={imgClickableClass} onClick={() => openViewer(0)} />
         <div className="flex flex-col gap-1 h-full">
            <img src={images[1].url} className={`${imgClickableClass} h-1/2`} onClick={() => openViewer(1)} />
            <img src={images[2].url} className={`${imgClickableClass} h-1/2`} onClick={() => openViewer(2)} />
         </div>
      </div>
    );
  } else {
    // Trường hợp 4 ảnh trở lên
    gridContent = (
      <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden border border-gray-100 h-[300px]">
         <img src={images[0].url} className={imgClickableClass} onClick={() => openViewer(0)} />
         <img src={images[1].url} className={imgClickableClass} onClick={() => openViewer(1)} />
         <img src={images[2].url} className={imgClickableClass} onClick={() => openViewer(2)} />
         
         <div className="relative w-full h-full cursor-pointer group" onClick={() => openViewer(3)}>
            <img src={images[3].url} className={imgClickableClass} />
            {count > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl group-hover:bg-black/40 transition">
                 +{count - 4}
              </div>
            )}
         </div>
      </div>
    );
  }

  return (
    <>
      {/* Hiển thị lưới ảnh */}
      {gridContent}

      {/* Hiển thị Modal (chỉ khi có selectedImageIndex khác null) */}
      {selectedImageIndex !== null && (
        <ImageViewerModal 
            images={images}
            initialIndex={selectedImageIndex}
            onClose={closeViewer}
        />
      )}
    </>
  );
}