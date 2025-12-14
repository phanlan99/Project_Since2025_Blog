import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core'; // Nhớ thêm import integer


export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Trong thực tế nhớ mã hóa password!
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'), // Link ảnh minh họa
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

