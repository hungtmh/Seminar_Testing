# Hoạt Động Lớp: "Kill The Mutant" (25 phút)

**Chủ đề:** T10 - Mutation Testing & Test Effectiveness
**Nhóm phụ trách:** Nhóm 08 (Hùng, Khải, Thắng) · **Soạn:** 23127060 - Ninh Văn Khải

---

## Mục tiêu

Bạn là QA Engineer. Dưới đây là **5 mutant** do Stryker sinh ra từ logic EShop (module API `orderService.js` và module tính giá `orderLogic.js`). Nhiệm vụ: **viết Assertion (Jest hoặc giả mã)** để phát hiện và tiêu diệt (Kill) từng mutant.

## Quy tắc (25 phút)

- **10 phút:** thảo luận nhóm, viết 5 assertion ra giấy/file.
- **5 phút:** tráo bài với nhóm bên cạnh để review chéo.
- **10 phút:** Nhóm 08 chạy thử assertion của các bạn trên hệ thống thật — nhóm kill được nhiều nhất thắng.

---

## Danh sách Mutants (5 mutant tốt nhất — gộp từ cả hai module)

### Mutant 1 — Khởi tạo giỏ hàng bị bẩn *(orderService.js)*
- **Code gốc:** `if (!userCarts[userId]) userCarts[userId] = [];`
- **Mutant:** `if (!userCarts[userId]) userCarts[userId] = ["Stryker was here"];`
- **Gợi ý:** GET giỏ hàng của user mới — làm sao biết giỏ đang trống?
- **Assertion của bạn:** `expect(............);`

### Mutant 2 — Lộ đơn hàng của user khác (bảo mật) *(orderService.js)*
- **Code gốc:** `const userOrders = orders.filter(o => o.user_id === req.user.id);`
- **Mutant:** `... o.user_id !== req.user.id`
- **Gợi ý:** GET đơn hàng — làm sao chắc mọi đơn trả về đúng là của chính bạn?
- **Assertion của bạn:** `expect(............);`

### Mutant 3 — Điều kiện giới hạn Coupon lỏng lẻo *(orderService.js — Boundary Value)*
- **Code gốc:** `if (usage_count >= coupon.max_uses_per_user) return res.status(400);`
- **Mutant:** `if (usage_count > coupon.max_uses_per_user) return res.status(400);`
- **Gợi ý:** phải test tại `usage_count` bằng đúng bao nhiêu thì mới bẻ gãy được mutant?
- **Assertion của bạn:** `expect(............);`

### Mutant 4 — Tính sai giá trị giảm giá *(orderService.js)*
- **Code gốc:** `let discount = (coupon.discount_percent / 100) * total_amount;`
- **Mutant:** `let discount = (coupon.discount_percent * 100) * total_amount;`
- **Gợi ý:** đơn 100k, mã giảm 10% → bạn mong đợi số tiền giảm là bao nhiêu?
- **Assertion của bạn:** `expect(............);`

### Mutant 5 — Bỏ qua kiểm tra giá âm *(orderLogic.js — Boundary Value)*
- **Code gốc:** `if (item.price < 0) throw new Error("Invalid price");`
- **Mutant:** `if (item.price <= 0) throw new Error("Invalid price");`
- **Gợi ý:** giá bằng đúng `0` thì hợp lệ hay không? Test ở giá trị biên nào?
- **Assertion của bạn:** `expect(............);`

---

## ĐÁP ÁN (Dành cho Quản trò — Nhóm 08)

<details>
<summary>Nhấn để xem đáp án chấm điểm</summary>

1. **Mutant 1:** `expect(res.body).toEqual([]);` hoặc `expect(res.body.length).toBe(0);`
2. **Mutant 2:** `res.body.forEach(o => expect(o.user_id).toBe(myUserId));`
3. **Mutant 3:** mô phỏng user đã dùng đủ `max_uses_per_user`, gọi apply-coupon lần nữa → `expect(res.status).toBe(400);`
4. **Mutant 4:** đơn 100k, giảm 10% → `expect(res.body.discount_amount).toBe(10000);`
5. **Mutant 5:** truyền sản phẩm giá `0` và khẳng định KHÔNG bị ném lỗi (giá 0 vẫn hợp lệ) → `expect(() => calc(cartWithZeroPrice)).not.toThrow();`

</details>

> **Ghi chú tính nhất quán:** Mutant 1–4 lấy từ module API thật `orderService.js` (khớp báo cáo chính); Mutant 5 lấy từ module tính giá `orderLogic.js` dùng ở baseline tuần 7 — cả hai đều thuộc backend EShop.
