const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  authenticateToken,
  getCurrentUser,
  updateCurrentUser,
} = require("./services/authService");
const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  listAdminOrders,
  updateAdminOrderStatus,
} = require("./services/productService");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const userCarts = {};

// ==========================================
// AUTHENTICATION APIS
// ==========================================

app.post("/api/register", registerUser(db));
app.post("/api/login", loginUser(db));
app.post("/api/forgot-password", forgotPassword(db));
app.post("/api/reset-password", resetPassword(db));
app.get("/api/users/me", authenticateToken, getCurrentUser(db));
app.put("/api/users/me", authenticateToken, updateCurrentUser(db));

// ==========================================
// PRODUCT APIS
// ==========================================

app.get("/api/products", listProducts(db));
app.get("/api/products/:id", getProductById(db));
app.post("/api/products", createProduct(db));
app.put("/api/products/:id", updateProduct(db));
app.delete("/api/products/:id", deleteProduct(db));

// Import products from CSV (parsed on frontend, sent as JSON array)
app.post(
  "/api/admin/import-products",
  authenticateToken,
  importProducts(db),
);

app.get("/api/categories", (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    res.json(rows);
  });
});

app.post("/api/categories", authenticateToken, (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO categories (name) VALUES (?)", [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category created", id: this.lastID });
  });
});

app.put("/api/categories/:id", authenticateToken, (req, res) => {
  const { name } = req.body;
  db.run(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Category updated" });
    },
  );
});

app.delete("/api/categories/:id", authenticateToken, (req, res) => {
  db.run(
    "DELETE FROM categories WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Category deleted" });
    },
  );
});

// ==========================================
// CART & CHECKOUT APIS
// ==========================================

app.get("/api/cart", authenticateToken, (req, res) => {
  const userId = req.user.id;
  if (!userCarts[userId]) userCarts[userId] = [];
  res.json(userCarts[userId]);
});

app.post("/api/cart", authenticateToken, (req, res) => {
  const userId = req.user.id;
  if (!userCarts[userId]) userCarts[userId] = [];
  userCarts[userId].push(req.body);
  res.json({ message: "Added to cart" });
});

app.post("/api/checkout", authenticateToken, (req, res) => {
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
});

app.get("/api/orders/my-orders", authenticateToken, (req, res) => {
  db.all(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
    [req.user.id],
    (err, orders) => {
      res.json(orders);
    },
  );
});

app.put("/api/orders/:id/cancel", authenticateToken, (req, res) => {
  db.get(
    "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err, order) => {
      if (!order) return res.status(404).json({ error: "Order not found" });

      // Lẽ ra phải là: if (order.status !== 'pending' && order.status !== 'confirmed')
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
});

app.get("/api/orders/:id", (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, order) => {
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });
});

// ==========================================
// COUPON APIS
// ==========================================

// GET all coupons (public - for admin display)
app.get("/api/coupons", authenticateToken, (req, res) => {
  db.all("SELECT * FROM coupons", [], (err, rows) => {
    res.json(rows);
  });
});

// POST apply-coupon
app.post("/api/apply-coupon", (req, res) => {
  const { code, total_amount, user_id } = req.body;

  if (!code)
    return res.status(400).json({ error: "Vui lòng nhập mã giảm giá" });

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
});

// POST save coupon usage (called after successful checkout)
app.post("/api/coupon-usage", authenticateToken, (req, res) => {
  const { coupon_id } = req.body;
  db.run(
    "INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)",
    [coupon_id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Usage recorded" });
    },
  );
});

// ADMIN: CRUD Coupons
app.post("/api/admin/coupons", authenticateToken, (req, res) => {
  const {
    code,
    type,
    discount_value,
    min_order_amount,
    expired_at,
    max_uses_per_user,
  } = req.body;
  db.run(
    "INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?)",
    [
      code,
      type,
      discount_value,
      min_order_amount,
      expired_at,
      max_uses_per_user || 1,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Coupon created", id: this.lastID });
    },
  );
});

app.delete("/api/admin/coupons/:id", authenticateToken, (req, res) => {
  db.run("DELETE FROM coupons WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Coupon deleted" });
  });
});

// ==========================================
// ADMIN APIS
// ==========================================

app.get("/api/admin/users", authenticateToken, (req, res) => {
  db.all(
    "SELECT id, name, email, role, login_attempts, locked_until, shipping_address FROM users",
    [],
    (err, users) => {
      res.json(users);
    },
  );
});

app.delete("/api/admin/users/:id", authenticateToken, (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
    res.json({ message: "User deleted" });
  });
});

app.get("/api/admin/orders", authenticateToken, listAdminOrders(db));
app.put(
  "/api/admin/orders/:id/status",
  authenticateToken,
  updateAdminOrderStatus(db),
);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
