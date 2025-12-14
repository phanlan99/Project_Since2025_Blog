'use client'

import { useState } from 'react';
import Link from 'next/link'; // <--- Import Link
import { addCommentAction } from './comment-action';
import { toggleCommentLike } from './like-actions';

// Cập nhật Type: Thêm id vào author để dùng cho Link
type CommentType = {
  id: number;
  content: string;
  createdAt: Date | null;
  author: { 
    id: number; // <--- Thêm ID vào type (đảm bảo query DB đã lấy field này)
    email: string; 
    avatarUrl: string | null; 
    displayName: string | null;
  } | null;
  likes: { userId: number }[];
  parentId: number | null;
};

export default function CommentItem({ 
  comment, 
  allComments, 
  currentUserId, 
  postId 
}: { 
  comment: CommentType, 
  allComments: CommentType[], 
  currentUserId: number,
  postId: number 
}) {
  const [isReplying, setIsReplying] = useState(false);

  const childComments = allComments.filter(c => c.parentId === comment.id);
  const isLiked = comment.likes.some(l => l.userId === currentUserId);

  // Helper để lấy tên hiển thị (ưu tiên displayName, nếu không có thì lấy email)
  const authorName = comment.author?.displayName || comment.author?.email;

  return (
    <div className="flex gap-3 group">
      
      {/* --- PHẦN AVATAR (CÓ LINK) --- */}
      <Link href={`/dashboard/user/${comment.author?.id}`} className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden border border-gray-100 cursor-pointer hover:opacity-80 transition">
          {comment.author?.avatarUrl ? (
            // Nếu có link ảnh -> Hiển thị ảnh
            <img 
              src={comment.author.avatarUrl} 
              alt="Avt" 
              className="w-full h-full object-cover" 
            />
          ) : (
            // Nếu không có -> Hiển thị chữ cái đầu
            authorName?.[0].toUpperCase()
          )}
        </div>
      </Link>
      {/* ----------------------------- */}

      <div className="flex-1">
        <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 inline-block pr-8 relative">
          
          {/* --- TÊN NGƯỜI COMMENT (CÓ LINK) --- */}
          <Link href={`/dashboard/user/${comment.author?.id}`} className="hover:underline">
            <span className="text-xs font-bold text-gray-900 block">
              {authorName}
            </span>
          </Link>
          {/* ----------------------------------- */}
          
          <span className="text-sm text-gray-700">{comment.content}</span>

          <div className="absolute -bottom-3 right-0 bg-white shadow border border-gray-100 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 text-xs">
             <button onClick={async () => {
                const formData = new FormData();
                formData.append('commentId', comment.id.toString());
                formData.append('postId', postId.toString());
                await toggleCommentLike(formData);
             }} className={isLiked ? 'text-red-500' : 'text-gray-400'}>
               <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
               </svg>
             </button>
             {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
          </div>
        </div>
        
        <div className="flex gap-4 mt-1 ml-2 text-xs text-gray-500 font-semibold">
           <span>{comment.createdAt?.toLocaleTimeString('vi-VN')}</span>
           <button onClick={() => setIsReplying(!isReplying)} className="hover:text-indigo-600 cursor-pointer">
             Trả lời
           </button>
        </div>

        {isReplying && (
          <form 
            action={async (formData) => {
               await addCommentAction(formData);
               setIsReplying(false);
            }} 
            className="flex gap-2 mt-2"
          >
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="parentId" value={comment.id} />
            
            {/* Avatar nhỏ của mình trong ô input (Optional) */}
            <div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] overflow-hidden">
                You
            </div>

            <input 
              name="content" 
              required 
              autoFocus
              autoComplete="off"
              // Cập nhật Placeholder theo tên
              placeholder={`Trả lời ${authorName}...`} 
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Gửi</button>
          </form>
        )}

        {childComments.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
            {childComments.map(child => (
              <CommentItem 
                key={child.id} 
                comment={child} 
                allComments={allComments} 
                currentUserId={currentUserId}
                postId={postId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}