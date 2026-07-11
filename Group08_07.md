# Group08_07 - Báo cáo tuần 7: Cài Stryker và chạy baseline

## 1. Mục tiêu tuần 7

Cài Stryker trên backend EShop, xác nhận Jest chạy được, cấu hình mutation testing với scope nhỏ và sinh baseline mutation report đầu tiên cho module order/checkout business logic.

## 2. Kết quả hoàn thành

| Milestone | Trạng thái | Bằng chứng |
|---|---|---|
| Cài Stryker thành công | Hoàn thành | `@stryker-mutator/core@9.6.1`, `@stryker-mutator/jest-runner@9.6.1` trong `package.json` |
| Xác nhận Jest chạy được | Hoàn thành | `npm test`: 1 test suite passed, 6 tests passed |
| Tạo file `stryker.config.mjs` | Hoàn thành | `eshop-sut/backend/stryker.config.mjs` |
| Sinh mutation report scope nhỏ | Hoàn thành | `eshop-sut/backend/reports/mutation/mutation.html` |
| Lưu ít nhất 5 surviving mutants | Hoàn thành | Bảng phân tích ở mục 8 |

## 3. Phạm vi baseline

Backend EShop ban đầu chưa có test runner thật. Script `npm test` cũ chỉ in lỗi `Error: no test specified`, vì vậy nhóm bổ sung Jest và tạo một module business logic nhỏ để mutation testing có dữ liệu thật.

Module được chọn:

```text
eshop-sut/backend/business/orderLogic.js
```

Lý do chọn module này:

- Gần với nghiệp vụ checkout/order của EShop.
- Có logic tính subtotal, discount, shipping fee, tax và total.
- Dễ tạo mutant rõ ràng để giải thích trong seminar.
- Scope nhỏ nên Stryker chạy nhanh, phù hợp baseline tuần 7.

## 4. Các file đã thêm/cập nhật

```text
eshop-sut/backend/package.json
eshop-sut/backend/package-lock.json
eshop-sut/backend/.gitignore
eshop-sut/backend/business/orderLogic.js
eshop-sut/backend/__tests__/orderLogic.test.js
eshop-sut/backend/stryker.config.mjs
eshop-sut/backend/reports/mutation/mutation.html
User_Guide.md
Group08_07.md
```

## 5. Lệnh đã chạy

Ví dụ dưới đây dùng PowerShell theo máy nộp bài. Nếu dùng macOS/Linux, thay `\` bằng `/` và chạy cùng thứ tự lệnh.

Chạy tại repository root:

```powershell
cd D:\Seminar\Seminar_Testing
```

Kiểm tra backend:

```powershell
Get-ChildItem -Force eshop-sut\backend
Get-Content eshop-sut\backend\package.json
node -v
npm -v
```

Cài Jest và Stryker:

```powershell
cd eshop-sut\backend
npm install --save-dev jest @stryker-mutator/core @stryker-mutator/jest-runner
```

Chạy Jest:

```powershell
npm test
```

Chạy Stryker baseline:

```powershell
npm run mutation
```

Kiểm tra report và trạng thái Git:

```powershell
Get-ChildItem -Recurse reports\mutation
git status --short
```

Lệnh tương đương trên macOS/Linux:

```bash
cd eshop-sut/backend
npm install
npm test
npm run mutation
ls -R reports/mutation
git status --short
```

## 6. Cấu hình Stryker

File: `eshop-sut/backend/stryker.config.mjs`

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

Ý nghĩa cấu hình:

| Thuộc tính | Ý nghĩa |
|---|---|
| `testRunner: "jest"` | Dùng Jest để chạy test cho từng mutant |
| `reporters` | Xuất report HTML và output console |
| `mutate` | Chỉ mutate `business/orderLogic.js` để scope nhỏ |
| `coverageAnalysis: "perTest"` | Dùng coverage theo từng test để tối ưu số test chạy lại |
| `thresholds.break: 0` | Không fail command baseline dù mutation score còn thấp |
| `timeoutMS: 10000` | Giới hạn thời gian chạy mỗi mutant |

## 7. Kết quả Jest và Stryker

### 7.1 Jest baseline

Kết quả `npm test`:

```text
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        0.191 s
Ran all test suites.
```

### 7.2 Stryker baseline

Kết quả `npm run mutation`:

```text
Found 1 of 10 file(s) to be mutated.
Instrumented 1 source file(s) with 62 mutant(s)
Initial test run succeeded. Ran 6 tests in 0 seconds.
Ran 2.42 tests per mutant on average.
```

Bảng mutation score:

| File | Mutation score total | Mutation score covered | Killed | Timeout | Survived | NoCoverage | Errors |
|---|---:|---:|---:|---:|---:|---:|---:|
| `business/orderLogic.js` | 74.19% | 77.97% | 46 | 0 | 13 | 3 | 0 |

Report HTML:

```text
eshop-sut/backend/reports/mutation/mutation.html
```

## 8. Phân tích 5 surviving mutants

| # | File/dòng | Operator | Mutant thay đổi | Trạng thái | Nhận xét |
|---:|---|---|---|---|---|
| 1 | `business/orderLogic.js:10` | ConditionalExpression | `if (item.price < 0)` thành `if (false)` | Survived | Test hiện có chưa kiểm tra trường hợp giá âm, nên mutant bỏ qua validation vẫn sống. |
| 2 | `business/orderLogic.js:10` | EqualityOperator | `item.price < 0` thành `item.price <= 0` | Survived | Chưa có test cho sản phẩm giá `0`, nên boundary giữa `< 0` và `<= 0` chưa bị phát hiện. |
| 3 | `business/orderLogic.js:35` | LogicalOperator | `couponCode === "FREESHIP" || !couponCode` thành `couponCode === "FREESHIP" && !couponCode` | Survived | Test chưa kiểm tra rõ coupon `FREESHIP`, nên thay đổi logic OR/AND không làm test fail. |
| 4 | `business/orderLogic.js:35` | EqualityOperator | `couponCode === "FREESHIP"` thành `couponCode !== "FREESHIP"` | Survived | Nhánh `FREESHIP` trả về `0` giống fallback hiện tại, nên có khả năng là equivalent/near-equivalent mutant trong thiết kế hiện tại. |
| 5 | `business/orderLogic.js:41` | StringLiteral | default `shippingMethod = "standard"` thành `shippingMethod = ""` | Survived | Test gọi mặc định vẫn nhận phí standard vì logic fallback cuối trả `30000`; cần test diễn đạt rõ default behavior hoặc cân nhắc mutant tương đương. |
| 6 | `business/orderLogic.js:42` | ConditionalExpression | `if (shippingMethod === "express")` thành `if (false)` | Survived | Chưa có test cho shipping express, nên phí express `45000` chưa được bảo vệ. |
| 7 | `business/orderLogic.js:42` | StringLiteral | `"express"` thành `""` | Survived | Tương tự mutant #6: thiếu test kiểm tra express shipping. |

Nhóm chọn 7 mutant để có dư dữ liệu; yêu cầu tối thiểu 5 mutant đã đạt.

## 9. NoCoverage mutants

Stryker ghi nhận 3 noCoverage mutants:

| File/dòng | Mutant | Ý nghĩa |
|---|---|---|
| `business/orderLogic.js:10-12` | Bỏ block xử lý `item.price < 0` | Không có test chạy qua nhánh price âm |
| `business/orderLogic.js:11` | Thay message lỗi price âm bằng chuỗi rỗng | Không có test assert lỗi price âm |
| `business/orderLogic.js:42-44` | Bỏ block express shipping | Không có test chạy qua nhánh express |

## 10. Ý nghĩa các trạng thái mutant

| Trạng thái | Ý nghĩa | Cách xử lý |
|---|---|---|
| Killed | Ít nhất một test fail khi code bị mutate. Đây là dấu hiệu test bắt được lỗi. | Giữ lại test hiện có. |
| Survived | Tất cả test vẫn pass dù code bị mutate. Đây là dấu hiệu test còn thiếu assertion hoặc thiếu case. | Thêm test hoặc phân tích equivalent mutant. |
| Timeout | Test chạy quá lâu hoặc treo khi gặp mutant. | Kiểm tra logic vòng lặp/async và timeout. |
| NoCoverage | Không có test nào chạy qua vùng code chứa mutant. | Thêm test để cover nhánh chưa được chạy. |

## 11. Lỗi/cảnh báo gặp phải

| Vấn đề | Mức độ | Cách xử lý tuần 7 |
|---|---|---|
| Backend chưa có test runner thật | Quan trọng | Thêm Jest và script `npm test` |
| `npm install` có warning deprecated dependency | Trung bình | Ghi nhận trong report, chưa đổi dependency ngoài phạm vi |
| `npm audit` báo vulnerability trong dependency tree | Trung bình/cao | Ghi nhận để xử lý riêng sau baseline, chưa chạy `npm audit fix` |
| Stryker scope toàn backend có thể chạy lâu | Quan trọng | Giới hạn `mutate` vào `business/orderLogic.js` |

Ghi chú của Nguyễn Tấn Thắng:

- Đã cập nhật `User_Guide.md` mục 3 với các bước cài đặt thực tế trên `eshop-sut/backend`.
- Đã cập nhật `User_Guide.md` mục 4 với cách chạy `npm test`, `npm run mutation` và cách đọc HTML report.
- Đã ghi nhận các lỗi/cảnh báo không xử lý ngay trong tuần 7 để tránh làm lệch baseline.
- Đã chuẩn bị checklist file cần có trong `Group08_07.zip`.

## 12. Hướng dẫn chạy lại cho thành viên khác

Từ repository root:

```powershell
cd eshop-sut\backend
npm install
npm test
npm run mutation
```

Sau khi chạy xong, mở HTML report:

```text
eshop-sut/backend/reports/mutation/mutation.html
```

Nếu dùng PowerShell:

```powershell
Start-Process .\reports\mutation\mutation.html
```

Checklist đóng gói tuần 7:

```text
Group08_07.md
User_Guide.md
eshop-sut/backend/package.json
eshop-sut/backend/package-lock.json
eshop-sut/backend/.gitignore
eshop-sut/backend/stryker.config.mjs
eshop-sut/backend/business/orderLogic.js
eshop-sut/backend/__tests__/orderLogic.test.js
eshop-sut/backend/reports/mutation/mutation.html
```

## 13. Phân công và bằng chứng

| Thành viên | Nhiệm vụ | Kết quả/bằng chứng |
|---|---|---|
| 23127195 - Trần Mạnh Hùng | Setup backend EShop; cài Stryker; tạo config; chạy baseline mutation test | `package.json`, `package-lock.json`, `stryker.config.mjs`, HTML report |
| 23127060 - Ninh Văn Khải | Đọc report; phân loại mutant; chọn surviving mutants | Bảng mục 8 và mục 9 |
| 23127259 - Nguyễn Tấn Thắng | Ghi lại bước cài đặt/lỗi; cập nhật User Guide; chuẩn bị report tuần 7 | `User_Guide.md`, `Group08_07.md`, `Group08_07.zip` |

## 14. Kết luận

Tuần 7 đã hoàn thành baseline mutation testing trên EShop backend. Stryker chạy được, Jest chạy được, HTML report có dữ liệu thật và nhóm có đủ surviving mutants để phân tích trong tuần 8.

Baseline hiện tại đạt mutation score 74.19%, cho thấy test suite ban đầu đã kill được phần lớn mutant cơ bản nhưng vẫn còn thiếu test cho price âm, coupon `FREESHIP` và express shipping.
