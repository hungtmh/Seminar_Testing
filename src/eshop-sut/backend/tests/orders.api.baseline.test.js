const request = require("supertest");

jest.mock("../database", () =>
  require("./helpers/fakeOrderDatabase")(),
);

const app = require("../server");

const uniqueEmail = (label) =>
  `${label}.${Date.now()}.${Math.random().toString(16).slice(2)}@example.com`;

async function registerAndLogin(label = "order-baseline") {
  const user = {
    name: "Order Baseline User",
    email: uniqueEmail(label),
    password: "Password123!",
  };
  const registerResponse = await request(app).post("/api/register").send(user);
  expect(registerResponse.status).toBe(200);

  const loginResponse = await request(app).post("/api/login").send({
    email: user.email,
    password: user.password,
  });
  expect(loginResponse.status).toBe(200);

  return {
    id: registerResponse.body.id,
    token: loginResponse.body.token,
  };
}

async function createOrder(token, overrides = {}) {
  const payload = {
    total_amount: 250000,
    shipping_address: "123 Baseline Street",
    ...overrides,
  };
  const response = await request(app)
    .post("/api/checkout")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  expect(response.status).toBe(200);
  return { id: response.body.orderId, ...payload };
}

describe("order API baseline tests", () => {
  test("requires authentication for protected order APIs", async () => {
    const responses = await Promise.all([
      request(app).get("/api/cart"),
      request(app).post("/api/cart").send({ id: 1 }),
      request(app).post("/api/checkout").send({ total_amount: 1000 }),
      request(app).get("/api/orders/my-orders"),
      request(app).put("/api/orders/1/cancel"),
      request(app).post("/api/coupon-usage").send({ coupon_id: 1 }),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Unauthorized" });
    }
  });

  test("reads an empty cart and adds an item", async () => {
    const { token } = await registerAndLogin("cart");
    const item = { id: 9, name: "Baseline item", price: 75000, quantity: 2 };

    const emptyResponse = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);
    const addResponse = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send(item);
    const cartResponse = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(emptyResponse.body).toEqual([]);
    expect(addResponse.body).toEqual({ message: "Added to cart" });
    expect(cartResponse.body).toEqual([item]);
  });

  test("checks out and reads order history and details", async () => {
    const { token } = await registerAndLogin("checkout");
    const order = await createOrder(token);

    const historyResponse = await request(app)
      .get("/api/orders/my-orders")
      .set("Authorization", `Bearer ${token}`);
    const detailResponse = await request(app).get(`/api/orders/${order.id}`);

    expect(historyResponse.body).toEqual([
      expect.objectContaining({
        id: order.id,
        total_amount: order.total_amount,
        status: "pending",
      }),
    ]);
    expect(detailResponse.body).toEqual(
      expect.objectContaining({
        id: order.id,
        shipping_address: order.shipping_address,
      }),
    );
  });

  test("cancels a pending order and rejects a second cancellation", async () => {
    const { token } = await registerAndLogin("cancel");
    const order = await createOrder(token);

    const cancelResponse = await request(app)
      .put(`/api/orders/${order.id}/cancel`)
      .set("Authorization", `Bearer ${token}`);
    const secondResponse = await request(app)
      .put(`/api/orders/${order.id}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body).toEqual({
      message: "Order canceled successfully",
    });
    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body).toEqual({ error: "Cannot cancel this order." });
  });

  test("reports missing orders", async () => {
    const { token } = await registerAndLogin("missing-order");
    const cancelResponse = await request(app)
      .put("/api/orders/999999/cancel")
      .set("Authorization", `Bearer ${token}`);
    const detailResponse = await request(app).get("/api/orders/999999");

    expect(cancelResponse.status).toBe(404);
    expect(cancelResponse.body).toEqual({ error: "Order not found" });
    expect(detailResponse.status).toBe(404);
    expect(detailResponse.body).toEqual({ error: "Order not found" });
  });

  test("validates coupon codes and applies a fixed coupon", async () => {
    const missingCodeResponse = await request(app)
      .post("/api/apply-coupon")
      .send({ total_amount: 200000 });
    const unknownResponse = await request(app)
      .post("/api/apply-coupon")
      .send({ code: "UNKNOWN", total_amount: 200000 });
    const successResponse = await request(app)
      .post("/api/apply-coupon")
      .send({ code: "FIXED50", total_amount: 200000 });

    expect(missingCodeResponse.status).toBe(400);
    expect(unknownResponse.status).toBe(404);
    expect(successResponse.body).toEqual({
      success: true,
      coupon_id: 2,
      discount_amount: 50000,
      final_amount: 150000,
      message: "Áp dụng thành công! Giảm 50,000 ₫",
    });
  });

  test("records coupon usage", async () => {
    const { token } = await registerAndLogin("coupon-usage");
    const response = await request(app)
      .post("/api/coupon-usage")
      .set("Authorization", `Bearer ${token}`)
      .send({ coupon_id: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Usage recorded" });
  });
});
