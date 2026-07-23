# KỊCH BẢN CHI TIẾT: QUAY VIDEO DEMO KIỂM THỬ ĐỘT BIẾN (MUTATION TESTING)
**Module:** Product & Admin APIs
**Thực hiện:** 23127259 - Nguyễn Tấn Thắng

---

## 🎬 TỔNG QUAN
- **Mục tiêu:** Khoe được quá trình tách code, tư duy viết test chặn Equivalent Mutant bằng Mock DB, và khoe chiến tích đạt 100% Mutation Score.
- **Công cụ quay màn hình:** OBS Studio / Zalo Screen Capture / macOS Screen Recording (Bấm `Cmd + Shift + 5`).
- **Lưu ý:** Nói chậm rãi, rõ chữ. Chuột di chuyển từ từ, không giật cục. Khi nói đến đâu, dùng chuột bôi đen hoặc chỉ vào dòng code đến đó để người xem dễ theo dõi.

---

## 🎥 CHI TIẾT TỪNG PHÂN CẢNH

### 📍 Phân cảnh 1: Mở đầu & Giới thiệu việc Tách Code
*Thời lượng: ~30 giây*

- **Trạng thái màn hình:** VSCode đang mở, đang ở tab `server.js` (Cuộn đến dòng có chứa `app.get("/api/products", ...)`).
- **Thao tác tay:** 
  1. Dùng con trỏ chuột quét nhẹ qua các dòng định nghĩa API product trong `server.js`.
  2. Bấm chuột chuyển sang tab `services/productService.js`.
  3. Cuộn nhẹ nhàng từ trên xuống dưới để lướt qua các hàm đã được tách (`listProducts`, `getProductById`, `importProducts`...).
- **Lời thoại đọc theo:**
  > "Chào thầy và các bạn, mình là Thắng, phụ trách module Product và Admin. Đầu tiên, để có thể chạy mutation test một cách độc lập và hiệu quả, mình đã tiến hành bóc tách toàn bộ 8 API liên quan đến Product, Import và Order Status. Mình đã đưa chúng từ file `server.js` ban đầu sang một service riêng biệt và gọn gàng hơn, đó là file `productService.js`."

---

### 📍 Phân cảnh 2: Giới thiệu Test Suite & "Bí thuật" Mock Database
*Thời lượng: ~45 giây (Đây là phần ăn điểm nhất)*

- **Trạng thái màn hình:** Bấm chuyển sang tab `tests/admin-products.api.test.js`.
- **Thao tác tay:**
  1. Cuộn từ từ qua một vài dòng `describe` để thầy cô thấy độ đồ sộ của bộ test.
  2. Kéo lên và **dừng lại ở dòng 46** (trong hàm `all` của Mock DB).
  3. Dùng chuột **bôi đen đoạn code**: `if (!Array.isArray(params) || params.length !== 0)` và dòng `throw new Error...` bên dưới.
- **Lời thoại đọc theo:**
  > "Để test file service này, mình sử dụng Jest và Supertest. Thay vì dùng Database thật dễ gây đụng độ data, mình đã tự viết một Mock Database. Điểm ăn tiền lớn nhất ở đây là mình bẫy luôn cả tham số truyền vào của câu SQL. *(Dùng chuột chỉ vào đoạn bôi đen)*. Ví dụ, nếu Stryker cố tình tạo ra Equivalent Mutation bằng cách nhét một tham số rác vào mảng truyền vào của câu SQL không có placeholder, Mock DB của mình sẽ chặn lại và ném ra lỗi ngay lập tức. Nhờ vậy, bộ test của mình hoàn toàn 'miễn nhiễm' và tiêu diệt gọn gàng các Equivalent Mutation nguy hiểm."

---

### 📍 Phân cảnh 3: Cấu hình Stryker
*Thời lượng: ~30 giây*

- **Trạng thái màn hình:** Chuyển sang tab `stryker.product.config.mjs`.
- **Thao tác tay:**
  1. Bôi đen dòng `mutate: ["services/productService.js"]`.
  2. Bôi đen dòng `testFiles: ["tests/admin-products.api.test.js"]`.
  3. Chuyển sang tab `package.json`, tìm và bôi đen dòng `"mutation:product": "stryker run stryker.product.config.mjs"`.
- **Lời thoại đọc theo:**
  > "Về cấu hình Stryker, mình thiết lập một file config riêng để Stryker chỉ tập trung 'đột biến' đúng file `productService.js` và chỉ chạy bộ test của riêng nó để tiết kiệm thời gian. Trong `package.json`, mình đã định nghĩa sẵn lệnh `npm run mutation:product` để khởi chạy."

---

### 📍 Phân cảnh 4: Thực thi Test và Mutation Testing (Action!)
*Thời lượng: ~1 phút (Trên video thực tế, có thể cắt bớt lúc chờ chạy)*

- **Trạng thái màn hình:** Bật Terminal của VSCode lên (nên kéo Terminal to lên một chút để dễ nhìn).
- **Thao tác tay:**
  1. Gõ lệnh `npm test` và gõ Enter.
  2. Chờ Jest chạy xong, dùng chuột khoanh nhẹ dòng chữ `Test Suites: 5 passed` màu xanh lá.
  3. Xóa trắng terminal (gõ `clear` hoặc bấm icon thùng rác rồi mở terminal mới).
  4. Gõ câu lệnh phép thuật: `npm run mutation:product` và bấm Enter.
  5. **[QUAN TRỌNG KHI DỰNG VIDEO]**: Stryker chạy sẽ mất khoảng 1-2 phút. Bạn cứ để nó chạy. Sau khi quay xong toàn bộ, lúc edit video thì hãy **Tua nhanh (Fast Forward x5)** hoặc **Cắt (Cut)** bỏ đoạn ngồi chờ này đi cho video không bị nhàm chán.
- **Lời thoại đọc theo:**
  > "Bây giờ mình sẽ chạy thử. Đầu tiên là `npm test`, như các bạn thấy, bộ test Jest chạy qua toàn bộ thành công. Tiếp theo là khoảnh khắc sự thật, mình gọi lệnh `npm run mutation:product`. Stryker đang nạp sandbox và sinh ra hàng trăm mutant để tấn công vào file code..."

---

### 📍 Phân cảnh 5: Show kết quả HTML và Chốt hạ
*Thời lượng: ~45 giây*

- **Trạng thái màn hình:** 
  1. Stryker chạy xong, in ra bảng summary trên Terminal.
  2. Chuyển sang trình duyệt Web (Chrome/Edge) mở sẵn file `reports/mutation-product/mutation.html`.
- **Thao tác tay:**
  1. Ở Terminal, bôi đen con số `100.00%`.
  2. Chuyển qua cửa sổ Trình duyệt Web.
  3. Rê chuột vào thanh màu xanh lá (Killed) và thanh Survived để chứng minh Survived = 0.
  4. Bấm thử vào file `productService.js` trên report HTML để show toàn màu xanh lá bên trong.
- **Lời thoại đọc theo:**
  > "Quá trình kiểm thử đã xong. Kết quả thật tuyệt vời, Mutation Score đạt 100% tuyệt đối! Trên bảng report HTML này, mọi người có thể thấy toàn bộ 185 mutant sinh ra đã bị tiêu diệt hoàn toàn. Không có bất kỳ mutant nào Survived hay NoCoverage. Mọi nhánh rẽ, mọi bẫy lỗi database và logic kinh doanh đều đã được bộ test cover kỹ càng. Phần demo của module Product đến đây là kết thúc, cảm ơn thầy và các bạn đã theo dõi!"

---
**🎬 HOÀN TẤT QUAY VIDEO. CHÚC ĐẠO DIỄN THẮNG CÓ MỘT CLIP DEMO ĐIỂM 10!**
