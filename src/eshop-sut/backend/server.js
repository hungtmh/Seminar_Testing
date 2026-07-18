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
const {
  getCart,
  addToCart,
  checkout,
  getMyOrders,
  cancelOrder,
  getOrderById,
  applyCoupon,
  saveCouponUsage,
} = require("./services/orderService");

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

app.get("/api/cart", authenticateToken, getCart(db, userCarts));
app.post("/api/cart", authenticateToken, addToCart(db, userCarts));
app.post("/api/checkout", authenticateToken, checkout(db, userCarts));
app.get("/api/orders/my-orders", authenticateToken, getMyOrders(db));
app.put("/api/orders/:id/cancel", authenticateToken, cancelOrder(db));
app.get("/api/orders/:id", getOrderById(db));

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
app.post("/api/apply-coupon", applyCoupon(db));

// POST save coupon usage (called after successful checkout)
app.post("/api/coupon-usage", authenticateToken, saveCouponUsage(db));

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
