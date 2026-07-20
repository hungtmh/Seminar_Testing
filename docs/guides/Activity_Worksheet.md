# Hoạt Động Lớp: "Kill The Mutant" (25 phút)

**Chủ đề:** T10 - Mutation Testing & Test Effectiveness  
**Nhóm phụ trách:** Nhóm 8 (Hùng, Khải, Thắng)

---

## Mục tiêu

Bạn sẽ đóng vai trò là QA Engineer. Dưới đây là 5 đoạn code đã bị "đột biến" (Mutant) bởi công cụ Stryker. Nhiệm vụ của nhóm bạn là **viết Assertion (bằng giả mã hoặc Jest)** để phát hiện và tiêu diệt (Kill) những mutant này.

## Quy tắc (25 Phút)

- **10 phút đầu:** Thảo luận nhóm và viết 5 Assertion ra giấy/file.
- **5 phút tiếp theo:** Tráo đổi bài với nhóm bên cạnh để review chéo (Cross-review).
- **10 phút cuối:** Nhóm 8 sẽ chạy thử Assertion của các bạn trên hệ thống thật để xem Mutant có chết không! Nhóm nào "Kill" được nhiều nhất sẽ chiến thắng.

---

## Danh sách Mutants (Trích xuất từ Module Order & Coupon)

### Mutant 1: Khởi tạo giỏ hàng bị lỗi

- **Code gốc:** `if (!userCarts[userId]) userCarts[userId] = [];`
- **Mutant:** `if (!userCarts[userId]) userCarts[userId] = ["Stryker was here"];`
- **Gợi ý:** Nếu bạn gọi GET api lấy giỏ hàng của user mới tinh, làm sao để biết giỏ hàng lúc mới tạo có đang trống hay không?
- **Assertion của bạn:**
  > `expect(.............................................);`

### Mutant 2: API trả về sai kiểu dữ liệu

- **Code gốc:** `res.json(orders || []);`
- **Mutant:** `res.json(orders && []);`
- **Gợi ý:** Nếu biến `orders` rỗng/undefined, API sẽ trả về gì do lỗi của Mutant?
- **Assertion của bạn:**
  > `expect(.............................................);`

### Mutant 3: Lỗi bảo mật lộ mã người dùng

- **Code gốc:** `const userOrders = orders.filter(o => o.user_id === req.user.id);`
- **Mutant:** `const userOrders = orders.filter(o => o.user_id !== req.user.id);`
- **Gợi ý:** Bạn gửi GET request xem đơn hàng, làm sao chắc chắn các đơn hàng trả về đúng là của chính bạn?
- **Assertion của bạn:**
  > `expect(.............................................);`

### Mutant 4: Điều kiện áp dụng Coupon bị lỏng lẻo

- **Code gốc:** `if (usage_count >= coupon.max_uses_per_user) return res.status(400);`
- **Mutant:** `if (usage_count > coupon.max_uses_per_user) return res.status(400);`
- **Gợi ý:** Lỗi kiểm thử biên (Boundary Value). Bạn phải test ở mức `usage_count` bằng bao nhiêu thì mới bẻ gãy được logic của Mutant này?
- **Assertion của bạn:**
  > `expect(.............................................);`

### Mutant 5: Coupon giảm giá sai giá trị

- **Code gốc:** `let discount = (coupon.discount_percent / 100) * total_amount;`
- **Mutant:** `let discount = (coupon.discount_percent * 100) * total_amount;`
- **Gợi ý:** Nếu mua đơn hàng 100k, mã giảm 10%, bạn mong đợi API tính ra số tiền giảm là bao nhiêu?
- **Assertion của bạn:**
  > `expect(.............................................);`

---

## ĐÁP ÁN (Dành riêng cho Quản trò - Nhóm 8)

<details>
<summary>Nhấn vào đây để xem đáp án chấm điểm</summary>

1. **Mutant 1:** Kiểm tra mảng trả về phải rỗng.  
   `expect(res.body.length).toBe(0);` hoặc `expect(res.body).toEqual([]);`
2. **Mutant 2:** Khẳng định kiểu trả về là Array hợp lệ (Mutant sẽ làm trả về false hoặc lỗi crash).  
   `expect(Array.isArray(res.body)).toBe(true);`
3. **Mutant 3:** Vòng lặp kiểm tra toàn bộ ID trả về phải khớp với ID của mình.  
   `res.body.forEach(order => expect(order.user_id).toBe(req.user.id));`
4. **Mutant 4:** Test đúng tại điểm ranh giới (Boundary).  
   _Mô phỏng user đã xài đủ số lần max_uses, sau đó gọi apply-coupon lần nữa:_  
   `expect(res.status).toBe(400);`
5. **Mutant 5:** Kiểm tra phép toán logic.  
 `expect(res.body.discount_amount).toBe(10000);` (Giả sử tổng bill 100k, giảm 10%)
</details>
