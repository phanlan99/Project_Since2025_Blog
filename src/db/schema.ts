
import { relations } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/pg-core'; // Nhớ thêm import boolean
import { pgTable, serial, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';



// --- BẢNG USERS ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Quan hệ: 1 User có nhiều Post và nhiều Comment
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

// --- BẢNG POSTS ---
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});


// --- BẢNG COMMENTS (MỚI) ---
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id).notNull(), // Ai bình luận?
  postId: integer('post_id').references(() => posts.id).notNull(), // Bình luận bài nào?
  createdAt: timestamp('created_at').defaultNow(),
});



export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),        // Tên sản phẩm
  description: text('description'),    // Mô tả ngắn
  price: integer('price').notNull(),   // Giá tiền (VNĐ)
  category: text('category'),          // Phân loại: 'ao', 'quan', 'non'
  imageUrl: text('image_url'),         // Link ảnh sản phẩm
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(), // Người nhận thông báo
  message: text('message').notNull(), // Nội dung: "A đã bình luận..."
  link: text('link'), // Link để bấm vào (ví dụ về trang dashboard)
  isRead: boolean('is_read').default(false), // Đã đọc hay chưa
  createdAt: timestamp('created_at').defaultNow(),
});

// Quan hệ: 1 User có nhiều Notification
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// --- 1. BẢNG LIKE BÀI VIẾT ---
export const postLikes = pgTable('post_likes', {
  userId: integer('user_id').references(() => users.id).notNull(),
  postId: integer('post_id').references(() => posts.id).notNull(),
}, (t) => ({
  // Khóa chính phức hợp: Đảm bảo 1 user chỉ like 1 bài viết được 1 lần
  pk: primaryKey({ columns: [t.userId, t.postId] }),
}));

// Quan hệ cho Post Likes
export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, { fields: [postLikes.userId], references: [users.id] }),
  post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
}));

// --- 2. BẢNG LIKE BÌNH LUẬN ---
export const commentLikes = pgTable('comment_likes', {
  userId: integer('user_id').references(() => users.id).notNull(),
  commentId: integer('comment_id').references(() => comments.id).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.commentId] }),
}));

// Quan hệ cho Comment Likes
export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  user: one(users, { fields: [commentLikes.userId], references: [users.id] }),
  comment: one(comments, { fields: [commentLikes.commentId], references: [comments.id] }),
}));

// --- 3. CẬP NHẬT QUAN HỆ CỦA BẢNG POSTS VÀ COMMENTS CŨ ---
// (Bạn tìm đến đoạn postsRelations và commentsRelations cũ để THÊM dòng likes)

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
  likes: many(postLikes), // <--- THÊM DÒNG NÀY
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, { fields: [comments.userId], references: [users.id] }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  likes: many(commentLikes), // <--- THÊM DÒNG NÀY
}));
