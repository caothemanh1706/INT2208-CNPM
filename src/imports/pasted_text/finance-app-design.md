🌐 THÔNG TIN CHUNG DỰ ÁN

Design style: Clean & Modern Financial App. Bảng màu chủ đạo: xanh lá mint (#00C896) cho tăng trưởng/thu nhập, đỏ san hô (#FF5C5C) cho chi tiêu, nền trắng ngà (#F8F9FB) cho Light Mode và nền xanh đen (#0F1923) cho Dark Mode. Font chữ: Display — "Plus Jakarta Sans", Body — "DM Sans". Bo góc card: 16px. Shadow: soft drop shadow. Style tổng thể: thẻ nổi (floating cards), sidebar cố định, bố cục lưới 12 cột.


SCREEN 1 — LANDING PAGE
Prompt:
Design a modern SaaS landing page for a personal finance management web app called "FinWise". 

Layout (top to bottom):
- Top navigation bar: logo on left, menu links (Tính năng, Bảng giá, Đăng nhập) centered, CTA button "Bắt đầu miễn phí" on right. Height 64px, white background, bottom border 1px.
- Hero section: Two-column layout (60/40 split). Left column: large headline text "Làm chủ tài chính cá nhân — dễ hơn bao giờ hết", subtitle paragraph 16px, two CTA buttons side by side ("Bắt đầu ngay" filled green, "Xem demo" outlined). Right column: floating mockup screenshot of the dashboard UI with soft shadow and slight rotation (-3deg). Background: gradient from #F0FDF8 to white.
- Feature highlights section: 3-column icon card grid. Each card has a colored icon (32px), title, and 2-line description. Cards: (1) Ghi chép nhanh, (2) Thống kê trực quan, (3) Quản lý nhiều ví.
- CTA banner at bottom: full-width green (#00C896) background, centered white text "Bắt đầu quản lý chi tiêu hôm nay", one white button "Tạo tài khoản miễn phí".
- Footer: 3 columns (Logo + tagline / Links / Social icons), border top, small copyright text.

Color: White background, accent green #00C896, text #1A2332.

SCREEN 2 — ĐĂNG NHẬP / ĐĂNG KÝ
Prompt:
Design a clean authentication screen for a finance app "FinWise".

Layout: Two-column split, 50/50.
- Left panel: Dark background (#0F1923), centered vertically. Large logo at top, then a visual illustration (abstract chart/graph in green tones), tagline text "Kiểm soát chi tiêu. Tự do tài chính." in white, and 3 small feature bullet points with checkmark icons in green.
- Right panel: White background, vertically centered form. Title "Chào mừng trở lại" (bold, 28px). Subtitle "Đăng nhập để tiếp tục". Two social login buttons stacked: "Tiếp tục với Google" and "Tiếp tục với Facebook" (outline style, full width, 48px height, with brand icons). Divider line with "hoặc" text centered. Email input field (label + placeholder). Password input field (label + show/hide icon). Forgot password link right-aligned. Primary CTA button full-width "Đăng nhập" green filled. Bottom text: "Chưa có tài khoản? Đăng ký ngay" with link.

Style: Rounded inputs (8px radius), 16px padding, soft focus ring green on active state.

SCREEN 3 — DASHBOARD (TỔNG QUAN)
Prompt:
Design a dashboard page for a personal finance web app. Use a fixed left sidebar + main content area layout.

Left Sidebar (240px wide, dark #1A2332):
- App logo + name at top (40px padding).
- Navigation menu items with icons (24px): Dashboard (active, green highlight), Thống kê, Lịch sử, Mục tiêu, Cài đặt.
- At bottom: user avatar + name + logout icon.

Top Bar (main area, 64px height, white, shadow):
- Left: Page title "Tổng quan".
- Right: Wallet filter dropdown ("Tất cả tài sản"), dark mode toggle icon, notification bell icon (with red badge dot), user avatar.

Main Content (light gray #F8F9FB background, 32px padding):
Row 1 — 4 Summary Cards (equal width, white, 16px radius, soft shadow):
  - Card 1: "Tổng số dư" — large number in bold (#1A2332), subtitle "Cập nhật hôm nay", wallet icon green.
  - Card 2: "Thu vào tháng này" — number in green #00C896, upward arrow icon.
  - Card 3: "Chi ra tháng này" — number in red #FF5C5C, downward arrow icon.
  - Card 4: "Tiết kiệm" — progress bar inside card (green fill), percentage text, label "Mục tiêu tổng thể".

Row 2 — Two columns (60/40 split):
  - Left (60%): "Biểu đồ Thu/Chi 6 tháng" — double bar chart (green bars for income, red for expense), month labels on X-axis, amount on Y-axis. Inside white card.
  - Right (40%): "Ghi chú nhanh" sticky note panel — yellow-tinted background card, title "Ghi chú", list of 2-3 note items with pin icon, "+ Thêm ghi chú" text button at bottom.

Row 3 — Full-width card: "Chi tiêu gần đây". Table-style list of 5 transactions. Each row: category icon (colored circle), category name, note text (gray), date, wallet badge (small pill tag), and amount (green/red with +/- sign). Column headers: Danh mục / Ghi chú / Nguồn ví / Ngày / Số tiền. "Xem tất cả" link at top right.

Floating Action Button: Bottom-right corner, green circle 56px, white "+" icon, subtle shadow + hover scale effect.

SCREEN 4 — THÊM GIAO DỊCH (MODAL/DRAWER)
Prompt:
Design a transaction entry modal/side drawer for a finance app.

Trigger: Appears as a right-side drawer (480px wide) sliding in from right, with a dark overlay on the left.

Drawer Header: Title "Thêm giao dịch mới", X close button on right.

Tab Row (below header): 3 tabs — "Chi tiền" (active, red underline), "Thu tiền" (green), "Chuyển khoản" (blue). Equal width, 48px height.

Form Content (scrollable, 24px padding):
- Amount field (prominent, center-aligned): Large number display "0 ₫" in 36px bold, mini calculator row below with buttons (+, -, ×, ÷, =), currency selector dropdown (VND/USD) on the right.
- Category selector: Grid of category icon buttons (4 columns), each is a square 72px with icon + label below. Categories: Ăn uống 🍜, Đi lại 🚗, Mua sắm 🛍️, Nhà cửa 🏠, Sức khỏe 💊, Giải trí 🎬, Giáo dục 📚, Khác ➕. Selected state: green border + light green bg.
- Wallet source: Row label "Nguồn tiền" + dropdown with wallet icons.
- Date/Time: Row label "Thời gian" + date picker input + time input side by side.
- Note & Attachment: Text area (2 rows, placeholder "Thêm ghi chú...") + image upload button with camera icon.
- Recurring toggle: Row with label "Lặp lại tự động", switch toggle, and conditional dropdown (Hàng ngày / Tuần / Tháng) appearing when toggled on.

Footer: Fixed at bottom of drawer — "Hủy" outline button + "Lưu giao dịch" green filled button, full width split 50/50.

SCREEN 5 — THỐNG KÊ & PHÂN TÍCH
Prompt:
Design an analytics/statistics page for a personal finance app with a fixed left sidebar (same as dashboard).

Page Title: "Thống kê & Phân tích"

Filter Bar (below top bar): Horizontal row of filters — Time range selector (buttons: Tháng / Quý / Năm), Year/month picker, Wallet filter dropdown. All left-aligned with 12px gap.

Main Grid Layout (2 columns, 60/40):

Left Column (60%):
- "Thu vào vs Chi ra — 12 tháng qua": Full-width double bar chart card. Two colored bars per month (green = thu, red = chi). X-axis: month labels. Y-axis: amount. Legend top-right. Card: white, 16px radius.
- Below: "Tăng trưởng tiết kiệm": Line chart with area fill (green gradient), showing savings growth per month. Card same style.

Right Column (40%):
- "Cơ cấu chi tiêu": Donut chart card. Center shows total spend amount. Legend below: each category with color dot, name, amount, and percentage.
- Below: "Cảnh báo hạn mức": Card titled "Ngân sách tháng này". List of 4-5 budget category rows. Each row: category icon + name, progress bar (green → orange → red based on usage %), "X / Y ₫" spend text, and "Vượt hạn mức" red pill badge on over-budget items.

SCREEN 6 — LỊCH SỬ GIAO DỊCH
Prompt:
Design a transaction history page for a finance app with fixed left sidebar.

Page Title: "Lịch sử Giao dịch"

Top Controls Row:
- Search bar (left, 320px wide, placeholder "Tìm kiếm theo ghi chú...") with search icon.
- Filter chips (right): "Tất cả" (active), "Chi tiền", "Thu tiền", date range picker button.

Content: Timeline layout, grouped by date.

Date Group Header: Date label "Thứ Hai, 02/06/2025" in small caps gray, total daily balance on right ("+500,000 ₫" green or "-200,000 ₫" red).

Transaction Row (inside each group, white card):
Each row contains (left to right):
  - Colored circle icon (40px) with category emoji/icon.
  - Category name (bold, 14px) + note text below (gray, 12px).
  - Wallet badge: small pill tag (e.g., "Ví tiền mặt", "TPBank").
  - Amount: right-aligned, green "+500,000 ₫" or red "-120,000 ₫", bold.
  - 3-dot options menu on far right (edit/delete).

Show 3–4 date groups with 2–3 transactions each to demonstrate the grouping pattern. Smooth dividers between groups.

SCREEN 7 — MỤC TIÊU TIẾT KIỆM
Prompt:
Design a savings goals page for a finance app with fixed left sidebar.

Page Title: "Mục tiêu Tiết kiệm"
Top Right: "+ Tạo mục tiêu mới" green button.

Goal Cards Grid: 3 columns, each card is white, 16px radius, soft shadow, 280px wide.

Each Goal Card contains:
- Top: Goal category icon (large, 48px, colored circle) + 3-dot menu top-right.
- Goal name (bold, 18px): e.g., "Mua xe máy", "Du lịch Nhật Bản", "Quỹ khẩn cấp".
- Target amount: "Mục tiêu: 50,000,000 ₫" (gray label + bold amount).
- Saved amount: "Đã tiết kiệm: 32,000,000 ₫" in green.
- Progress bar: Full width, green fill, rounded ends, percentage label above right.
- Deadline: Calendar icon + date text "Hạn: 31/12/2025".
- Monthly advice: Small hint box with light blue bg — "💡 Cần nạp thêm ~3,000,000 ₫/tháng để đạt mục tiêu".
- Bottom: Two small buttons — "Nạp tiền" (green filled) and "Chi tiết" (outline).

Show 3 cards in a row: one ~65% complete (green), one ~90% (orange warning), one ~30% (early stage).

SCREEN 8 — CÀI ĐẶT
Prompt:
Design a settings page for a finance app with fixed left sidebar.

Page Title: "Cài đặt"

Layout: Two-column (240px left menu + main content area).

Left Settings Menu (white card, full height):
Grouped menu items with section labels:
- Tài khoản: Hồ sơ cá nhân, Đổi mật khẩu, Bảo mật 2 lớp.
- Tài chính: Quản lý ví, Cài đặt hạn mức, Giao dịch lặp lại.
- Hệ thống: Tiền tệ & Ngôn ngữ, Thông báo.
- Dữ liệu: Xuất dữ liệu, Xóa tài khoản.
Active item highlighted with green left border.

Main Content Area (white card, active section shown = "Quản lý Ví"):
- Section title "Quản lý Ví / Nguồn tiền", subtitle gray.
- Wallet list: each row — wallet icon (colored) + name + balance + "Mặc định" green badge (only on one) + Edit pencil icon + Delete trash icon.
- Wallets shown: Ví tiền mặt, Tài khoản TPBank, Thẻ Visa Techcombank.
- Bottom: "+ Thêm ví mới" dashed outline card (dotted border, centered "+" icon + text).

Style: Clean, form-based, generous whitespace, consistent with overall app design.