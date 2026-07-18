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

app.get("/api/products", (req, res) => {
  const searchQuery = req.query.search;
  if (searchQuery) {
    const query = `SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`;
    db.all(query, [], (err, rows) => {
      if (err)
        return res
          .status(500)
          .send(`<h1>Database Error</h1><p>${err.message}</p>`);
      res.json(rows);
    });
  } else {
    db.all("SELECT * FROM products", [], (err, rows) => {
      res.json(rows);
    });
  }
});

app.get("/api/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(200).json({});
    if (row.id % 2 === 0) row.price = row.price.toString();
    res.json(row);
  });
});

app.post("/api/products", (req, res) => {
  const { name, price, description, imageUrl, category_id } = req.body;
  db.run(
    "INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)",
    [name, price, description, imageUrl, category_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product created", id: this.lastID });
    },
  );
});

app.put("/api/products/:id", (req, res) => {
  const { name, price, description, imageUrl, category_id } = req.body;
  db.run(
    "UPDATE products SET name = ?, price = ?, description = ?, imageUrl = ?, category_id = ? WHERE id = ?",
    [name, price, description, imageUrl, category_id, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product updated" });
    },
  );
});

app.delete("/api/products/:id", (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted" });
  });
});

// Import products from CSV (parsed on frontend, sent as JSON array)
app.post("/api/admin/import-products", authenticateToken, (req, res) => {
  const { products: rows } = req.body;

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "Không có dữ liệu để import" });
  }

  let inserted = 0;
  let errors = [];

  const stmt = db.prepare(
    "INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)",
  );

  rows.forEach((row, index) => {
    if (!row.name) {
      errors.push(`Hàng ${index + 2}: Thiếu tên sản phẩm`);
      return;
    }
    stmt.run(
      row.name,
      row.price,
      row.description || "",
      row.imageUrl || "",
      row.category_id || 1,
      function (err) {
        if (err) {
          errors.push(`Hàng ${index + 2}: ${err.message}`);
        } else {
          inserted++;
        }
      },
    );
  });

  stmt.finalize(() => {
    res.json({
      message: `Import hoàn tất: ${inserted}/${rows.length} sản phẩm được thêm`,
      inserted,
      errors,
    });
  });
});

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

app.get("/api/admin/orders", authenticateToken, (req, res) => {
  db.all(
    `
        SELECT orders.*, users.name as user_name 
        FROM orders 
        LEFT JOIN users ON orders.user_id = users.id
        ORDER BY orders.id DESC
    `,
    [],
    (err, orders) => {
      res.json(orders);
    },
  );
});

app.put("/api/admin/orders/:id/status", authenticateToken, (req, res) => {
  const { status } = req.body; // pending, confirmed, shipping, delivered, canceled

  db.get(
    "SELECT status FROM orders WHERE id = ?",
    [req.params.id],
    (err, order) => {
      if (!order) return res.status(404).json({ error: "Order not found" });

      const currentStatus = order.status;
      let isValidTransition = false;

      if (
        currentStatus === "pending" &&
        (status === "confirmed" || status === "canceled")
      )
        isValidTransition = true;
      if (
        currentStatus === "confirmed" &&
        (status === "shipping" || status === "canceled")
      )
        isValidTransition = true;
      if (currentStatus === "shipping" && status === "delivered")
        isValidTransition = true;

      if (currentStatus === "canceled" && status === "delivered")
        isValidTransition = true;

      if (!isValidTransition) {
        return res.status(400).json({
          error: `Invalid state transition from ${currentStatus} to ${status}`,
        });
      }

      db.run(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, req.params.id],
        function (err) {
          res.json({ message: "Order status updated" });
        },
      );
    },
  );
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
