# 🧬 Slide Thuyết Trình Seminar T10 — Mutation Testing & Test Effectiveness

> **Môn học:** CS423 / CSC15003 — Kiểm thử phần mềm (FIT@HCMUS)  
> **GVHD:** ThS. Hồ Tuấn Thanh  
> **Nhóm thực hiện:** Nhóm 08  
> **Thành viên:**  
> - 23127195 — Trần Mạnh Hùng  
> - 23127060 — Ninh Văn Khải  
> - 23127259 — Nguyễn Tấn Thắng  
> 
> 🎥 **Video Demo (YouTube Unlisted):** `<<DÁN_YOUTUBE_UNLISTED_LINK_TẠI_ĐÂY>>`

---

## Slide 1: Giới thiệu Đề tài & Thành viên Nhóm

*Người phụ trách: Cả Nhóm 08*

### Chủ đề Seminar T10: Mutation Testing & Test Effectiveness
- **Đơn vị:** Khoa Công nghệ Thông tin — Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM.
- **Ứng dụng thực nghiệm (SUT):** Backend EShop (Node.js / Express / SQLite).
- **Thành viên nhóm:**
  1. **23127195 - Trần Mạnh Hùng** *(Nhóm trưởng / DevOps)*: Infrastructure, Auth Module, Stryker Config & Fix SQLite Crash.
  2. **23127060 - Ninh Văn Khải** *(QA / AI Specialist)*: Order/Coupon Module, AI Audit Pack, Activity "Kill the Mutant".
  3. **23127259 - Nguyễn Tấn Thắng** *(Tech Writer / Tester)*: Product/Admin Module (100%), User Guide, Failure Modes & Slides.

---

## Slide 2: Đặt vấn đề — Vì sao Code Coverage "biết nói dối"?

*Người phụ trách: 23127195 - Trần Mạnh Hùng*

### Hạn chế cốt lõi của Code Coverage truyền thống
- **Code Coverage chỉ đo dòng code được chạy qua**, KHÔNG đo khả năng phát hiện lỗi logic của bài test.
- **Ví dụ minh họa:**
```javascript
function isAdult(age) {
  return age >= 18; // Code logic gốc
}
test('check adult', () => {
  expect(isAdult(20)).toBe(true); // Test đạt 100% Line Coverage!
});
```
- **Vấn đề:** Nếu lập trình viên sửa `>=` thành `>`, test trên **vẫn PASS 100%**, nhưng logic 18 tuổi đã bị lỗi!

---

## Slide 3: Nền tảng Lý thuyết Mutation Testing

*Người phụ trách: 23127195 - Trần Mạnh Hùng*

### Nguyên lý hoạt động của Mutation Testing
1. Công cụ tự động chèn lỗi cố ý (**Mutants**) vào mã nguồn gốc.
2. Chạy toàn bộ bộ test suite trên từng Mutant.
3. **Các trạng thái của Mutant:**
   - 🟢 **Killed (Đã diệt):** Ít nhất 1 test case bị FAIL $\rightarrow$ Test nhạy bén, bắt được lỗi.
   - 🔴 **Survived (Sống sót):** Tất cả test vẫn PASS $\rightarrow$ Bộ test yếu, có lỗ hổng assertion.
   - ⏱️ **Timeout:** Mutant gây lặp vô tận $\rightarrow$ Ghi nhận đã bắt được.
   - ⚪ **NoCoverage:** Không có test nào chạy qua dòng code chứa mutant.

---

## Slide 4: Khảo sát & Chọn lựa Công cụ (Tool Survey)

*Người phụ trách: 23127195 - Trần Mạnh Hùng*

### So sánh & Quyết định Chọn lựa
- **Công cụ truyền thống:** Chọn **Stryker Mutator (JS/TS)**
  - *Lý do:* Tiêu chuẩn vàng cho Node.js/Express, hỗ trợ Jest runner, xuất báo cáo HTML trực quan và chế độ `coverageAnalysis: "perTest"`.
- **Công cụ AI-Augmented:** Chọn **ChatGPT / Claude (Prompt-based LLM)**
  - *Lý do:* EShop viết bằng Node.js, không dùng được DiffBlue Cover (chỉ cho Java). Phối hợp LLM giúp phân tích code diff của mutant sống và gợi ý câu lệnh `expect()` chính xác.

---

## Slide 5: Kiến trúc SUT EShop & Cấu hình Phân vùng (Scoped Config)

*Người phụ trách: 23127259 - Nguyễn Tấn Thắng*

### Refactor SUT & Scoped Stryker Configuration
- Refactor các route từ `server.js` sang 3 service riêng biệt:
  - `services/authService.js` (Authentication & User Profile)
  - `services/orderService.js` (Cart, Order & Coupon)
  - `services/productService.js` (Product CRUD & Admin Orders)
- **Tạo cấu hình Stryker cô lập từng module (`stryker.*.config.mjs`):**
  - Tránh tình trạng Stryker nạp nhầm test module khác gây xung đột DB và chạy chậm hàng giờ.

---

## Slide 6: Kết quả Thực nghiệm — Hành trình Nâng điểm Mutation Score

*Người phụ trách: 23127259 - Nguyễn Tấn Thắng*

### Bảng tổng hợp Kết quả 3 Module trên Backend EShop (52/52 Tests PASSED)

| Module EShop | Số Test Jest | Baseline Score | Improved Score | Final Score | Killed / Valid Mutants | Trạng thái |
|---|---:|---:|---:|---:|---:|:---:|
| **Cart / Coupon / Order** | 21 | 16.67% | 84.21% | **92.57%** | 154 / 175 (8 Timeout) | 🟢 Đạt xuất sắc |
| **Authentication / User** | 19 | 31.30% | 59.83% | **87.16%** | 80 / 91 (11 Survived) | 🟢 Đạt xuất sắc |
| **Product / Admin APIs** | 18 | — (*) | — | **100.00%** | 165 / 165 (11 Timeout) | 🟢 Đạt tối đa tuyệt đối |

> (*) Product Module viết assertion đầy đủ ngay từ đầu dựa trên kinh nghiệm tích lũy từ 2 module trước.

---

## Slide 7: Phân tích Chi tiết Mutant 1 — Cart State & Assertion Fix

*Người phụ trách: 23127060 - Ninh Văn Khải*

### Mutant 1: Khởi tạo Giỏ hàng bị chèn Rác
- **Code gốc:** `if (!userCarts[userId]) userCarts[userId] = [];`
- **Stryker Mutate:** `if (!userCarts[userId]) userCarts[userId] = ["Stryker was here"];`
- **Vì sao Survived?** Test baseline chỉ kiểm tra HTTP status `200 OK`, không kiểm tra body giỏ hàng trả về.
- **Kỹ thuật Diệt Mutant:**
```javascript
// Bổ sung Assertion kiểm tra mảng rỗng chính xác:
expect(res.body).toEqual([]);
expect(res.body.length).toBe(0);
```
- **Kết quả:** Mutant bị **Killed** ngay lập tức!

---

## Slide 8: Phân tích Chi tiết Mutant 2 — Coupon Boundary & Phát hiện Bug Thật

*Người phụ trách: 23127060 - Ninh Văn Khải*

### Mutant 2: Ranh giới Số lần Sử dụng Coupon
- **Code gốc:** `if (usage_count >= coupon.max_uses_per_user) return res.status(400);`
- **Stryker Mutate:** `if (usage_count > coupon.max_uses_per_user) ...` (đổi `>=` thành `>`)
- **Kỹ thuật Diệt Mutant:** Áp dụng Boundary Value Analysis (BVA), tạo test case với `usage_count = max_uses` $\rightarrow$ assert lỗi `400`.
- **🚨 HIGHLIGHT — PHÁT HIỆN BUG THẬT TRONG ESHOP:**
  - Logic giảm giá % trong code gốc EShop bị sai: `1 - discount_value` thay vì `discount_value / 100`.
  - Nhóm giữ nguyên logic gốc và viết assertion kiểm chứng đúng hành vi hiện tại $\rightarrow$ Chứng minh Mutation Testing giúp phát hiện bug thật!

---

## Slide 9: Quy trình AI-Augmented & Các Lỗi Sai (Failure Modes) của AI

*Người phụ trách: 23127060 - Ninh Văn Khải*

### Quy trình Mutant-Guided AI Loop & 4 Failure Modes
- **Quy trình:** Stryker Run $\rightarrow$ Export Surviving Diff $\rightarrow$ Prompt LLM $\rightarrow$ Human Verify (Jest/Stryker).
- **Các lỗi sai (Failure Modes) phổ biến của AI:**
  1. **Factual Error:** Gợi ý `.toBe([])` sai cú pháp Jest (phải dùng `.toEqual([])`).
  2. **Missing Edge Cases:** Bỏ sót các trường hợp Concurrency / Race Condition.
  3. **Silent Assumptions:** Giả định ngầm DB tự reset giữa các test, không tạo `beforeEach()`.
  4. **Over-confident Statement:** Khẳng định diệt 1 mutant là code "100% bulletproof".

---

## Slide 10: Kỹ thuật Sửa lỗi Crash SQLite Database (`SQLITE_BUSY`)

*Người phụ trách: 23127195 - Trần Mạnh Hùng*

### Sự cố Kỹ thuật Chuyên sâu & Giải pháp
- **Sự cố:** Khi Stryker chạy 15 worker song song trên Windows, các worker cùng ghi vào `database.sqlite` vật lý gây lỗi crash native C++ `0xC0000005`.
- **Giải pháp xử lý trong `database.js`:**
```javascript
// Tự động phát hiện môi trường Jest worker hoặc sandbox Stryker (.stryker-tmp)
const isStryker = __dirname.includes('.stryker-tmp') || process.env.JEST_WORKER_ID;
const dbPath = isStryker ? ':memory:' : path.resolve(__dirname, 'database.sqlite');
```
- **Kết quả:** Xử lý triệt để 100% lỗi crash, giúp Stryker chạy mượt mà đạt điểm tối đa!

---

## Slide 11: Hoạt động Lớp học — Game "Kill the Mutant" (25 Phút)

*Người phụ trách: 23127259 - Nguyễn Tấn Thắng*

### Kế hoạch Tổ chức Trò chơi Tương tác Lớp học
- **Thời lượng:** 25 phút (nằm trong tổng 45 phút đứng lớp).
- **Quy trình 3 bước:**
  1. **10 phút đầu:** Chiếu 5 đoạn code mutant trích từ EShop. Các nhóm thảo luận và viết Assertion ra phiếu/giấy.
  2. **5 phút tiếp:** Tổ chức chấm chéo (Peer Review) giữa các nhóm.
  3. **10 phút cuối:** Nhóm 08 nhập câu lệnh của các nhóm và **chạy live ngay tại chỗ trên màn hình** xem mutant có bị Killed không!

---

## Slide 12: Bộ Hồ sơ AI Audit Pack Full (AI-02, AI-03, AI-04)

*Người phụ trách: 23127060 - Ninh Văn Khải*

### Minh bạch & Trách nhiệm khi Sử dụng AI
- **[AI-02] Audit Report (≥600 từ):** Thống kê 6 sự cố AI làm sai và quy trình kiểm chứng 100% bởi con người.
- **[AI-03] AI Disclosure:** Tuyên bố rõ ràng phạm vi sử dụng AI (chỉ dùng hỗ trợ gợi ý assertion và giải thích diff).
- **[AI-04] Reflective Statement (300 words English):** Bài thu hoạch phản biện sâu sắc về vai trò của con người trong kỷ nguyên AI-augmented software engineering.

---

## Slide 13: Bảng Đóng góp Công việc & Bài học Kinh nghiệm

*Người phụ trách: Cả Nhóm 08*

### Bảng Phân công Công việc (Tỷ lệ Đóng góp 33.3% mỗi thành viên)

| MSSV | Họ và tên | Vai trò | Hạng mục đóng góp | Đóng góp |
|---|---|---|---|:---:|
| **23127195** | Trần Mạnh Hùng | Nhóm trưởng | Setup Jest/Stryker, Auth Module, Fix SQLite `:memory:`. | **33.3%** |
| **23127060** | Ninh Văn Khải | QA / AI Lead | Order Module (92.6%), AI Audit Pack, Activity "Kill the Mutant". | **33.4%** |
| **23127259** | Nguyễn Tấn Thắng | Tech Writer | Product Module (100%), User Guide, Failure Modes & Slides. | **33.3%** |

---

## Slide 14: Q&A & Link Video Demo (YouTube Unlisted)

*Người phụ trách: Cả Nhóm 08*

### Tổng kết & Mở rộng Thảo luận
- 🎥 **Link Video Demo (YouTube Unlisted):** `<<DÁN_YOUTUBE_UNLISTED_LINK_TẠI_ĐÂY>>`
- 📁 **Repository & Artifacts:** Thư mục `docs/Submition/` chứa đầy đủ `Final_Report.pdf`, `Group08_Slides.pdf`, và mã nguồn EShop.
- ❓ **Xin chân thành cảm ơn Thầy và các bạn đã chú ý theo dõi! Q&A Session.**
