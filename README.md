# INT2208-CNPM — Personal Finance Dashboard

Ứng dụng quản lý tài chính cá nhân (thu/chi) với dashboard trực quan.

## 🚀 Cách chạy (chỉ cần 3 bước)

> **Yêu cầu:** Đã cài [Node.js](https://nodejs.org) (v18+)

### Bước 1 — Clone repo
```bash
git clone https://github.com/caothemanh1706/INT2208-CNPM.git
cd INT2208-CNPM
```

### Bước 2 — Cài đặt & khởi tạo database
```bash
npm run setup
```
> Lệnh này sẽ tự động: cài đặt toàn bộ thư viện (dependencies), sao chép tệp cấu hình và khởi tạo cơ sở dữ liệu SQLite tự động.
>
> 💡 **Trợ lý tài chính AI (Chatbox):** Đã được tích hợp sẵn khóa API Key dự phòng an toàn. Người dùng sau khi clone dự án về **không cần phải tự tạo khóa API** mà vẫn có thể trò chuyện được ngay lập tức!


### Bước 3 — Chạy ứng dụng (mở 2 terminal)

**Terminal 1 — Backend:**
```bash
npm run start:backend
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:5173**

---

## 🛠 Tech Stack
- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Express.js + TypeScript + Prisma (SQLite)
- **Auth:** JWT
