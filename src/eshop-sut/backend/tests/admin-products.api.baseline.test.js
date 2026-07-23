const request = require("supertest");

jest.mock("../database", () => {
  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@eshop.com",
      password: "Admin123!",
      role: "admin",
      login_attempts: 0,
      locked_until: null,
    },
  ];
  const products = [
    {
      id: 1,
      name: "Seed odd product",
      price: 100000,
      description: "Odd product",
      imageUrl: "https://example.com/odd.png",
      category_id: 1,
    },
  ];
  const orders = [];
  let nextProductId = 5;

  const normalizedSql = (sql) => sql.replace(/\s+/g, " ").trim();
  const copy = (row) => (row ? { ...row } : row);

  return {
    all(sql, params, callback) {
      const normalized = normalizedSql(sql);
      if (normalized === "SELECT * FROM products") {
        callback(null, products.map(copy));
        return;
      }
      if (normalized.includes("LIKE")) {
        callback(null, products.map(copy));
        return;
      }
      if (normalized.includes("SELECT orders.*")) {
        callback(null, orders.map(copy));
        return;
      }
      callback(null, []);
    },

    get(sql, params, callback) {
      const normalized = normalizedSql(sql);
      if (normalized === "SELECT * FROM users WHERE email = ?") {
        callback(null, copy(users.find((user) => user.email === params[0])));
        return;
      }
      if (normalized === "SELECT * FROM products WHERE id = ?") {
        callback(
          null,
          copy(products.find((product) => product.id === Number(params[0]))),
        );
        return;
      }
      if (normalized === "SELECT * FROM orders WHERE id = ?") {
        callback(
          null,
          copy(orders.find((order) => order.id === Number(params[0]))),
        );
        return;
      }
      callback(null, null);
    },

    run(sql, params, callback) {
      const normalized = normalizedSql(sql);
      if (normalized.includes("UPDATE users")) {
        if (typeof callback === "function") {
          callback.call({ changes: 1 }, null);
        }
        return;
      }
      if (normalized.startsWith("INSERT INTO products")) {
        const id = nextProductId++;
        const newProduct = {
          id,
          name: params[0] || "",
          price: params[1] || 0,
          description: params[2] || "",
          imageUrl: params[3] || "",
          category_id: params[4] || 1,
        };
        products.push(newProduct);
        if (typeof callback === "function") {
          callback.call({ lastID: id, changes: 1 }, null);
        }
        return;
      }
      if (typeof callback === "function") {
        callback.call({ changes: 1 }, null);
      }
    },

    prepare(sql) {
      return {
        run(name, price, description, imageUrl, categoryId, callback) {
          products.push({
            id: ++nextProductId,
            name,
            price,
            description,
            imageUrl,
            category_id: categoryId,
          });
          callback(null);
        },
        finalize(callback) {
          callback();
        },
      };
    },
  };
});

const app = require("../server");

async function loginAsAdmin() {
  const loginResponse = await request(app).post("/api/login").send({
    email: "admin@eshop.com",
    password: "Admin123!",
  });
  return loginResponse.body.token;
}

describe("product API baseline (basic tests only)", () => {
  test("GET /api/products returns status 200", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
  });

  test("GET /api/products/:id returns status 200", async () => {
    const res = await request(app).get("/api/products/1");
    expect(res.status).toBe(200);
  });

  test("POST /api/products creates a product", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Baseline Product",
      price: 50000,
      description: "Test",
      imageUrl: "",
      category_id: 1,
    });
    expect(res.status).toBe(200);
  });

  test("POST /api/admin/import-products basic import", async () => {
    const token = await loginAsAdmin();
    const res = await request(app)
      .post("/api/admin/import-products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        products: [{ name: "Import 1", price: 10000 }],
      });
    expect(res.status).toBe(200);
  });

  test("GET /api/admin/orders returns status 200 with token", async () => {
    const token = await loginAsAdmin();
    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
