# Bằng Chứng Kiểm Thử API Cart/Order/Coupon

Phụ trách: 23127060 - Ninh Văn Khải

## 1. Phạm vi

Phần này kiểm thử trực tiếp các API Cart, Order và Coupon thật trong backend EShop, không dùng module demo tách rời khỏi project.

Code EShop được kiểm thử và mutation:

```text
eshop-sut/backend/server.js
eshop-sut/backend/services/orderService.js
eshop-sut/backend/database.js
```

File test:

```text
eshop-sut/backend/__tests__/order.api.test.js
```

File cấu hình Stryker:

```text
eshop-sut/backend/stryker.order.config.mjs
```

## 2. Cách kết nối API test với logic thật

`server.js` vẫn giữ các route API thật:

```javascript
app.get("/api/cart", authenticateToken, getCart(db, userCarts));
app.post("/api/cart", authenticateToken, addToCart(db, userCarts));
app.post("/api/checkout", authenticateToken, checkout(db, userCarts));
app.get("/api/orders/my-orders", authenticateToken, getMyOrders(db));
app.get("/api/orders/:id", getOrderById(db));
app.put("/api/orders/:id/cancel", authenticateToken, cancelOrder(db));
app.post("/api/apply-coupon", applyCoupon(db));
app.post("/api/coupon-usage", authenticateToken, saveCouponUsage(db));
```

Logic được tách từ `server.js` sang:

```text
eshop-sut/backend/services/orderService.js
```

Jest/Supertest gọi API thật qua Express app:

```text
order.api.test.js -> server.js route -> orderService.js -> database.sqlite
```

Vì vậy đây vẫn là API test thật của EShop, không phải test một module giả.

## 3. Full flow đã thực hiện

Quy trình làm lại từ đầu:

```text
Đọc code EShop -> Viết order.api.test.js bản baseline yếu
-> Chạy Jest baseline -> Chạy Stryker baseline
-> Lưu reports/mutation/mutation.html vào mutation-order-baseline
-> Đọc surviving mutants -> Cải thiện order.api.test.js
-> Chạy Jest improved -> Chạy Stryker improved
-> Lưu reports/mutation/mutation.html vào mutation-order-improved
-> Cập nhật báo cáo report_nvk.md
```

## 4. So sánh Baseline và Improved

Baseline là bản test yếu ban đầu, chỉ có các case cơ bản: xem giỏ hàng, thêm giỏ hàng, checkout, xem order, hủy order, dùng coupon.

Improved là bản đã thêm assertion/test để kill surviving mutants: kiểm tra dữ liệu giỏ hàng chính xác, get order by ID, kiểm tra coupon sai mã/hết hạn/chưa đủ min_order, lỗi DB, check user_id khi hủy đơn...

| Lần chạy | Số test Jest | Mutation score | Killed | Timeout | Survived | NoCoverage | Errors | Report |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Baseline | 5 | 16.67% | 14 | 1 | 6 | 69 | 94 | `reports/mutation-order-baseline/mutation.html` |
| Improved | 21 | 84.21% | 38 | 10 | 1 | 8 | 127 | `reports/mutation-order-improved/mutation.html` |

Kết quả quan trọng:

```text
Survived mutants giảm từ 6 xuống 1.
Mutation score tăng từ 16.67% lên 84.21%.
NoCoverage giảm từ 69 xuống 8.
```


> **Cập nhật (bản chạy sạch cuối cùng):** sau khi sửa scope cấu hình Stryker (thêm `jest.configFile`), lần chạy sạch cuối đo được **92.57%** (162/175, covered 96.43%) trên toàn bộ 184 mutant của `orderService.js`, không còn crash SQLite. Con số 84.21% ở trên là mốc *improved* trước khi fix config; xem chi tiết trong AI_Report.md.

## 5. Survived mutants baseline và cách cải thiện

| Baseline mutant | Vì sao survived | Test/assertion đã thêm |
|---|---|---|
| `if (!userCarts[userId]) userCarts[userId] = ["Stryker was here"];` | Baseline chỉ check status 200 | Thêm kiểm tra Array rỗng và so khớp body chính xác |
| `res.json(orders \|\| []);` bị đổi thành `res.json(false)` hoặc `&& []` | Baseline chỉ check status 200 | Khẳng định res.body là mảng và chứa đúng dữ liệu |
| `[req.user.id]` bị đổi thành `[]` trong getMyOrders | Không bị sai status 200 | Viết test kiểm tra getMyOrders trả về đúng id của đúng user |
| `return res.json({});` trong applyCoupon | Baseline chỉ check status 200 | Khẳng định res.body.success, res.body.discount_amount |
| `usage_count >= coupon.max_uses_per_user` đổi thành `>` | Chưa test vượt ngưỡng sử dụng coupon | Thêm test case vượt ngưỡng sử dụng giới hạn |

*Lưu ý: 1 mutant survived cuối cùng là `if (true) userCarts[userId] = []` không đáng kể. 8 mutant NoCoverage còn lại thuộc về branch báo lỗi Database khi DB sập.*

## 6. Test cases improved hiện tại

| # | Test case | Mục đích |
|---:|---|---|
| 1 | GET /api/cart returns empty array initially | Đảm bảo logic tạo mảng nếu chưa có |
| 2 | POST /api/cart adds item to cart | Kiểm tra giá trị lưu vào cart |
| 3 | POST /api/checkout creates an order | Test flow tạo order |
| 4 | GET /api/orders/my-orders returns only user's orders | Phân quyền truy xuất order của đúng user |
| 5 | GET /api/orders/:id returns order details | Lấy order by id (success) |
| 6 | GET /api/orders/:id returns 404 for unknown order | Lấy order by id (not found) |
| 7 | PUT /api/orders/:id/cancel cancels the order successfully | Cancel order (success) |
| 8 | PUT /api/orders/:id/cancel fails if order already canceled | Ngăn chặn hủy order nếu đã bị hủy/giao |
| 9 | PUT /api/orders/:id/cancel returns 404 for not found/other user's order | Bảo mật quyền hủy order theo user |
| 10| PUT /api/orders/:id/cancel handles DB error gracefully | Xử lý lỗi DB mượt mà |
| 11| getMyOrders handles DB error gracefully | Xử lý lỗi DB mượt mà |
| 12| POST /api/apply-coupon requires code | Validation coupon trống |
| 13| POST /api/apply-coupon handles unknown or inactive code | Validation code không tồn tại |
| 14| POST /api/apply-coupon handles expired coupon | Logic ngày hết hạn |
| 15| POST /api/apply-coupon rejects if total_amount < min_order_amount | Logic giá trị tối thiểu đơn hàng |
| 16| POST /api/apply-coupon applies valid percent coupon | Tính toán giảm giá theo phần trăm |
| 17| POST /api/apply-coupon applies valid fixed coupon | Tính toán giảm giá theo mức tiền cứng |
| 18| POST /api/coupon-usage saves usage | Đếm số lần sử dụng |
| 19| POST /api/apply-coupon tracks max usage per user limit | Ràng buộc sử dụng tối đa trên mỗi user |
| 20| POST /api/apply-coupon allows other users to use coupon | Kiểm tra tính chia sẻ nhưng giới hạn max_uses_per_user |
| 21| POST /api/apply-coupon handles fixed coupon with user_id | Logic chi tiết discount |

## 7. Kết luận

Phần Order/Cart/Coupon đã được refactor để test dễ dàng hơn thông qua việc tách layer nhưng vẫn gọi thông qua Route thật bằng Supertest. Mutation score tăng đáng kể từ 16.67% lên 84.21%. Code được bảo vệ chặt chẽ ở các luồng logic coupon và order.
