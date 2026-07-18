# Báo cáo Mutation Testing cho Product/Admin APIs

## 1. Phạm vi

- Người phụ trách: **23127259 - Nguyễn Tấn Thắng**.
- Source được mutate: `services/productService.js`.
- API test: `tests/admin-products.api.test.js`.
- Cấu hình Stryker: `stryker.product.config.mjs`.
- HTML report: `reports/mutation-product/mutation.html`.

Các handler được tách từ `server.js` và kiểm thử:

| Handler | API |
|---|---|
| `listProducts` | `GET /api/products` |
| `getProductById` | `GET /api/products/:id` |
| `createProduct` | `POST /api/products` |
| `updateProduct` | `PUT /api/products/:id` |
| `deleteProduct` | `DELETE /api/products/:id` |
| `importProducts` | `POST /api/admin/import-products` |
| `listAdminOrders` | `GET /api/admin/orders` |
| `updateAdminOrderStatus` | `PUT /api/admin/orders/:id/status` |

## 2. Lệnh chạy

Từ repository root:

```powershell
cd src\eshop-sut\backend
npm install
npm test
npm run mutation:product
```

Các mutation command khác hiện có:

```powershell
npm run mutation:auth
npm run mutation:order:baseline
npm run mutation:order
```

## 3. Kết quả Jest

Kết quả kiểm tra lại toàn bộ backend:

| Metric | Kết quả |
|---|---:|
| Test suites | 4 passed / 4 total |
| Tests | 52 passed / 52 total |
| Product/Admin tests dùng cho Stryker | 18 passed |
| Snapshots | 0 |

Nhóm test chính:

- Danh sách, tìm kiếm và chi tiết sản phẩm.
- CRUD sản phẩm và các nhánh database error.
- Kiểm tra sản phẩm không tồn tại và kiểu dữ liệu giá hiện tại.
- Xác thực, validation, giá trị mặc định và lỗi từng dòng khi import.
- Danh sách order của admin theo thứ tự mới nhất.
- Toàn bộ transition hợp lệ và không hợp lệ của order state machine.
- Order không tồn tại và các trạng thái kết thúc.

API tests chạy qua Express/Supertest và sử dụng fake database xác định trong
file test. Cách này giữ các assertion ở HTTP boundary, đồng thời tránh nhiều
Stryker worker cùng reset một file SQLite.

## 4. Cấu hình mutation

Phần quan trọng trong `stryker.product.config.mjs`:

```javascript
mutate: ["services/productService.js"],
testFiles: ["tests/admin-products.api.test.js"],
coverageAnalysis: "perTest",
```

Jest dùng `jest.product.config.cjs` để chỉ nạp product/admin test trong mỗi
mutant run. HTML report được xuất riêng, không ghi đè report auth hoặc order.

## 5. Kết quả Stryker

| Metric | Kết quả |
|---|---:|
| Tổng mutants | 185 |
| Mutation score | 100.00% |
| Covered mutation score | 100.00% |
| Killed | 165 |
| Timeout | 11 |
| Survived | 0 |
| No coverage | 0 |
| Errors | 9 |

`Survived = 0` và `No coverage = 0` cho thấy mọi mutation hợp lệ đều được test
phát hiện. Các mutant timeout hoặc runtime error cũng làm thay đổi hành vi quan
sát được và được Stryker ghi nhận; chúng vẫn được liệt kê riêng trong HTML
report để audit.

## 6. Cách test kill mutants

- Assert đầy đủ status code, response body, ID và message thay vì chỉ kiểm tra
  request thành công.
- Kiểm tra kết quả sau update/delete để phát hiện mutation ở SQL, params và ID.
- Dùng một sản phẩm không được sửa để phát hiện lỗi cập nhật nhầm nhiều record.
- Chạy cả nhánh tìm kiếm thành công và database error.
- Kiểm tra input import bị thiếu, sai kiểu, mảng rỗng, thiếu tên và lỗi insert.
- Kiểm tra thứ tự order và tên người đặt hàng trong admin list.
- Bao phủ từng trạng thái `pending`, `confirmed`, `shipping`, `delivered`,
  `canceled` với cả transition hợp lệ lẫn không hợp lệ.
- Assert những truy vấn không có placeholder phải nhận đúng mảng params rỗng.

## 7. Hành vi hiện tại của SUT được test ghi nhận

Việc refactor giữ nguyên logic từ `server.js` để có thể so sánh mutation. Các
test đang ghi nhận một số hành vi chưa đúng đặc tả:

- Product ID chẵn trả `price` dạng chuỗi, ID lẻ trả dạng số.
- Product không tồn tại trả HTTP `200` với object rỗng.
- Các route tạo/sửa/xóa product hiện chưa yêu cầu token admin.
- Import chấp nhận insert một phần thay vì rollback toàn bộ khi có dòng lỗi.
- Order ở trạng thái `canceled` vẫn có thể chuyển sang `delivered`.
- Search query hiện ghép trực tiếp từ khóa vào chuỗi SQL.

Các test này phục vụ mutation testing và mô tả hành vi thực tế; mutation score
100% không có nghĩa mọi yêu cầu nghiệp vụ đã được triển khai đúng.

## 8. Artifact

- Markdown report: `reports/mutation-product/README.md`.
- HTML report chi tiết: `reports/mutation-product/mutation.html`.
- Test source: `tests/admin-products.api.test.js`.
- Production source: `services/productService.js`.
