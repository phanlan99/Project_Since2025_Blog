'use client'

import { useState } from 'react';
import { addCommentAction } from './comment-action';
import { toggleCommentLike } from './like-actions';

// Định nghĩa kiểu dữ liệu cho Comment để không bị lỗi TS
type CommentType = {
  id: number;
  content: string;
  createdAt: Date | null;
  author: { email: string } | null;
  likes: { userId: number }[];
  parentId: number | null;
};

// Component đệ quy
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
  const [isReplying, setIsReplying] = useState(false); // Trạng thái đóng/mở form trả lời

  // Tìm các bình luận con của bình luận này
  const childComments = allComments.filter(c => c.parentId === comment.id);

  // Check like
  const isLiked = comment.likes.some(l => l.userId === currentUserId);

  return (
    <div className="flex gap-3 group">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
        {comment.author?.email?.[0].toUpperCase()}
      </div>

      <div className="flex-1">
        {/* Nội dung bình luận */}
        <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 inline-block pr-8 relative">
          <span className="text-xs font-bold text-gray-900 block">{comment.author?.email}</span>
          <span className="text-sm text-gray-700">{comment.content}</span>

          {/* Nút Like (Client Action) */}
          <div className="absolute -bottom-3 right-0 bg-white shadow border border-gray-100 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 text-xs">
             <button onClick={async () => {
                const formData = new FormData();
                formData.append('commentId', comment.id.toString());
                formData.append('postId', postId.toString());
                await toggleCommentLike(formData);
             }} className={isLiked ? 'text-red-500' : 'text-gray-400'}>
               ❤️
             </button>
             {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
          </div>
        </div>
        
        {/* Các nút hành động bên dưới (Like, Reply, Ngày tháng) */}
        <div className="flex gap-4 mt-1 ml-2 text-xs text-gray-500 font-semibold">
           <span>{comment.createdAt?.toLocaleTimeString('vi-VN')}</span>
           
           {/* Nút bật tắt Form Trả lời */}
           <button 
             onClick={() => setIsReplying(!isReplying)} 
             className="hover:text-indigo-600 cursor-pointer"
           >
             Trả lời
           </button>
        </div>

        {/* Form Trả lời (Chỉ hiện khi bấm nút) */}
        {isReplying && (
          <form 
            action={async (formData) => {
               await addCommentAction(formData);
               setIsReplying(false); // Tắt form sau khi gửi
            }} 
            className="flex gap-2 mt-2"
          >
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="parentId" value={comment.id} /> {/* Gửi kèm ID cha */}
            <input 
              name="content" 
              required 
              autoFocus
              placeholder={`Trả lời ${comment.author?.email}...`} 
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Gửi</button>
          </form>
        )}

        {/* --- HIỂN THỊ CÁC BÌNH LUẬN CON (ĐỆ QUY) --- */}
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