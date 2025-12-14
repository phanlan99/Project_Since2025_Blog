'use client'

import { useState } from 'react';
import { togglePostLike } from './like-actions';
import Link from 'next/link';

type UserType = {
  id: number;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

type LikeType = {
  userId: number;
  user: UserType; // User đã like
};

export default function PostLikeControl({ 
  postId, 
  likes, 
  currentUserId 
}: { 
  postId: number; 
  likes: LikeType[]; 
  currentUserId: number; 
}) {
  const [showModal, setShowModal] = useState(false);
  const isLiked = likes.some(l => l.userId === currentUserId);

  // Logic hiển thị text "A và B người khác"
  const getLikeText = () => {
    if (likes.length === 0) return null;
    
    // Lấy người like mới nhất (hoặc người đầu tiên trong list)
    const firstUser = likes[0].user;
    const name = firstUser.displayName || firstUser.email;

    if (likes.length === 1) {
      return <span><b>{name}</b> đã thích</span>;
    } else {
      return <span><b>{name}</b> và {likes.length - 1} người khác</span>;
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Nút Like Trái Tim */}
      <form action={togglePostLike}>
        <input type="hidden" name="postId" value={postId} />
        <button 
          type="submit" 
          className={`flex items-center gap-1 text-sm font-medium transition ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </form>

      {/* Dòng chữ hiển thị người like (Click để mở Modal) */}
      {likes.length > 0 && (
        <button 
          onClick={() => setShowModal(true)}
          className="text-sm text-gray-600 hover:underline cursor-pointer text-left"
        >
          {getLikeText()}
        </button>
      )}

      {/* --- MODAL DANH SÁCH NGƯỜI LIKE --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Lượt thích ({likes.length})</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="max-h-80 overflow-y-auto p-2">
              {likes.map((like) => (
                <Link 
                  key={like.userId} 
                  href={`/dashboard/user/${like.userId}`}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {like.user.avatarUrl ? (
                      <img src={like.user.avatarUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                        {(like.user.displayName || like.user.email)[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{like.user.displayName || like.user.email}</p>
                    {like.user.displayName && <p className="text-xs text-gray-500">{like.user.email}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}