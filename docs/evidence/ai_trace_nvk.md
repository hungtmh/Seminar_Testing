# Nhật Ký Tương Tác Với AI (AI Interaction Trace)

**Người thực hiện:** 23127060 - Ninh Văn Khải  
**Nội dung:** Trace lại quá trình làm việc cùng AI Assistant để hoàn thành luồng kiểm thử đột biến (Mutation Testing) cho Cart/Order/Coupon.

---

## 1. Phân Tích Codebase & Thiết Kế Kiến Trúc

- **Hành động:** AI cùng User đọc file `server.js` để tìm các route liên quan đến Cart, Coupon và Order.
- **Quyết định:** Tiến hành cô lập logic bằng cách tách các handler trực tiếp từ `server.js` ra một file service riêng (`services/orderService.js`).
- **Kết quả:** `server.js` gọn hơn và dễ test độc lập qua Supertest bằng cách truyền dependency `db` vào service.

---

## 2. Thiết Lập Môi Trường Mutation Testing

- **Hành động:**
  - Tạo file cấu hình `stryker.order.config.mjs` nhằm cấu hình Stryker chỉ chạy đột biến cho `services/orderService.js` sử dụng runner `jest`.
  - Thêm script `"mutation:order"` vào file `package.json` để dễ dàng chạy bằng lệnh `npm run`.

---

## 3. Thực Hiện Kiểm Thử Đột Biến Bản Baseline (Lần 1)

- **Hành động:**
  - Viết file kiểm thử ban đầu `__tests__/order.api.test.js` với các case cơ bản (chỉ kiểm tra mã trạng thái HTTP 200).
  - Chạy `npm test` và `npm run mutation:order`.
- **Kết quả Baseline:**
  - Điểm Mutation Score: **16.67%**.
  - Ghi nhận 6 mutants sống sót (Survived) và 69 mutants chưa được bao phủ (NoCoverage).
  - AI đã hỗ trợ sao lưu kết quả baseline ra thư mục `reports/mutation-order-baseline/`.

---

## 4. Phân Tích & Cải Thiện Bộ Test (Improved Phase)

- **Phát hiện & xử lý các vấn đề logic:**
  1. **Lỗi ô nhiễm Database (State Pollution):** Khi chạy các bài test coupon tuần tự, bài test trước ghi dữ liệu sử dụng coupon khiến bài test giới hạn coupon sau đó bị fail. AI và User đã tổ chức lại thứ tự chạy và tách tài khoản sử dụng để cô lập dữ liệu.
  2. **Xử lý Bug thật của EShop:** Phát hiện logic tính toán phần trăm coupon trong dự án gốc bị âm (`1 - discount_value` thay vì chia cho 100). Quyết định giữ nguyên logic thật và viết assertion mong đợi giá trị âm để kiểm chứng tính đúng đắn của code hiện tại.
  3. **Tăng cường bao phủ:** Viết thêm các test case kiểm tra ngoại lệ: Coupon không tồn tại, Coupon hết hạn, Đơn hàng không đủ giá trị tối thiểu, Hủy đơn của user khác (404), Lỗi Database callback (500).
- **Kết quả Improved:**
  - Lượng test cases tăng từ 5 lên 21.
  - Điểm Mutation Score tăng vượt bậc lên **84.21%** (chỉ còn 1 mutant sống sót và 8 mutants NoCoverage liên quan đến mock DB error).
  - Sao lưu kết quả improved ra thư mục `reports/mutation-order-improved/`.

---

## 5. Xuất Báo Cáo & Đồng Bộ Git

- **Hành động:**
  - User di chuyển báo cáo tổng hợp vào đúng thư mục `docs/evidence/report_nvk.md`.
  - Theo yêu cầu của User, cấu hình file `.gitignore` để bỏ theo dõi file `report_nvk.md` trên Git, sau đó chạy `git rm --cached docs/evidence/report_nvk.md` để untrack.
  - Fetch và Merge nhánh `main` mới nhất (chứa code thay đổi phần Product của thành viên khác), giải quyết xung đột (conflict) thành công trên các file `server.js`, `package.json` và `orderService.js`.
  - Thực hiện commit và push toàn bộ thành quả lên nhánh mới `nvk`.

## 6. Phụ lục: Log Prompt & Phản hồi của AI (Bằng chứng)

Dưới đây là lịch sử chat thực tế với AI (ChatGPT/Claude) để tìm cách tiêu diệt các Surviving Mutants.

### Prompt 1: Tiêu diệt Mutant làm bẩn giỏ hàng

- **User (Khải):** "Trong file `orderService.js`, Stryker báo một mutant sống sót: Code gốc là `if (!userCarts[userId]) userCarts[userId] = [];`. Stryker đã biến đổi thành `if (!userCarts[userId]) userCarts[userId] = ["Stryker was here"];` nhưng test của tôi vẫn Pass. Hãy giải thích tại sao và gợi ý assertion để giết mutant này."
- **AI Trả lời (Tóm tắt):** "Test của bạn vẫn Pass vì bạn chỉ đang assert HTTP status 200 chứ không kiểm tra nội dung trả về của giỏ hàng (Cart). Vì vậy, dù mảng giỏ hàng khởi tạo bị nhét phần tử rác 'Stryker was here', test vẫn không nhận ra. **Gợi ý Assertion:** Bạn cần kiểm tra độ dài mảng trả về phải bằng 0 khi giỏ hàng trống: `expect(res.body).toEqual([])` hoặc `expect(res.body.length).toBe(0)`."
- **Kiểm chứng thực tế:** Gợi ý của AI chính xác. Sau khi bổ sung assertion kiểm tra body rỗng, Mutant đã bị **Killed**.

### Prompt 2: Tiêu diệt Mutant điều kiện giới hạn Coupon

- **User (Khải):** "Tôi có đoạn code logic coupon: `if (usage_count >= coupon.max_uses_per_user) return res.status(400)`. Stryker biến `>=` thành `>` và mutant này sống sót. Cho tôi một test case để giết nó."
- **AI Trả lời (Tóm tắt):** "Mutant này sống vì bạn chưa test 'Điểm giới hạn' (Boundary value). Test của bạn có thể chỉ mới kiểm tra `usage_count < max` (coupon vẫn dùng được). Bạn cần một test case mô phỏng người dùng nhập mã giảm giá khi họ **đã dùng đúng bằng số lần tối đa**. **Gợi ý Assertion:** Set `usage_count = max_uses_per_user`, gửi POST apply-coupon, và expect nhận về mã lỗi 400 cùng thông báo vượt quá số lần sử dụng."
- **Kiểm chứng thực tế:** Gợi ý của AI hoàn toàn hợp lý logic kiểm thử biên (Boundary Value Analysis). Sau khi thêm test case này, Mutant đã bị **Killed**.

### Prompt 3: Tiêu diệt sự cố Database Crash (0xC0000005) và lỗi cấu hình Stryker (No tests were found)

- **User (Khải):** "Khi chạy `mutation:auth`, Stryker báo lỗi `No tests were found` ở bước Dry-Run, hoặc thỉnh thoảng crash native C++ với mã lỗi `3221225477` (`SQLITE_BUSY`). Hãy phân tích nguyên nhân tại sao `database.js` dù đã check `JEST_WORKER_ID` để dùng `:memory:` nhưng vẫn bị crash khi chạy 15 worker?"
- **AI Trả lời (Tóm tắt):** "Có 2 vấn đề lớn. (1) **Lỗi Crash:** Ở bước Dry-Run đầu tiên, Stryker chạy Jest in-band (đơn luồng), nên `JEST_WORKER_ID` không được thiết lập. 15 sandbox do Stryker tạo ra sẽ fallback về dùng chung 1 file vật lý `database.sqlite` (đôi khi được symlink) gây tranh chấp và crash SQLite C++ extension. Cần đổi `database.js` check thêm đường dẫn: `const isStryker = __dirname.includes('.stryker-tmp') || process.env.JEST_WORKER_ID`. (2) **Lỗi Không Tìm Thấy Test:** Việc dùng thuộc tính `testFiles` cùng `enableFindRelatedTests: false` ép Jest nhận đường dẫn tuyệt đối sai lệch trong sandbox. Khắc phục bằng cách xóa `testFiles` và cấu hình lại `jest.auth.config.cjs` dùng đường dẫn glob tương đối `testMatch: ["**/auth.api.test.js"]`."
- **Kiểm chứng thực tế:** Quá trình phân tích rất sâu và bám sát kiến trúc sandbox của Stryker. Sau khi áp dụng, lỗi crash biến mất hoàn toàn, test chạy mượt mà và Mutation Score của Auth đạt **87.16%**, Product đạt **100%**. Đây là minh chứng rõ nhất cho việc AI có thể debug kiến trúc cấu hình phức tạp.
