'use client'

import { useEffect, useState, useCallback } from 'react';

type ImageViewerModalProps = {
  images: { url: string }[]; // Danh sách toàn bộ ảnh của bài viết
  initialIndex: number;      // Vị trí ảnh bắt đầu khi click vào
  onClose: () => void;       // Hàm để đóng modal
};

export default function ImageViewerModal({ images, initialIndex, onClose }: ImageViewerModalProps) {
  // State để theo dõi ảnh nào đang được hiển thị trong modal
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Hàm chuyển sang ảnh tiếp theo (vòng lặp lại nếu ở ảnh cuối)
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Hàm quay lại ảnh trước đó (vòng lặp về cuối nếu ở ảnh đầu)
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  // Xử lý sự kiện bàn phím (Esc để đóng, Mũi tên để chuyển ảnh)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    // Khóa cuộn trang web khi modal mở
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Dọn dẹp khi đóng modal
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev, onClose]);

  // Nếu không có ảnh hoặc index sai thì không hiện gì
  if (!images || images.length === 0 || currentIndex >= images.length) return null;

  const currentImage = images[currentIndex];

  return (
    // Lớp nền đen mờ, click vào nền thì đóng modal
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      
      {/* Nút Đóng (X) - Góc trên phải */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10 bg-black/20 rounded-full transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Nút Lùi (Chỉ hiện nếu có > 1 ảnh) */}
      {images.length > 1 && (
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-4 text-white/70 hover:text-white p-2 z-10 bg-black/20 rounded-full transition group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 group-active:scale-90 transition">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Ảnh chính */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4 md:p-10"
        onClick={(e) => e.stopPropagation()} // Click vào vùng chứa ảnh không bị đóng modal
      >
        <img 
          src={currentImage.url} 
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none shadow-2xl"
        />
        
        {/* Bộ đếm số trang */}
        {images.length > 1 && (
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
             {currentIndex + 1} / {images.length}
           </div>
        )}
      </div>

      {/* Nút Tiến (Chỉ hiện nếu có > 1 ảnh) */}
      {images.length > 1 && (
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-4 text-white/70 hover:text-white p-2 z-10 bg-black/20 rounded-full transition group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 group-active:scale-90 transition">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}