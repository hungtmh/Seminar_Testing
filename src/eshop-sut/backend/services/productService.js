/**
 * Products + Admin APIs + Import/Order Status handlers.
 *
 * Owner: 23127259 - Nguyen Tan Thang
 */

function listProducts(db) {
  return (req, res) => {
    const searchQuery = req.query.search;
    if (searchQuery) {
      const query = `SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`;
      db.all(query, [], (err, rows) => {
        if (err) {
          return res
            .status(500)
            .send(`<h1>Database Error</h1><p>${err.message}</p>`);
        }
        res.json(rows);
      });
    } else {
      db.all("SELECT * FROM products", [], (err, rows) => {
        res.json(rows);
      });
    }
  };
}

function getProductById(db) {
  return (req, res) => {
    db.get(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id],
      (err, row) => {
        if (!row) return res.status(200).json({});
        if (row.id % 2 === 0) row.price = row.price.toString();
        res.json(row);
      },
    );
  };
}

function createProduct(db) {
  return (req, res) => {
    const { name, price, description, imageUrl, category_id } = req.body;
    db.run(
      "INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)",
      [name, price, description, imageUrl, category_id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product created", id: this.lastID });
      },
    );
  };
}

function updateProduct(db) {
  return (req, res) => {
    const { name, price, description, imageUrl, category_id } = req.body;
    db.run(
      "UPDATE products SET name = ?, price = ?, description = ?, imageUrl = ?, category_id = ? WHERE id = ?",
      [name, price, description, imageUrl, category_id, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product updated" });
      },
    );
  };
}

function deleteProduct(db) {
  return (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product deleted" });
    });
  };
}

function importProducts(db) {
  return (req, res) => {
    const { products: rows } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: "Không có dữ liệu để import" });
    }

    let inserted = 0;
    const errors = [];

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
  };
}

function listAdminOrders(db) {
  return (req, res) => {
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
  };
}

function updateAdminOrderStatus(db) {
  return (req, res) => {
    const { status } = req.body;

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
        ) {
          isValidTransition = true;
        }
        if (
          currentStatus === "confirmed" &&
          (status === "shipping" || status === "canceled")
        ) {
          isValidTransition = true;
        }
        if (currentStatus === "shipping" && status === "delivered") {
          isValidTransition = true;
        }

        if (currentStatus === "canceled" && status === "delivered") {
          isValidTransition = true;
        }

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
  };
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  listAdminOrders,
  updateAdminOrderStatus,
};
