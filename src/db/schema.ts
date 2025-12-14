import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core'; // Nhớ thêm import integer
import { relations } from 'drizzle-orm';


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

// Quan hệ: 1 Post thuộc về 1 User và có nhiều Comment
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

// --- BẢNG COMMENTS (MỚI) ---
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id).notNull(), // Ai bình luận?
  postId: integer('post_id').references(() => posts.id).notNull(), // Bình luận bài nào?
  createdAt: timestamp('created_at').defaultNow(),
});

// Quan hệ: 1 Comment thuộc về 1 User và 1 Post
export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),        // Tên sản phẩm
  description: text('description'),    // Mô tả ngắn
  price: integer('price').notNull(),   // Giá tiền (VNĐ)
  category: text('category'),          // Phân loại: 'ao', 'quan', 'non'
  imageUrl: text('image_url'),         // Link ảnh sản phẩm
  createdAt: timestamp('created_at').defaultNow(),
});

