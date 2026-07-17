# Báo cáo làm việc hằng tuần - Nhóm 08, Tuần 07

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Mã nhóm | Nhóm 08 |
| Tên nhóm | Nhóm 8 |
| Tên project | T10 - Mutation Testing & Test Effectiveness |
| Môn học | CS423 / CSC15003 - Kiểm thử phần mềm |
| Khoảng thời gian | 2026-07-06 - 2026-07-11 |
| Tuần thuyết trình dự kiến | Tuần 10 |

## 2. Công việc đã hoàn thành trong tuần

### 23127195 - Trần Mạnh Hùng

- Setup backend EShop tại thư mục `eshop-sut/backend`.
- Kiểm tra trạng thái ban đầu của backend và phát hiện script `npm test` cũ chỉ in lỗi `Error: no test specified`.
- Cài Jest và Stryker cho backend bằng lệnh:

```powershell
cd eshop-sut\backend
npm install --save-dev jest @stryker-mutator/core @stryker-mutator/jest-runner
```

- Cập nhật `package.json` để có các script cần thiết:

```json
"test": "jest --runInBand",
"mutation": "stryker run"
```

- Tạo file cấu hình Stryker:

```text
eshop-sut/backend/stryker.config.mjs
```

- Chạy baseline mutation testing bằng lệnh:

```powershell
npm test
npm run mutation
```

Bằng chứng:

- `eshop-sut/backend/package.json`
- `eshop-sut/backend/package-lock.json`
- `eshop-sut/backend/stryker.config.mjs`
- `eshop-sut/backend/reports/mutation/mutation.html`

### 23127060 - Ninh Văn Khải

- Đọc HTML mutation report do Stryker sinh ra.
- Xác định kết quả baseline của file `business/orderLogic.js`.
- Phân loại mutant theo các trạng thái:
  - killed;
  - survived;
  - timeout;
  - noCoverage.
- Chọn các surviving mutants phù hợp để dùng cho tuần 8 và seminar demo.
- Ghi nhận các vị trí test suite hiện tại còn yếu, đặc biệt ở các nhánh:
  - kiểm tra giá âm;
  - coupon `FREESHIP`;
  - shipping method `express`;
  - default shipping method.

Bằng chứng:

- `eshop-sut/backend/reports/mutation/mutation.html`
- Bảng phân tích surviving mutants trong báo cáo tuần này
- `eshop-sut/backend/business/orderLogic.js`
- `eshop-sut/backend/__tests__/orderLogic.test.js`

### 23127259 - Nguyễn Tấn Thắng

- Ghi lại quy trình cài đặt Jest/Stryker và cách chạy lại baseline.
- Cập nhật `User_Guide.md` mục cài đặt và chạy mutation test.
- Ghi nhận các lỗi/cảnh báo khi cài đặt:
  - backend ban đầu chưa có test runner thật;
  - `npm install` có warning từ dependency tree;
  - `npm audit` báo một số vulnerability;
  - không chạy `npm audit fix` trong tuần 7 để tránh thay đổi baseline.
- Chuẩn bị báo cáo tuần 7 và danh sách file cần đóng gói.

Bằng chứng:

- `User_Guide.md`
- `Group08_07.md`
- `Group08_07.pdf`
- `Group08_07.zip`

## 3. Kết quả kỹ thuật tuần 7

### 3.1 Phạm vi baseline

Backend EShop hiện đang gom phần lớn logic trực tiếp trong `server.js` dưới dạng Express API routes. Vì vậy nhóm chọn một module business logic nhỏ để chạy baseline mutation testing:

```text
eshop-sut/backend/business/orderLogic.js
```

Module này mô phỏng phần checkout/order business logic, gồm:

- tính subtotal;
- tính discount;
- tính shipping fee;
- tính tax;
- tính total;
- kiểm tra dữ liệu giỏ hàng không hợp lệ.

File test tương ứng:

```text
eshop-sut/backend/__tests__/orderLogic.test.js
```

Ghi chú: Baseline tuần 7 chưa test trực tiếp toàn bộ API trong `server.js`. Đây là baseline scope nhỏ trên module order/checkout business logic để Stryker có dữ liệu thật và chạy nhanh.

### 3.2 Cấu hình Stryker

File cấu hình:

```text
eshop-sut/backend/stryker.config.mjs
```

Nội dung chính:

```javascript
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  mutate: ["business/orderLogic.js"],
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
```

Ý nghĩa:

- `testRunner: "jest"`: Stryker dùng Jest để chạy test.
- `reporters: ["html", "clear-text", "progress"]`: Stryker sinh HTML report, in bảng kết quả và tiến trình chạy.
- `mutate: ["business/orderLogic.js"]`: Stryker chỉ tạo mutant trong file `orderLogic.js`.
- `coverageAnalysis: "perTest"`: Stryker chỉ chạy lại các test liên quan tới dòng bị mutate khi có thể.
- `thresholds.break: 0`: baseline không bị fail dù mutation score chưa cao.

### 3.3 Kết quả Jest

Lệnh chạy:

```powershell
npm test
```

Kết quả:

```text
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Ran all test suites.
```

### 3.4 Kết quả Stryker

Lệnh chạy:

```powershell
npm run mutation
```

Kết quả baseline:

| Chỉ số | Kết quả |
|---|---:|
| File được mutate | 1 |
| Tổng số mutant | 62 |
| Killed | 46 |
| Survived | 13 |
| Timeout | 0 |
| NoCoverage | 3 |
| Errors | 0 |
| Mutation score | 74.19% |
| Mutation score covered | 77.97% |

Report HTML:

```text
eshop-sut/backend/reports/mutation/mutation.html
```

## 4. Phụ lục - AI Usage Notes

Nhóm có sử dụng AI trong tuần này để hỗ trợ giải thích quy trình Jest/Stryker, ghi lại command log, tổ chức nội dung báo cáo và cập nhật hướng dẫn. AI không được dùng để tạo kết quả thí nghiệm giả. Các kết quả kỹ thuật trong báo cáo tuần 7 được lấy từ việc chạy thật `npm test` và `npm run mutation` trên project.

### 23127195 - Trần Mạnh Hùng

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI, dùng trong ứng dụng Codex desktop |
| Thời gian truy cập | 2026-07-11, khoảng 12:00-13:00 và các lần trao đổi bổ sung trong ngày |
| Prompt đã dùng | Yêu cầu cài Stryker, chạy baseline, giải thích vì sao backend không chạy được, giải thích `npm test`, `npm run mutation` và cách đọc Stryker report |
| Mục đích sử dụng | Hỗ trợ setup Jest/Stryker, tạo cấu hình baseline, giải thích workflow mutation testing và xử lý lỗi Git/npm phát sinh |
| Nội dung AI hỗ trợ tạo | File config Stryker, module baseline `orderLogic.js`, file test Jest, nội dung báo cáo kỹ thuật tuần 7 |
| Phần tự làm / kiểm chứng | Hùng chạy command thật trên máy, kiểm tra HTML report, xác nhận số liệu mutation score và trạng thái killed/survived/noCoverage |
| Bằng chứng | `package.json`, `stryker.config.mjs`, `orderLogic.test.js`, `mutation.html`, lịch sử chat trong Codex |

### 23127060 - Ninh Văn Khải

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI, dùng trong ứng dụng Codex desktop |
| Thời gian truy cập | 2026-07-11, trong quá trình đọc report tuần 7 |
| Prompt đã dùng | Hỏi cách nhận biết mutant survived trong HTML report, cách hiểu vùng đỏ/xanh/vàng và ý nghĩa "covered by tests yet still survived" |
| Mục đích sử dụng | Hiểu cách đọc Stryker report và phân loại mutant để chuẩn bị phân tích tuần 8 |
| Nội dung AI hỗ trợ tạo | Giải thích ý nghĩa killed, survived, timeout, noCoverage; gợi ý cách đọc từng mutant trong report |
| Phần tự làm / kiểm chứng | Khải đối chiếu lại trên file `mutation.html`, chọn các mutant thật trong `orderLogic.js` và ghi lại lý do sống sót |
| Bằng chứng | HTML report, bảng surviving mutants trong báo cáo tuần này |

### 23127259 - Nguyễn Tấn Thắng

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI, dùng trong ứng dụng Codex desktop |
| Thời gian truy cập | 2026-07-11, trong quá trình chuẩn bị báo cáo tuần 7 |
| Prompt đã dùng | Yêu cầu viết lại báo cáo tuần 7 theo format tuần 6 và tạo PDF tương ứng |
| Mục đích sử dụng | Chuẩn hóa format weekly report, ghi lại bằng chứng cài đặt/chạy Stryker, tạo file PDF để nộp |
| Nội dung AI hỗ trợ tạo | Bản viết lại `Group08_07.md`, bản PDF `Group08_07.pdf`, nội dung AI Usage Notes |
| Phần tự làm / kiểm chứng | Thắng kiểm tra lại nội dung trước khi nộp Moodle, đối chiếu với report HTML và file trong repo |
| Bằng chứng | `Group08_07.md`, `Group08_07.pdf`, `Group08_07.zip`, lịch sử chat trong Codex |

Link biểu mẫu AI Disclosure:
https://drive.google.com/file/d/1l6bO6fog1eM6K4_10oMshg5GawmEkr_o/view?usp=sharing

## 5. Công việc dự kiến cho tuần sau

### 23127195 - Trần Mạnh Hùng

- Viết thêm test để kill một số surviving mutants đã chọn.
- Ưu tiên các case:
  - giá sản phẩm âm;
  - shipping method `express`;
  - coupon `FREESHIP`;
  - boundary của free shipping.
- Chạy lại `npm test` và `npm run mutation`.
- So sánh mutation score trước/sau.

### 23127060 - Ninh Văn Khải

- Chọn 3-5 surviving mutants phù hợp để dùng cho demo.
- Phân tích từng mutant theo mẫu:
  - file;
  - dòng;
  - operator;
  - code gốc;
  - code mutant;
  - lý do survived;
  - test cần thêm.
- Chuẩn bị prompt AI để hỏi gợi ý assertion cho từng mutant.
- Ghi lại cả gợi ý đúng và gợi ý sai của AI.

### 23127259 - Nguyễn Tấn Thắng

- Cập nhật `User_Guide.md` với phần phân tích surviving mutants.
- Chuẩn bị ảnh chụp HTML report và command output.
- Bắt đầu viết outline cho screencast tuần 9.
- Cập nhật checklist đóng gói file nộp tuần 8.

## 6. Vấn đề phát sinh

| Vấn đề | Trạng thái | Cách xử lý / bước tiếp theo |
|---|---|---|
| Backend ban đầu chưa có test runner thật | Đã xử lý | Cài Jest và đổi script `npm test` thành `jest --runInBand` |
| Logic backend đang nằm trực tiếp trong `server.js` dưới dạng API routes | Đã có hướng xử lý tạm thời | Chọn module baseline `business/orderLogic.js`; tuần sau có thể tách logic thật từ API nếu cần |
| Một số dependency có warning hoặc vulnerability từ `npm audit` | Ghi nhận | Chưa chạy `npm audit fix` để tránh thay đổi baseline; xử lý riêng sau |
| Mutation testing toàn backend có thể chạy lâu | Đã xử lý | Giới hạn Stryker vào `business/orderLogic.js` |
| Còn 13 surviving mutants và 3 noCoverage mutants | Chưa xử lý xong | Tuần 8 thêm test và phân tích equivalent/near-equivalent mutants |

## 7. File bổ sung

- `Group08_07.md`
- `Group08_07.pdf`
- `Group08_07.zip`
- `User_Guide.md`
- `eshop-sut/backend/package.json`
- `eshop-sut/backend/package-lock.json`
- `eshop-sut/backend/stryker.config.mjs`
- `eshop-sut/backend/business/orderLogic.js`
- `eshop-sut/backend/__tests__/orderLogic.test.js`
- `eshop-sut/backend/reports/mutation/mutation.html`
