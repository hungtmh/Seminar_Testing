# Nhật Ký Tương Tác Với AI (AI Interaction Trace)

**Người thực hiện:** 23127060 - Ninh Văn Khải  
**Nội dung:** Trace lại quá trình làm việc cùng AI Assistant để hoàn thành luồng kiểm thử đột biến (Mutation Testing) cho Cart/Order/Coupon.

---

## 1. Phân Tích Codebase & Thiết Kế Kiến Trúc
* **Hành động:** AI cùng User đọc file `server.js` để tìm các route liên quan đến Cart, Coupon và Order.
* **Quyết định:** Tiến hành cô lập logic bằng cách tách các handler trực tiếp từ `server.js` ra một file service riêng (`services/orderService.js`).
* **Kết quả:** `server.js` gọn hơn và dễ test độc lập qua Supertest bằng cách truyền dependency `db` vào service.

---

## 2. Thiết Lập Môi Trường Mutation Testing
* **Hành động:**
  * Tạo file cấu hình `stryker.order.config.mjs` nhằm cấu hình Stryker chỉ chạy đột biến cho `services/orderService.js` sử dụng runner `jest`.
  * Thêm script `"mutation:order"` vào file `package.json` để dễ dàng chạy bằng lệnh `npm run`.

---

## 3. Thực Hiện Kiểm Thử Đột Biến Bản Baseline (Lần 1)
* **Hành động:** 
  * Viết file kiểm thử ban đầu `__tests__/order.api.test.js` với các case cơ bản (chỉ kiểm tra mã trạng thái HTTP 200).
  * Chạy `npm test` và `npm run mutation:order`.
* **Kết quả Baseline:** 
  * Điểm Mutation Score: **16.67%**.
  * Ghi nhận 6 mutants sống sót (Survived) và 69 mutants chưa được bao phủ (NoCoverage).
  * AI đã hỗ trợ sao lưu kết quả baseline ra thư mục `reports/mutation-order-baseline/`.

---

## 4. Phân Tích & Cải Thiện Bộ Test (Improved Phase)
* **Phát hiện & xử lý các vấn đề logic:**
  1. **Lỗi ô nhiễm Database (State Pollution):** Khi chạy các bài test coupon tuần tự, bài test trước ghi dữ liệu sử dụng coupon khiến bài test giới hạn coupon sau đó bị fail. AI và User đã tổ chức lại thứ tự chạy và tách tài khoản sử dụng để cô lập dữ liệu.
  2. **Xử lý Bug thật của EShop:** Phát hiện logic tính toán phần trăm coupon trong dự án gốc bị âm (`1 - discount_value` thay vì chia cho 100). Quyết định giữ nguyên logic thật và viết assertion mong đợi giá trị âm để kiểm chứng tính đúng đắn của code hiện tại.
  3. **Tăng cường bao phủ:** Viết thêm các test case kiểm tra ngoại lệ: Coupon không tồn tại, Coupon hết hạn, Đơn hàng không đủ giá trị tối thiểu, Hủy đơn của user khác (404), Lỗi Database callback (500).
* **Kết quả Improved:**
  * Lượng test cases tăng từ 5 lên 21.
  * Điểm Mutation Score tăng vượt bậc lên **84.21%** (chỉ còn 1 mutant sống sót và 8 mutants NoCoverage liên quan đến mock DB error).
  * Sao lưu kết quả improved ra thư mục `reports/mutation-order-improved/`.

---

## 5. Xuất Báo Cáo & Đồng Bộ Git
* **Hành động:**
  * User di chuyển báo cáo tổng hợp vào đúng thư mục `docs/evidence/report_nvk.md`.
  * Theo yêu cầu của User, cấu hình file `.gitignore` để bỏ theo dõi file `report_nvk.md` trên Git, sau đó chạy `git rm --cached docs/evidence/report_nvk.md` để untrack.
  * Fetch và Merge nhánh `main` mới nhất (chứa code thay đổi phần Product của thành viên khác), giải quyết xung đột (conflict) thành công trên các file `server.js`, `package.json` và `orderService.js`.
  * Thực hiện commit và push toàn bộ thành quả lên nhánh mới `nvk`.
