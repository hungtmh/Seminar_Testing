# Báo cáo làm việc hằng tuần - Nhóm 08, Tuần 06-02

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Mã nhóm | Nhóm 08 |
| Tên nhóm | Nhóm 8 |
| Tên project | T10 - Mutation Testing & Test Effectiveness |
| Môn học | CS423 / CSC15003 - Kiểm thử phần mềm |
| Loại báo cáo | Báo cáo bổ sung tuần 06 |
| Khoảng thời gian | 2026-07-14 - 2026-07-18 |
| Tuần thuyết trình dự kiến | Tuần 10 |

## 2. Mục tiêu trong tuần

Trong tuần này nhóm điều chỉnh lại hướng làm seminar để kết quả chính không còn dựa trên module demo. Nhóm chuyển sang kiểm thử trực tiếp code thật của project EShop bằng Jest/Supertest và Stryker Mutator.

Các mục tiêu chính:

- Tách logic nghiệp vụ thật từ `server.js` sang các service trong backend.
- Viết test API thật bằng Jest và Supertest.
- Chạy Stryker để tạo mutant thật từ code EShop.
- Lưu mutation report baseline và improved cho từng phần.
- Ghi lại bằng chứng để chuẩn bị final report, slides và demo video.

## 3. Công việc đã hoàn thành trong tuần

### 23127195 - Trần Mạnh Hùng

Phạm vi phụ trách:

```text
Authentication + User Profile
```

Công việc đã làm:

- Đọc lại backend EShop và xác định các API Auth/User đang nằm trong `server.js`.
- Tách logic Auth/User thật từ `server.js` sang:

```text
eshop-sut/backend/services/authService.js
```

- Giữ route API thật trong `server.js`, ví dụ:

```javascript
app.post("/api/register", registerUser(db));
app.post("/api/login", loginUser(db));
app.get("/api/users/me", authenticateToken, getCurrentUser(db));
```

- Viết test API thật bằng Jest/Supertest tại:

```text
eshop-sut/backend/__tests__/auth.api.test.js
```

- Chạy full flow mutation testing cho Auth/User:

```text
Viết baseline test yếu -> chạy Jest -> chạy Stryker baseline
-> đọc surviving mutants -> thêm assertion/test
-> chạy Jest improved -> chạy Stryker improved
```

- Lưu mutation report:

```text
eshop-sut/backend/reports/mutation-auth-baseline/mutation.html
eshop-sut/backend/reports/mutation-auth-improved/mutation.html
```

Kết quả chính:

| Lần chạy | Số test Jest | Mutation score | Killed | Timeout | Survived | NoCoverage | Errors |
|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline | 4 | 31.30% | 32 | 4 | 11 | 68 | 10 |
| Improved | 9 | 59.83% | 47 | 23 | 0 | 47 | 8 |

Bằng chứng:

- `docs/evidence/Hung_Auth_User_Testing_Evidence.md`
- `docs/evidence/Hung_Auth_User_Testing_Evidence.pdf`
- `eshop-sut/backend/__tests__/auth.api.test.js`
- `eshop-sut/backend/services/authService.js`
- `eshop-sut/backend/stryker.auth.config.mjs`
- `eshop-sut/backend/reports/mutation-auth-baseline/mutation.html`
- `eshop-sut/backend/reports/mutation-auth-improved/mutation.html`

### 23127060 - Ninh Văn Khải

Phạm vi phụ trách:

```text
Cart + Coupon + Checkout/Order
```

Công việc đã làm:

- Đọc các API Cart/Order/Coupon trong `server.js`.
- Tách logic thật sang:

```text
eshop-sut/backend/services/orderService.js
```

- Viết test API thật bằng Jest/Supertest cho các luồng:
  - xem giỏ hàng;
  - thêm sản phẩm vào giỏ hàng;
  - checkout tạo order;
  - xem order của user;
  - hủy order;
  - áp dụng coupon;
  - lưu coupon usage.
- Tạo cấu hình Stryker riêng cho phần Order/Cart/Coupon:

```text
eshop-sut/backend/stryker.order.config.mjs
```

- Chạy mutation testing baseline và improved cho `orderService.js`.
- Phân tích surviving mutants và thêm test/assertion để cải thiện mutation score.
- Ghi lại quá trình làm việc với AI trong file trace.

Kết quả chính:

| Lần chạy | Số test Jest | Mutation score | Killed | Timeout | Survived | NoCoverage | Errors |
|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline | 5 | 16.67% | 14 | 1 | 6 | 69 | 94 |
| Improved | 21 | 84.21% | 38 | 10 | 1 | 8 | 127 |

Bằng chứng:

- `docs/evidence/report_nvk.md`
- `docs/evidence/ai_trace_nvk.md`
- `eshop-sut/backend/services/orderService.js`
- `eshop-sut/backend/__tests__/order.api.test.js`
- `eshop-sut/backend/stryker.order.config.mjs`
- `eshop-sut/backend/reports/mutation-order-baseline/mutation.html`
- `eshop-sut/backend/reports/mutation-order-improved/mutation.html`

### 23127259 - Nguyễn Tấn Thắng

Phạm vi phụ trách:

```text
Products + Admin APIs + Import/Order Status + tài liệu nộp
```

Công việc đã làm:

- Đọc các API Product/Admin trong `server.js`, bao gồm:
  - `GET /api/products`;
  - `GET /api/products/:id`;
  - thêm/sửa/xóa product;
  - import products;
  - admin order list;
  - cập nhật trạng thái order.
- Chuẩn bị service riêng cho phần Product/Admin:

```text
eshop-sut/backend/services/productService.js
```

- Phối hợp với nhóm để thống nhất cấu trúc tài liệu trong thư mục `docs`.
- Kiểm tra lại yêu cầu nộp project:
  - Markdown + PDF;
  - có YouTube unlisted link trong report/slides;
  - mỗi section phải ghi MSSV và họ tên người phụ trách;
  - final ZIP phải dưới 20 MB;
  - không nộp link cloud thay cho file.
- Rà soát các file weekly report và evidence để chuẩn bị chuyển sang final report/slides.
- Theo dõi các lỗi khi chạy Git/PDF/SQLite trên Windows để tránh đưa file runtime vào commit.

Bằng chứng:

- `eshop-sut/backend/services/productService.js`
- `docs/planning/Project_Submission_Workplan.md`
- `docs/report/T10_Mutation_Testing_and_Test_Effectiveness.pdf`
- Cấu trúc thư mục `docs/weekly_reports`

## 4. AI Usage Notes

Nhóm có sử dụng AI để hỗ trợ đọc code, tổ chức công việc, gợi ý cấu trúc test, giải thích mutation report và tạo bản nháp tài liệu. Nhóm không dùng AI để thay thế việc chạy Jest/Stryker thật. Các kết quả kỹ thuật đều dựa trên test và mutation report sinh ra từ project EShop.

### 23127195 - Trần Mạnh Hùng

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI |
| Mục đích sử dụng | Hỗ trợ tách Auth/User service, viết Jest/Supertest test, đọc Stryker report, cải thiện surviving mutants và viết evidence |
| Nội dung AI hỗ trợ tạo | `authService.js`, `auth.api.test.js`, hướng dẫn chạy baseline/improved, file evidence và PDF |
| Phần tự làm / kiểm chứng | Chạy `npm test`, `npm run mutation:auth`, mở report HTML và kiểm tra số liệu baseline/improved |
| Bằng chứng | `Hung_Auth_User_Testing_Evidence.md`, report baseline/improved, lịch sử chat trong Codex |

### 23127060 - Ninh Văn Khải

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI |
| Mục đích sử dụng | Hỗ trợ phân tích Cart/Order/Coupon, đọc surviving mutants, gợi ý test/assertion cải thiện |
| Nội dung AI hỗ trợ tạo | Gợi ý refactor `orderService.js`, test cases, mutation baseline/improved và AI trace |
| Phần tự làm / kiểm chứng | Chạy test/mutation thật, đối chiếu report HTML, ghi lại kết quả vào `report_nvk.md` |
| Bằng chứng | `report_nvk.md`, `ai_trace_nvk.md`, report mutation order baseline/improved |

### 23127259 - Nguyễn Tấn Thắng

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI |
| Mục đích sử dụng | Hỗ trợ tổ chức tài liệu, tạo checklist nộp bài, chuẩn bị weekly report và cấu trúc final deliverables |
| Nội dung AI hỗ trợ tạo | Bản nháp weekly report, cấu trúc thư mục docs, hướng dẫn đóng gói Markdown/PDF |
| Phần tự làm / kiểm chứng | Kiểm tra format, tên file, nội dung PDF và yêu cầu nộp của giảng viên |
| Bằng chứng | `docs/weekly_reports`, `docs/planning`, các file PDF trong `docs/report` |

## 5. Công việc dự kiến cho tuần sau

### 23127195 - Trần Mạnh Hùng

- Chọn các mutant Auth/User tiêu biểu để đưa vào final report và slides.
- Chuẩn bị phần demo Auth/User: baseline report, improved report và giải thích `Killed`, `Survived`, `NoCoverage`.
- Rà soát lại `authService.js` và `auth.api.test.js` để đảm bảo code chạy được trên máy thành viên khác.

### 23127060 - Ninh Văn Khải

- Hoàn thiện phần phân tích Cart/Order/Coupon trong final report.
- Chọn surviving mutant còn lại để giải thích trong bài thuyết trình.
- Chuẩn hóa prompt log và AI audit evidence.

### 23127259 - Nguyễn Tấn Thắng

- Tiếp tục hoàn thiện phần Product/Admin nếu cần.
- Chuẩn bị slide Markdown/HTML và bản PDF.
- Chuẩn bị demo video YouTube unlisted.
- Đóng gói các file nộp theo đúng yêu cầu `Group08.zip`.

## 6. Vấn đề phát sinh

| Vấn đề | Trạng thái | Cách xử lý |
|---|---|---|
| Một số file PDF/SQLite bị Windows khóa khi Git pull hoặc restore | Đã ghi nhận | Đóng PDF viewer, backend server, Jest/Stryker trước khi pull hoặc restore |
| `database.sqlite` bị thay đổi sau khi chạy test | Đã ghi nhận | Không commit file runtime nếu không cần; restore sau khi đóng process giữ DB |
| Stryker chạy nhanh có thể sinh warning `SQLITE_BUSY` | Chấp nhận được | Report vẫn dùng được nếu Stryker hoàn tất và sinh HTML |
| Cần phân biệt tuần 06 và tuần 07 | Đã xử lý | Tạo báo cáo bổ sung `week06-02` chỉ gồm `Group08.md` và `Group08.pdf` |

## 7. File nộp tuần này

Chỉ nộp 2 file:

```text
docs/weekly_reports/week06-02/Group08.md
docs/weekly_reports/week06-02/Group08.pdf
```
