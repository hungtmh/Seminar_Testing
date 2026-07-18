/**
 * Cart + Coupon + Checkout/Order API handlers.
 *
 * Owner: 23127060 - Ninh Van Khai
 */

function getCart(_db, userCarts) {
  return (req, res) => {
    const userId = req.user.id;
    if (!userCarts[userId]) userCarts[userId] = [];
    res.json(userCarts[userId]);
  };
}

function addToCart(_db, userCarts) {
  return (req, res) => {
    const userId = req.user.id;
    if (!userCarts[userId]) userCarts[userId] = [];
    userCarts[userId].push(req.body);
    res.json({ message: "Added to cart" });
  };
}

function checkout(db, _userCarts) {
  return (req, res) => {
    const userId = req.user.id;
    const { total_amount, shipping_address } = req.body;

    db.run(
      "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)",
      [userId, total_amount, "pending", shipping_address],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Checkout successful", orderId: this.lastID });
      },
    );
  };
}

function getMyOrders(db) {
  return (req, res) => {
    db.all(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
      [req.user.id],
      (err, orders) => {
        res.json(orders);
      },
    );
  };
}

function cancelOrder(db) {
  return (req, res) => {
    db.get(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
      (err, order) => {
        if (!order) return res.status(404).json({ error: "Order not found" });

        if (order.status === "delivered" || order.status === "canceled") {
          return res.status(400).json({ error: "Cannot cancel this order." });
        }

        db.run(
          "UPDATE orders SET status = ? WHERE id = ?",
          ["canceled", req.params.id],
          function (err) {
            res.json({ message: "Order canceled successfully" });
          },
        );
      },
    );
  };
}

function getOrderById(db) {
  return (req, res) => {
    db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, order) => {
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    });
  };
}

function applyCoupon(db) {
  return (req, res) => {
    const { code, total_amount, user_id } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Vui lòng nhập mã giảm giá" });
    }

    db.get(
      "SELECT * FROM coupons WHERE code = ? AND is_active = 1",
      [code],
      (err, coupon) => {
        if (!coupon) {
          return res
            .status(404)
            .json({ error: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" });
        }

        if (total_amount > coupon.min_order_amount) {
          const now = new Date();
          const expiry = new Date(coupon.expired_at);
          if (expiry < now) {
            return res.status(400).json({ error: "Mã giảm giá đã hết hạn" });
          }

          if (user_id) {
            db.get(
              "SELECT COUNT(*) as usage_count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?",
              [coupon.id, user_id],
              (err, result) => {
                if (result.usage_count >= coupon.max_uses_per_user) {
                  return res.status(400).json({
                    error: `Bạn đã sử dụng mã này ${coupon.max_uses_per_user} lần (đã đạt giới hạn)`,
                  });
                }

                let discount_amount = 0;
                if (coupon.type === "percent") {
                  discount_amount = Math.floor(
                    total_amount * (1 - coupon.discount_value),
                  );
                } else {
                  discount_amount = coupon.discount_value;
                }

                const final_amount = total_amount - discount_amount;
                return res.json({
                  success: true,
                  coupon_id: coupon.id,
                  discount_amount,
                  final_amount,
                  message: `Áp dụng thành công! Giảm ${coupon.type === "percent" ? coupon.discount_value + "%" : coupon.discount_value.toLocaleString() + " ₫"}`,
                });
              },
            );
          } else {
            let discount_amount = 0;
            if (coupon.type === "percent") {
              discount_amount = Math.floor(
                total_amount * (1 - coupon.discount_value),
              );
            } else {
              discount_amount = coupon.discount_value;
            }
            const final_amount = total_amount - discount_amount;
            return res.json({
              success: true,
              coupon_id: coupon.id,
              discount_amount,
              final_amount,
              message: `Áp dụng thành công! Giảm ${coupon.type === "percent" ? coupon.discount_value + "%" : coupon.discount_value.toLocaleString() + " ₫"}`,
            });
          }
        } else {
          return res.status(400).json({
            error: `Đơn hàng chưa đủ giá trị tối thiểu ${coupon.min_order_amount.toLocaleString()} ₫ để áp dụng mã này`,
          });
        }
      },
    );
  };
}

function saveCouponUsage(db) {
  return (req, res) => {
    const { coupon_id } = req.body;
    db.run(
      "INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)",
      [coupon_id, req.user.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usage recorded" });
      },
    );
  };
}

module.exports = {
  getCart,
  addToCart,
  checkout,
  getMyOrders,
  cancelOrder,
  getOrderById,
  applyCoupon,
  saveCouponUsage,
};
