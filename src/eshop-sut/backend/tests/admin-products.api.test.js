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
    {
      id: 2,
      name: "Seed even product",
      price: 200000,
      description: "Even product",
      imageUrl: "https://example.com/even.png",
      category_id: 1,
    },
  ];
  const orders = [];
  let nextProductId = 5;
  let nextOrderId = 0;

  const normalizedSql = (sql) => sql.replace(/\s+/g, " ").trim();
  const copy = (row) => (row ? { ...row } : row);
  const callbackWith = (callback, context, error = null) => {
    if (typeof callback === "function") callback.call(context, error);
  };

  return {
    all(sql, params, callback) {
      const normalized = normalizedSql(sql);
      if (!Array.isArray(params) || params.length !== 0) {
        callback(new Error("Unexpected query parameters"));
        return;
      }
      if (normalized === "SELECT * FROM products") {
        callback(null, products.map(copy));
        return;
      }

      if (normalized.includes("FAIL_SEARCH")) {
        callback(new Error("forced search failure"));
        return;
      }

      const searchMatch = normalized.match(
        /^SELECT \* FROM products WHERE name LIKE '%(.*)%'$/,
      );
      if (searchMatch) {
        const search = searchMatch[1].toLowerCase();
        callback(
          null,
          products
            .filter((product) => product.name.toLowerCase().includes(search))
            .map(copy),
        );
        return;
      }

      if (
        normalized ===
        "SELECT orders.*, users.name as user_name FROM orders LEFT JOIN users ON orders.user_id = users.id ORDER BY orders.id DESC"
      ) {
        callback(
          null,
          orders
            .slice()
            .sort((left, right) => right.id - left.id)
            .map((order) => ({
              ...order,
              user_name: users.find((user) => user.id === order.user_id)?.name,
            })),
        );
        return;
      }

      callback(new Error(`Unexpected all query: ${normalized}`));
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
      if (normalized === "SELECT status FROM orders WHERE id = ?") {
        const order = orders.find((item) => item.id === Number(params[0]));
        callback(null, order ? { status: order.status } : undefined);
        return;
      }
      if (normalized === "SELECT * FROM orders WHERE id = ?") {
        callback(
          null,
          copy(orders.find((order) => order.id === Number(params[0]))),
        );
        return;
      }

      callback(new Error(`Unexpected get query: ${normalized}`));
    },

    run(sql, params, callback) {
      const normalized = normalizedSql(sql);
      if (
        normalized ===
        "UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?"
      ) {
        callbackWith(callback, { changes: 1 });
        return;
      }

      if (
        normalized ===
        "INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)"
      ) {
        if (params[0] === "FAIL_CREATE") {
          callbackWith(callback, {}, new Error("forced create failure"));
          return;
        }
        const product = {
          id: ++nextProductId,
          name: params[0],
          price: params[1],
          description: params[2],
          imageUrl: params[3],
          category_id: params[4],
        };
        products.push(product);
        callbackWith(callback, { lastID: product.id, changes: 1 });
        return;
      }

      if (
        normalized ===
        "UPDATE products SET name = ?, price = ?, description = ?, imageUrl = ?, category_id = ? WHERE id = ?"
      ) {
        if (params[0] === "FAIL_UPDATE") {
          callbackWith(callback, {}, new Error("forced update failure"));
          return;
        }
        const product = products.find(
          (item) => item.id === Number(params[params.length - 1]),
        );
        if (product) {
          Object.assign(product, {
            name: params[0],
            price: params[1],
            description: params[2],
            imageUrl: params[3],
            category_id: params[4],
          });
        }
        callbackWith(callback, { changes: product ? 1 : 0 });
        return;
      }

      if (normalized === "DELETE FROM products WHERE id = ?") {
        if (Number(params[0]) === 999999998) {
          callbackWith(callback, {}, new Error("forced delete failure"));
          return;
        }
        const index = products.findIndex(
          (product) => product.id === Number(params[0]),
        );
        if (index >= 0) products.splice(index, 1);
        callbackWith(callback, { changes: index >= 0 ? 1 : 0 });
        return;
      }

      if (
        normalized ===
        "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)"
      ) {
        const order = {
          id: ++nextOrderId,
          user_id: params[0],
          total_amount: params[1],
          status: params[2],
          shipping_address: params[3],
        };
        orders.push(order);
        callbackWith(callback, { lastID: order.id, changes: 1 });
        return;
      }

      if (normalized === "UPDATE orders SET status = ? WHERE id = ?") {
        const order = orders.find((item) => item.id === Number(params[1]));
        if (order) order.status = params[0];
        callbackWith(callback, { changes: order ? 1 : 0 });
        return;
      }

      callbackWith(
        callback,
        {},
        new Error(`Unexpected run query: ${normalized}`),
      );
    },

    prepare(sql) {
      const normalized = normalizedSql(sql);
      if (
        normalized !==
        "INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)"
      ) {
        throw new Error(`Unexpected prepare query: ${normalized}`);
      }

      return {
        run(name, price, description, imageUrl, categoryId, callback) {
          if (name === "FAIL_IMPORT") {
            callback(new Error("forced import failure"));
            return;
          }
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

const uniqueValue = (label) =>
  `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

async function loginAsAdmin() {
  const response = await request(app).post("/api/login").send({
    email: "admin@eshop.com",
    password: "Admin123!",
  });

  expect(response.status).toBe(200);
  expect(response.body.user.role).toBe("admin");
  return response.body.token;
}

async function createProduct(overrides = {}) {
  const payload = {
    name: uniqueValue("Mutation product"),
    price: 125000,
    description: "Product used by the admin API mutation tests",
    imageUrl: "https://example.com/product.png",
    category_id: 1,
    ...overrides,
  };

  const response = await request(app).post("/api/products").send(payload);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Product created",
    id: expect.any(Number),
  });

  return { ...payload, id: response.body.id };
}

async function createPendingOrder(token, totalAmount = 250000) {
  const response = await request(app)
    .post("/api/checkout")
    .set("Authorization", `Bearer ${token}`)
    .send({
      total_amount: totalAmount,
      shipping_address: uniqueValue("Shipping address"),
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Checkout successful",
    orderId: expect.any(Number),
  });
  return response.body.orderId;
}

async function updateOrderStatus(token, orderId, status) {
  return request(app)
    .put(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${token}`)
    .send({ status });
}

describe("product API", () => {
  test("lists all products and filters products by name", async () => {
    const marker = uniqueValue("Search marker");
    const product = await createProduct({ name: marker });

    const listResponse = await request(app).get("/api/products");
    const searchResponse = await request(app)
      .get("/api/products")
      .query({ search: marker });

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: product.id, name: marker }),
      ]),
    );
    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body).toEqual([
      expect.objectContaining({ id: product.id, name: marker }),
    ]);
  });

  test("returns an empty object when a product does not exist", async () => {
    const response = await request(app).get("/api/products/999999999");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  test("captures the current price type behavior for odd and even IDs", async () => {
    const oddResponse = await request(app).get("/api/products/1");
    const evenResponse = await request(app).get("/api/products/2");

    expect(oddResponse.body.price).toBe(100000);
    expect(evenResponse.body.price).toBe("200000");
  });

  test("returns the search database error as an HTML response", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({ search: "FAIL_SEARCH" });

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/html/);
    expect(response.text).toBe(
      "<h1>Database Error</h1><p>forced search failure</p>",
    );
  });

  test("creates, reads, updates, and deletes exactly one product", async () => {
    const untouched = await createProduct({ name: uniqueValue("Untouched") });
    const product = await createProduct();

    const readResponse = await request(app).get(`/api/products/${product.id}`);
    expect(readResponse.status).toBe(200);
    expect(readResponse.body).toEqual(
      expect.objectContaining({
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        category_id: product.category_id,
      }),
    );
    expect(Number(readResponse.body.price)).toBe(product.price);

    const updatedPayload = {
      name: uniqueValue("Updated product"),
      price: 275000,
      description: "Updated description",
      imageUrl: "https://example.com/updated.png",
      category_id: 2,
    };
    const updateResponse = await request(app)
      .put(`/api/products/${product.id}`)
      .send(updatedPayload);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({ message: "Product updated" });

    const [updatedResponse, untouchedResponse] = await Promise.all([
      request(app).get(`/api/products/${product.id}`),
      request(app).get(`/api/products/${untouched.id}`),
    ]);
    expect(updatedResponse.body).toEqual(
      expect.objectContaining({
        id: product.id,
        name: updatedPayload.name,
        description: updatedPayload.description,
        imageUrl: updatedPayload.imageUrl,
        category_id: updatedPayload.category_id,
      }),
    );
    expect(Number(updatedResponse.body.price)).toBe(updatedPayload.price);
    expect(untouchedResponse.body.name).toBe(untouched.name);

    const deleteResponse = await request(app).delete(
      `/api/products/${product.id}`,
    );
    const missingResponse = await request(app).get(
      `/api/products/${product.id}`,
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ message: "Product deleted" });
    expect(missingResponse.body).toEqual({});
  });

  test("returns database errors from product write operations", async () => {
    const product = await createProduct();
    const createResponse = await request(app).post("/api/products").send({
      name: "FAIL_CREATE",
      price: 1000,
      description: "",
      imageUrl: "",
      category_id: 1,
    });
    const updateResponse = await request(app)
      .put(`/api/products/${product.id}`)
      .send({
        name: "FAIL_UPDATE",
        price: 1000,
        description: "",
        imageUrl: "",
        category_id: 1,
      });
    const deleteResponse = await request(app).delete(
      "/api/products/999999998",
    );

    expect(createResponse.status).toBe(500);
    expect(createResponse.body).toEqual({ error: "forced create failure" });
    expect(updateResponse.status).toBe(500);
    expect(updateResponse.body).toEqual({ error: "forced update failure" });
    expect(deleteResponse.status).toBe(500);
    expect(deleteResponse.body).toEqual({ error: "forced delete failure" });
  });
});

describe("admin product import API", () => {
  test("requires a valid token", async () => {
    const response = await request(app)
      .post("/api/admin/import-products")
      .send({ products: [{ name: "Unauthorized product", price: 1000 }] });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  test.each([
    ["missing products", {}],
    ["a non-array value", { products: "not-an-array" }],
    ["an empty array", { products: [] }],
  ])("rejects %s", async (_label, payload) => {
    const token = await loginAsAdmin();
    const response = await request(app)
      .post("/api/admin/import-products")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Không có dữ liệu để import" });
  });

  test("reports inserted products and rows with missing names", async () => {
    const token = await loginAsAdmin();
    const importedName = uniqueValue("Imported product");
    const response = await request(app)
      .post("/api/admin/import-products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        products: [
          {
            name: importedName,
            price: 99000,
          },
          {
            name: "",
            price: 120000,
          },
          {
            name: "FAIL_IMPORT",
            price: 130000,
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Import hoàn tất: 1/3 sản phẩm được thêm",
      inserted: 1,
      errors: [
        "Hàng 3: Thiếu tên sản phẩm",
        "Hàng 4: forced import failure",
      ],
    });

    const searchResponse = await request(app)
      .get("/api/products")
      .query({ search: importedName });
    expect(searchResponse.body).toEqual([
      expect.objectContaining({
        name: importedName,
        price: 99000,
        description: "",
        imageUrl: "",
        category_id: 1,
      }),
    ]);
  });
});

describe("admin order APIs", () => {
  test("requires a token for listing and updating orders", async () => {
    const listResponse = await request(app).get("/api/admin/orders");
    const updateResponse = await request(app)
      .put("/api/admin/orders/1/status")
      .send({ status: "confirmed" });

    expect(listResponse.status).toBe(401);
    expect(listResponse.body).toEqual({ error: "Unauthorized" });
    expect(updateResponse.status).toBe(401);
    expect(updateResponse.body).toEqual({ error: "Unauthorized" });
  });

  test("lists orders newest first with the customer name", async () => {
    const token = await loginAsAdmin();
    const firstOrderId = await createPendingOrder(token, 310000);
    const secondOrderId = await createPendingOrder(token, 420000);

    const response = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: secondOrderId,
        total_amount: 420000,
        status: "pending",
        user_name: "Admin User",
      }),
    );
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: firstOrderId, total_amount: 310000 }),
      ]),
    );
  });

  test("moves an order through pending, confirmed, shipping, and delivered", async () => {
    const token = await loginAsAdmin();
    const orderId = await createPendingOrder(token);

    for (const status of ["confirmed", "shipping", "delivered"]) {
      const response = await updateOrderStatus(token, orderId, status);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Order status updated" });
    }

    const orderResponse = await request(app).get(`/api/orders/${orderId}`);
    expect(orderResponse.body.status).toBe("delivered");
  });

  test("allows pending and confirmed orders to be canceled", async () => {
    const token = await loginAsAdmin();
    const pendingOrderId = await createPendingOrder(token);
    const confirmedOrderId = await createPendingOrder(token);

    const confirmResponse = await updateOrderStatus(
      token,
      confirmedOrderId,
      "confirmed",
    );
    const cancelPendingResponse = await updateOrderStatus(
      token,
      pendingOrderId,
      "canceled",
    );
    const cancelConfirmedResponse = await updateOrderStatus(
      token,
      confirmedOrderId,
      "canceled",
    );

    expect(confirmResponse.status).toBe(200);
    expect(cancelPendingResponse.status).toBe(200);
    expect(cancelConfirmedResponse.status).toBe(200);
  });

  test("rejects invalid transitions and reports a missing order", async () => {
    const token = await loginAsAdmin();
    const orderId = await createPendingOrder(token);

    const invalidResponse = await updateOrderStatus(
      token,
      orderId,
      "shipping",
    );
    const missingResponse = await updateOrderStatus(
      token,
      999999999,
      "confirmed",
    );

    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body).toEqual({
      error: "Invalid state transition from pending to shipping",
    });
    expect(missingResponse.status).toBe(404);
    expect(missingResponse.body).toEqual({ error: "Order not found" });
  });

  test("rejects transitions outside the current order state", async () => {
    const token = await loginAsAdmin();

    const pendingOrderId = await createPendingOrder(token);
    for (const status of ["pending", "shipping", "delivered"]) {
      const response = await updateOrderStatus(token, pendingOrderId, status);
      expect(response.status).toBe(400);
    }

    const confirmedOrderId = await createPendingOrder(token);
    await updateOrderStatus(token, confirmedOrderId, "confirmed");
    for (const status of ["pending", "confirmed", "delivered"]) {
      const response = await updateOrderStatus(token, confirmedOrderId, status);
      expect(response.status).toBe(400);
    }

    const shippingOrderId = await createPendingOrder(token);
    await updateOrderStatus(token, shippingOrderId, "confirmed");
    await updateOrderStatus(token, shippingOrderId, "shipping");
    for (const status of ["pending", "confirmed", "shipping", "canceled"]) {
      const response = await updateOrderStatus(token, shippingOrderId, status);
      expect(response.status).toBe(400);
    }

    const deliveredOrderId = await createPendingOrder(token);
    await updateOrderStatus(token, deliveredOrderId, "confirmed");
    await updateOrderStatus(token, deliveredOrderId, "shipping");
    await updateOrderStatus(token, deliveredOrderId, "delivered");
    for (const status of ["delivered", "canceled"]) {
      const response = await updateOrderStatus(token, deliveredOrderId, status);
      expect(response.status).toBe(400);
    }

    const canceledOrderId = await createPendingOrder(token);
    await updateOrderStatus(token, canceledOrderId, "canceled");
    for (const status of ["pending", "confirmed", "shipping", "canceled"]) {
      const response = await updateOrderStatus(token, canceledOrderId, status);
      expect(response.status).toBe(400);
    }
  });

  test("captures the current canceled-to-delivered SUT behavior", async () => {
    const token = await loginAsAdmin();
    const orderId = await createPendingOrder(token);

    const cancelResponse = await updateOrderStatus(
      token,
      orderId,
      "canceled",
    );
    const deliveredResponse = await updateOrderStatus(
      token,
      orderId,
      "delivered",
    );

    expect(cancelResponse.status).toBe(200);
    expect(deliveredResponse.status).toBe(200);
    expect(deliveredResponse.body).toEqual({ message: "Order status updated" });
  });
});
