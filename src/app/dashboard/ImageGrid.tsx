export default function ImageGrid({ images }: { images: { url: string }[] }) {
  if (!images || images.length === 0) return null;

  const count = images.length;

  // Trường hợp 1 ảnh: Hiển thị full
  if (count === 1) {
    return (
      <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
        <img src={images[0].url} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />
      </div>
    );
  }

  // Trường hợp 2 ảnh: Chia đôi
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden border border-gray-100 h-[300px]">
        {images.map((img, idx) => (
          <img key={idx} src={img.url} className="w-full h-full object-cover" />
        ))}
      </div>
    );
  }

  // Trường hợp 3 ảnh: 1 ảnh to bên trái, 2 ảnh nhỏ bên phải
  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden border border-gray-100 h-[300px]">
         <img src={images[0].url} className="w-full h-full object-cover" />
         <div className="flex flex-col gap-1 h-full">
            <img src={images[1].url} className="w-full h-1/2 object-cover" />
            <img src={images[2].url} className="w-full h-1/2 object-cover" />
         </div>
      </div>
    );
  }

  // Trường hợp 4 ảnh trở lên: Lưới 2x2, ảnh thứ 4 có lớp phủ "+ số lượng còn lại"
  return (
    <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden border border-gray-100 h-[300px]">
       <img src={images[0].url} className="w-full h-full object-cover" />
       <img src={images[1].url} className="w-full h-full object-cover" />
       <img src={images[2].url} className="w-full h-full object-cover" />
       
       <div className="relative w-full h-full">
          <img src={images[3].url} className="w-full h-full object-cover" />
          {count > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
               +{count - 4}
            </div>
          )}
       </div>
    </div>
  );
}