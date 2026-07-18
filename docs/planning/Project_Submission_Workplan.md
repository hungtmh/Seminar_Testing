# Group08 - Kế hoạch hoàn thiện project seminar T10

## 1. Mục tiêu

Do lịch nộp project được đẩy sớm, nhóm cần chuyển từ baseline demo sang kết quả project chính trên EShop thật. Từ thời điểm này, kết quả chính của seminar phải thỏa các nguyên tắc sau:

- Code được test phải thuộc project `eshop-sut`.
- Test phải chạy thật bằng Jest.
- Stryker phải tạo mutant thật từ code EShop.
- Phải có mutation report trước và sau khi cải thiện test.
- Không trình bày một đoạn code giả hoàn toàn bên ngoài EShop như kết quả chính.
- Module demo `business/orderLogic.js` của tuần 7 đã được xóa khỏi backend để tránh lẫn với kết quả project chính.

## 2. Yêu cầu nộp cuối

| Hạng mục | Format bắt buộc | Người phụ trách chính | Ghi chú |
|---|---|---|---|
| Presentation Slides | Markdown/LaTeX/HTML + PDF | 23127259 - Nguyễn Tấn Thắng | Mỗi section ghi rõ MSSV + họ tên người phụ trách |
| Final Report | Markdown + PDF | 23127060 - Ninh Văn Khải | Có link video YouTube unlisted trong report |
| Project Contribution Statement | Template spreadsheet -> Markdown + PDF | 23127195 - Trần Mạnh Hùng | Dựa trên template của thầy |
| Demo Video | YouTube unlisted | Cả nhóm | Link phải nhúng trong slides và final report |
| Final ZIP | `Group08.zip` | 23127259 - Nguyễn Tấn Thắng | Tối đa 20 MB, không dùng link Drive/OneDrive/Dropbox |

## 3. Chiến lược kỹ thuật

### 3.1 Chuyển từ demo module sang EShop thật

Hiện backend đang gom nhiều logic trong:

```text
eshop-sut/backend/server.js
```

Để test thật nhưng vẫn giữ code dễ kiểm soát, nhóm sẽ làm theo hướng:

- Test trực tiếp API thật bằng Jest + Supertest.
- Chỉnh `server.js` để export `app` cho test, nhưng không làm thay đổi hành vi khi chạy backend.
- Dùng database test riêng hoặc reset database trước mỗi nhóm test.
- Stryker mutate các file thuộc EShop thật, ưu tiên logic route/service đã tách ra từ `server.js`.

### 3.2 Cấu trúc kỹ thuật đề xuất

| File/thư mục | Mục đích |
|---|---|
| `eshop-sut/backend/server.js` | Giữ Express routes thật, export `app` để test API |
| `eshop-sut/backend/services/authService.js` | Logic thật cho Auth/User, được route trong `server.js` sử dụng |
| `eshop-sut/backend/__tests__/auth.api.test.js` | Test API đăng ký, đăng nhập, khóa tài khoản, reset password |
| `eshop-sut/backend/__tests__/order.api.test.js` | Test cart, coupon, checkout/order |
| `eshop-sut/backend/__tests__/admin-products.api.test.js` | Test product/admin/import/status |
| `eshop-sut/backend/stryker.auth.config.mjs` | Config mutate code EShop thật cho Auth/User |
| `eshop-sut/backend/reports/mutation-baseline/` | Report trước khi cải thiện test |
| `eshop-sut/backend/reports/mutation-improved/` | Report sau khi cải thiện test |

Nếu cần tách logic khỏi `server.js`, chỉ tách từ logic thật đang tồn tại, ví dụ:

```text
eshop-sut/backend/services/authService.js
eshop-sut/backend/services/orderService.js
eshop-sut/backend/services/productService.js
```

Không tạo logic giả tách rời EShop để thay thế kết quả chính.

Ghi chú quan trọng cho cả nhóm:

- `__tests__/orderLogic.test.js` và `business/orderLogic.js` đã được xóa để `npm test` không còn tính test demo vào kết quả chính.
- Kết quả project chính chỉ dựa vào test API/service thật của EShop, ví dụ `auth.api.test.js` gọi route thật qua Supertest.
- Khi làm phần của mình, mỗi thành viên cần tạo test API/service thật tương ứng, ví dụ `auth.api.test.js`, `order.api.test.js`, `admin-products.api.test.js`.
- Nếu cần nhắc lại tuần 7 trong final report, chỉ ghi là phần học công cụ ban đầu; không đưa vào số liệu test/mutation chính.

## 4. Phân công công bằng theo luồng EShop

Mỗi thành viên đều phải đi qua đủ vòng:

```text
Đọc code EShop -> Viết Jest test -> Chạy test -> Chạy Stryker baseline
-> Đọc mutant -> Viết thêm assertion/test -> Chạy Stryker improved
-> Ghi kết quả vào report/slides
```

### 4.1 23127195 - Trần Mạnh Hùng

Luồng phụ trách chính:

```text
Authentication + User Profile
```

Phạm vi EShop thật:

- `POST /api/register`
- `POST /api/login`
- `POST /api/forgot-password`
- `POST /api/reset-password`
- `GET /api/users/me`
- `PUT /api/users/me`

Nhiệm vụ kỹ thuật:

- Chỉnh `server.js` để test có thể import `app`.
- Cài/thêm package test nếu cần:

```powershell
cd eshop-sut\backend
npm install --save-dev jest supertest
```

- Viết `auth.api.test.js` bằng Jest + Supertest.
- Test các case thật:
  - đăng ký user thành công;
  - login đúng trả token;
  - login sai trả `401`;
  - tài khoản bị khóa sau nhiều lần sai;
  - forgot/reset password hoạt động;
  - user profile yêu cầu token.
- Chạy baseline Stryker cho nhóm route/auth logic.
- Chọn ít nhất 3 mutants của phần auth để phân tích.
- Viết thêm test để kill ít nhất 2 mutants.

Bằng chứng cần nộp:

- File test `auth.api.test.js`.
- Command output `npm test`.
- Report baseline và improved cho phần auth.
- Bảng mutant trước/sau.
- Section trong final report ghi rõ: `23127195 - Trần Mạnh Hùng`.

### 4.2 23127060 - Ninh Văn Khải

Luồng phụ trách chính:

```text
Cart + Coupon + Checkout/Order
```

Phạm vi EShop thật:

- API cart trong `server.js`.
- API coupon nếu có trong backend.
- API tạo order/checkout.
- API xem order của user nếu có.

Nhiệm vụ kỹ thuật:

- Đọc kỹ logic cart/order hiện có trong `server.js`.
- Nếu logic quá khó test trực tiếp, tách logic thật sang `services/orderService.js`, nhưng route vẫn dùng service đó.
- Viết `order.api.test.js` bằng Jest + Supertest.
- Test các case thật:
  - thêm sản phẩm vào cart;
  - cập nhật số lượng;
  - xóa sản phẩm khỏi cart;
  - áp coupon hợp lệ;
  - coupon hết hạn hoặc không đủ điều kiện;
  - checkout tạo order đúng total;
  - order không cho checkout nếu cart rỗng.
- Chạy Stryker baseline cho phần cart/order.
- Đọc report HTML và chọn ít nhất 5 surviving mutants.
- Viết thêm test/assertion để cải thiện mutation score.

Bằng chứng cần nộp:

- File test `order.api.test.js`.
- HTML report baseline.
- HTML report improved.
- Bảng 5 surviving mutants gồm file, dòng, operator, trạng thái, lý do survived, test đề xuất.
- Section trong final report ghi rõ: `23127060 - Ninh Văn Khải`.

### 4.3 23127259 - Nguyễn Tấn Thắng

Luồng phụ trách chính:

```text
Products + Admin APIs + Import/Order Status
```

Phạm vi EShop thật:

- `GET /api/products`
- `GET /api/products/:id`
- Admin product APIs nếu có.
- Import products CSV/JSON nếu có.
- Admin order status APIs nếu có.

Nhiệm vụ kỹ thuật:

- Viết `admin-products.api.test.js` bằng Jest + Supertest.
- Test các case thật:
  - lấy danh sách products;
  - lấy product detail;
  - search product;
  - admin thêm/sửa/xóa product nếu API hỗ trợ;
  - import products từ dữ liệu mẫu;
  - cập nhật trạng thái order hợp lệ;
  - từ chối trạng thái order không hợp lệ.
- Chạy Stryker baseline cho phần product/admin.
- Chọn ít nhất 3 mutants để phân tích.
- Viết thêm test để kill ít nhất 2 mutants.
- Chuẩn bị slides và đóng gói final ZIP.

Bằng chứng cần nộp:

- File test `admin-products.api.test.js`.
- Command output `npm test`.
- Report baseline và improved.
- Slides Markdown/HTML và PDF.
- Final ZIP `Group08.zip`.
- Section trong final report/slides ghi rõ: `23127259 - Nguyễn Tấn Thắng`.

## 5. Quy trình chạy chung

### 5.1 Cài dependency

```powershell
cd eshop-sut\backend
npm install
npm install --save-dev jest supertest @stryker-mutator/core @stryker-mutator/jest-runner
```

### 5.2 Chạy Jest

```powershell
cd eshop-sut\backend
npm test
```

Điều kiện đạt:

```text
Tất cả test pass.
Không được bỏ qua test fail bằng cách xóa assertion quan trọng.
```

### 5.3 Chạy Stryker baseline

Trước khi cải thiện test, lưu report baseline:

```powershell
cd eshop-sut\backend
npm run mutation
```

Sau khi chạy xong, copy report:

```text
reports/mutation/mutation.html
```

sang:

```text
reports/mutation-baseline/mutation.html
```

### 5.4 Cải thiện test

Mỗi thành viên chọn mutants thuộc phần mình phụ trách, sau đó:

- đọc mutant diff;
- xác định test còn thiếu;
- thêm assertion hoặc test case;
- chạy lại `npm test`;
- chạy lại `npm run mutation`.

### 5.5 Chạy Stryker improved

Sau khi cải thiện test, lưu report sau:

```text
reports/mutation-improved/mutation.html
```

Báo cáo phải có bảng so sánh:

| Phần | Baseline score | Improved score | Killed tăng | Survived giảm | Người phụ trách |
|---|---:|---:|---:|---:|---|
| Auth/User | TBD | TBD | TBD | TBD | 23127195 - Trần Mạnh Hùng |
| Cart/Order | TBD | TBD | TBD | TBD | 23127060 - Ninh Văn Khải |
| Product/Admin | TBD | TBD | TBD | TBD | 23127259 - Nguyễn Tấn Thắng |

## 6. Điều chỉnh Stryker config

Không dùng lại config cũ chỉ mutate module demo `business/orderLogic.js`.

Config cuối nên mutate code EShop thật. Với phần Auth/User, Hùng đã tách logic thật từ `server.js` sang:

```text
eshop-sut/backend/services/authService.js
```

Route trong `server.js` vẫn gọi service này:

```javascript
app.post("/api/register", registerUser(db));
app.post("/api/login", loginUser(db));
app.post("/api/forgot-password", forgotPassword(db));
app.post("/api/reset-password", resetPassword(db));
app.get("/api/users/me", authenticateToken, getCurrentUser(db));
app.put("/api/users/me", authenticateToken, updateCurrentUser(db));
```

Stryker Auth config nên mutate service thật này:

```javascript
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  mutate: ["services/authService.js"],
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0
  },
  timeoutMS: 10000
};
```

Config tổng cho project có thể mutate các service thật. Ví dụ:

```javascript
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  mutate: [
    "services/**/*.js",
    "!__tests__/**/*.js",
    "!database.js"
  ],
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0
  },
  timeoutMS: 10000
};
```

Nếu mutate toàn bộ `server.js` quá chậm, nhóm có thể chia từng lượt:

```javascript
mutate: ["services/authService.js"]
mutate: ["services/orderService.js"]
mutate: ["services/productService.js"]
```

Nhưng các service đó phải được tách từ logic thật của EShop và được route thật sử dụng.

## 7. Nội dung final report

Final report cần có tối thiểu:

1. Giới thiệu chủ đề mutation testing.
2. Mô tả project EShop và phạm vi test.
3. Cách setup Jest/Stryker.
4. Test strategy theo từng luồng:
   - Auth/User;
   - Cart/Order;
   - Product/Admin.
5. Baseline mutation report.
6. Phân tích surviving mutants.
7. Cải thiện test và improved mutation report.
8. So sánh trước/sau.
9. AI usage disclosure.
10. Link video YouTube unlisted.
11. Project contribution statement.

Mỗi section phải ghi người phụ trách ngay dưới tiêu đề, ví dụ:

```markdown
## 5. Baseline Mutation Report

Phụ trách: 23127060 - Ninh Văn Khải
```

## 8. Nội dung slides

Slides nên ngắn, tập trung demo:

1. Problem: coverage cao chưa chắc test tốt.
2. Mutation testing là gì.
3. Vì sao chọn Stryker.
4. EShop SUT và các API được test.
5. Jest API tests chạy thật.
6. Stryker baseline report.
7. Ví dụ surviving mutant.
8. Thêm test để kill mutant.
9. Improved report.
10. Lessons learned.
11. AI usage and limitations.
12. Link demo video.

Mỗi slide/section phải ghi người phụ trách.

## 9. Demo video

Video YouTube unlisted cần quay các bước:

1. Mở EShop backend.
2. Chạy:

```powershell
npm test
```

3. Chạy:

```powershell
npm run mutation
```

4. Mở baseline report.
5. Chỉ ra một surviving mutant.
6. Thêm hoặc mở test mới đã viết để kill mutant.
7. Chạy lại Jest.
8. Chạy lại Stryker.
9. Mở improved report.
10. Kết luận mutation score cải thiện.

Link video phải được đặt trong:

- slides;
- final report.

Không nộp link Google Drive/OneDrive/Dropbox thay cho file bắt buộc.

## 10. Project Contribution Statement

Nguồn template:

```text
https://docs.google.com/spreadsheets/d/1Z0YA8GefaxncsrKqpMniz0V3xhK_0WldxRHJ4ohLSPY/edit?usp=sharing
```

Quy trình:

1. Điền contribution theo từng thành viên.
2. Export hoặc copy nội dung sang Markdown.
3. Tạo PDF.
4. Đưa cả `.md` và `.pdf` vào `Group08.zip`.

Nội dung cần thể hiện công bằng:

| Thành viên | Testing thật | Mutation thật | Tài liệu/demo | Tỷ lệ đề xuất |
|---|---|---|---|---:|
| 23127195 - Trần Mạnh Hùng | Auth/User tests | Auth mutants | Contribution statement, setup | 33.33% |
| 23127060 - Ninh Văn Khải | Cart/Order tests | Order mutants | Final report, mutant analysis | 33.33% |
| 23127259 - Nguyễn Tấn Thắng | Product/Admin tests | Product/Admin mutants | Slides, video, packaging | 33.33% |

## 11. Checklist trước khi nộp

### Code/test

- [ ] Jest test chạy thật trên EShop.
- [ ] Không còn dùng `orderLogic.js` demo làm kết quả chính.
- [ ] Có test cho ít nhất 3 nhóm API thật.
- [ ] `npm test` pass.
- [ ] Stryker tạo mutant thật.
- [ ] Có baseline mutation report.
- [ ] Có improved mutation report.
- [ ] Có bảng so sánh trước/sau.

### Tài liệu

- [ ] Slides `.md` hoặc `.html`.
- [ ] Slides `.pdf`.
- [ ] Final report `.md`.
- [ ] Final report `.pdf`.
- [ ] Contribution statement `.md`.
- [ ] Contribution statement `.pdf`.
- [ ] YouTube unlisted link nằm trong slides và report.
- [ ] Mỗi section ghi rõ MSSV + họ tên phụ trách.

### Đóng gói

- [ ] File cuối tên `Group08.zip`.
- [ ] Dung lượng <= 20 MB.
- [ ] Nếu > 20 MB thì split archive theo quy định.
- [ ] Không nộp link cloud thay cho file.
- [ ] Mở thử ZIP sau khi nén để chắc không thiếu file.

## 12. Timeline làm gấp

| Thời điểm | Việc cần xong | Người phụ trách |
|---|---|---|
| Ngày 1 sáng | Chỉnh test infrastructure, export `app`, cài Jest/Supertest | 23127195 - Trần Mạnh Hùng |
| Ngày 1 chiều | Mỗi người viết test API cho phần của mình | Cả nhóm |
| Ngày 1 tối | Chạy Jest và Stryker baseline | Cả nhóm |
| Ngày 2 sáng | Phân tích surviving mutants, thêm test cải thiện | Cả nhóm |
| Ngày 2 chiều | Chạy improved report, chụp bằng chứng | Cả nhóm |
| Ngày 2 tối | Viết final report, slides, contribution statement | Cả nhóm theo phân công |
| Ngày 3 | Quay video, tạo PDF, đóng `Group08.zip`, kiểm tra size | 23127259 lead, cả nhóm kiểm tra |

## 13. Definition of Done

Project chỉ được xem là sẵn sàng nộp khi:

- Mỗi thành viên có ít nhất một file test Jest thuộc EShop thật.
- Mỗi thành viên có ít nhất một phần mutation report và mutant analysis.
- Có report trước và sau khi cải thiện test.
- Có bằng chứng command chạy thật.
- Final report và slides đều ghi rõ người phụ trách từng section.
- Demo video có link YouTube unlisted và được nhúng trong report/slides.
- `Group08.zip` chứa đủ file và dưới 20 MB.
