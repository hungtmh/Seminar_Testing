# Bằng Chứng Kiểm Thử API Product/Admin

Phụ trách: 23127259 - Nguyễn Tấn Thắng

## 1. Phạm vi

Phần này kiểm thử trực tiếp các API Product/Admin thật trong backend EShop, không dùng module demo tách rời khỏi project.

Code EShop được kiểm thử và mutation:
```text
eshop-sut/backend/server.js
eshop-sut/backend/services/productService.js
eshop-sut/backend/database.js
```

File test:
```text
eshop-sut/backend/tests/admin-products.api.test.js
```

File cấu hình Stryker:
```text
eshop-sut/backend/stryker.product.config.mjs
```

## 2. Cách kết nối API test với logic thật

`server.js` vẫn giữ các route API thật:
```javascript
app.get("/api/products", listProducts(db));
app.get("/api/products/:id", getProductById(db));
app.post("/api/products", createProduct(db));
app.put("/api/products/:id", updateProduct(db));
app.delete("/api/products/:id", deleteProduct(db));
app.post("/api/admin/import-products", authenticateToken, importProducts(db));
app.get("/api/admin/orders", authenticateToken, listAdminOrders(db));
app.put("/api/admin/orders/:id/status", authenticateToken, updateAdminOrderStatus(db));
```

Logic Product/Admin được tách từ `server.js` sang:
```text
eshop-sut/backend/services/productService.js
```

Jest/Supertest gọi API thật qua Express app:
```text
admin-products.api.test.js -> server.js route -> productService.js -> database.sqlite
```

Vì vậy đây vẫn là API test thật của EShop, không phải test một module giả.

## 3. Full flow đã thực hiện

Quy trình làm lại từ đầu:
```text
Đọc code EShop -> Viết admin-products.api.baseline.test.js bản baseline yếu
-> Chạy Jest baseline -> Chạy Stryker baseline
-> Lưu reports/mutation-product-baseline/mutation.html
-> Đọc surviving mutants -> Cải thiện admin-products.api.test.js
-> Chạy Jest improved -> Chạy Stryker improved
-> Lưu reports/mutation-product/mutation.html
-> Cập nhật báo cáo và PDF
```

## 4. Lệnh đã chạy

Chạy Jest improved:
```powershell
cd eshop-sut\backend
npm test
```

Kết quả:
```text
Test Suites: 5 passed, 5 total
Tests:       73 passed, 73 total
```

Chạy Stryker improved:
```powershell
npm run mutation:product
```

## 5. Cấu hình Stryker

File:
```text
eshop-sut/backend/stryker.product.config.mjs
```

Nội dung chính:
```javascript
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  mutate: ["services/productService.js"],
  testFiles: ["tests/admin-products.api.test.js"],
  coverageAnalysis: "perTest",
  thresholds: {
    high: 90,
    low: 70,
    break: 0,
  },
  timeoutMS: 10000,
};
```

## 6. So sánh Baseline và Improved

Baseline là bản test yếu ban đầu, chỉ test HTTP 200 đơn giản.
Improved là bản đã thêm assertion/test để kill surviving mutants: kiểm tra validation, test import fail, trạng thái order chuyển đổi sai logic.

| Lần chạy | Số test Jest | Mutation score | Killed | Timeout | Survived | NoCoverage | Errors | Report |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Baseline | 5 | 45.20% | 85 | 0 | 50 | 45 | 5 | `reports/mutation-product-baseline/mutation.html` |
| Improved | 18 | 100.00% | 165 | 11 | 0 | 0 | 9 | `reports/mutation-product/mutation.html` |

Kết quả quan trọng:
```text
Survived mutants giảm từ 50 xuống 0.
Mutation score tăng từ 45.20% lên 100.00%.
NoCoverage giảm từ 45 xuống 0.
```

## 7. Survived mutants baseline và cách cải thiện

| Baseline mutant | Vì sao survived | Test/assertion đã thêm |
|---|---|---|
| `if (!row)` trong getProductById đổi thành `if (true)` | Baseline không test sản phẩm không tồn tại | Thêm test `returns an empty object when a product does not exist` |
| `row.id % 2 === 0` đổi thành `!== 0` | Baseline chỉ test 1 sản phẩm ngẫu nhiên, không check ID chẵn/lẻ | Thêm test kiểm tra giá trị price bị đổi thành string dựa trên ID chẵn lẻ |
| Thiếu test logic `status === "canceled"` chuyển sang `delivered` | Baseline không test order state machine | Bổ sung test case kiểm tra transition hợp lệ và không hợp lệ |
| Thay đổi câu query SQL (xóa `%` trong `LIKE`) | Baseline chỉ truyền biến tĩnh không verify tính chính xác | Bổ sung mock test `FAIL_SEARCH` để verify error handling logic |

## 8. Test cases improved hiện tại

File:
```text
eshop-sut/backend/tests/admin-products.api.test.js
```

Bộ test bao phủ:
1. Danh sách, tìm kiếm và chi tiết sản phẩm.
2. CRUD sản phẩm và các nhánh database error.
3. Kiểm tra sản phẩm không tồn tại và kiểu dữ liệu giá hiện tại.
4. Xác thực, validation, giá trị mặc định và lỗi từng dòng khi import.
5. Danh sách order của admin theo thứ tự mới nhất.
6. Toàn bộ transition hợp lệ và không hợp lệ của order state machine.
7. Order không tồn tại và các trạng thái kết thúc.

## 9. Kết luận

Phần Product/Admin đã được làm lại đúng full flow từ đầu. Baseline ban đầu cho ra nhiều surviving mutant. Nhờ việc viết lại test bằng Jest + Supertest cover đầy đủ các nhánh lỗi database và boundary logic (như check ID chẵn/lẻ của SUT), file test hiện tại đã diệt sạch 100% mutant của `services/productService.js`.


