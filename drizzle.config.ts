import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Dòng quan trọng: Chỉ định đọc file .env.local
dotenv.config({ path: ".env.local" });

// Kiểm tra xem biến có tồn tại không (để debug)
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL không tìm thấy trong .env.local");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});