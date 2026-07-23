const request = require("supertest");

jest.mock("../database", () => require("./helpers/fakeOrderDatabase")());

const app = require("../server");
const db = require("../database");

const uniqueEmail = (label) => `${label}.${Date.now()}.${Math.random().toString(16).slice(2)}@example.com`;

async function registerAndLogin(label = "order-improved") {
  const user = {
    name: `Order User ${label}`,
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
    shipping_address: "123 Improved Street",
    ...overrides,
  };
  const response = await request(app).post("/api/checkout").set("Authorization", `Bearer ${token}`).send(payload);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Checkout successful",
    orderId: expect.any(Number),
  });
  return { id: response.body.orderId, ...payload };
}

async function updateOrderStatus(token, orderId, status) {
  return request(app).put(`/api/admin/orders/${orderId}/status`).set("Authorization", `Bearer ${token}`).send({ status });
}

async function cancelOrder(token, orderId) {
  return request(app).put(`/api/orders/${orderId}/cancel`).set("Authorization", `Bearer ${token}`);
}

describe("order API improved tests", () => {
  test("requires authentication for every protected order endpoint", async () => {
    const responses = await Promise.all([request(app).get("/api/cart"), request(app).post("/api/cart").send({ id: 1 }), request(app).post("/api/checkout").send({ total_amount: 1000 }), request(app).get("/api/orders/my-orders"), request(app).put("/api/orders/1/cancel"), request(app).post("/api/coupon-usage").send({ coupon_id: 1 })]);

    for (const response of responses) {
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Unauthorized" });
    }
  });

  test("keeps existing cart items and isolates carts by user", async () => {
    const firstUser = await registerAndLogin("cart-first");
    const secondUser = await registerAndLogin("cart-second");
    const firstItem = { id: 11, name: "First item", price: 10000, quantity: 1 };
    const secondItem = {
      id: 12,
      name: "Second item",
      price: 20000,
      quantity: 2,
    };

    const initialResponse = await request(app).get("/api/cart").set("Authorization", `Bearer ${firstUser.token}`);
    const firstAddResponse = await request(app).post("/api/cart").set("Authorization", `Bearer ${firstUser.token}`).send(firstItem);
    const secondAddResponse = await request(app).post("/api/cart").set("Authorization", `Bearer ${firstUser.token}`).send(secondItem);
    const firstCartResponse = await request(app).get("/api/cart").set("Authorization", `Bearer ${firstUser.token}`);
    const secondCartResponse = await request(app).get("/api/cart").set("Authorization", `Bearer ${secondUser.token}`);

    expect(initialResponse.body).toEqual([]);
    expect(firstAddResponse.body).toEqual({ message: "Added to cart" });
    expect(secondAddResponse.body).toEqual({ message: "Added to cart" });
    expect(firstCartResponse.body).toEqual([firstItem, secondItem]);
    expect(secondCartResponse.body).toEqual([]);
  });

  test("keeps duplicate cart rows under the current SUT behavior", async () => {
    const { token } = await registerAndLogin("cart-duplicate");
    const item = { id: 20, name: "Duplicate item", price: 30000, quantity: 1 };

    await request(app).post("/api/cart").set("Authorization", `Bearer ${token}`).send(item);
    await request(app).post("/api/cart").set("Authorization", `Bearer ${token}`).send(item);
    const response = await request(app).get("/api/cart").set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual([item, item]);
  });

  test("creates pending orders and lists only the current user's orders newest first", async () => {
    const firstUser = await registerAndLogin("orders-first");
    const secondUser = await registerAndLogin("orders-second");
    const firstOrder = await createOrder(firstUser.token, {
      total_amount: 110000,
      shipping_address: "First address",
    });
    const secondOrder = await createOrder(firstUser.token, {
      total_amount: 220000,
      shipping_address: "Second address",
    });
    await createOrder(secondUser.token, {
      total_amount: 330000,
      shipping_address: "Other user address",
    });

    const response = await request(app).get("/api/orders/my-orders").set("Authorization", `Bearer ${firstUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.map((order) => order.id)).toEqual([secondOrder.id, firstOrder.id]);
    expect(response.body).toEqual([
      expect.objectContaining({
        total_amount: 220000,
        status: "pending",
        shipping_address: "Second address",
      }),
      expect.objectContaining({
        total_amount: 110000,
        status: "pending",
        shipping_address: "First address",
      }),
    ]);
  });

  test("returns checkout database errors", async () => {
    const { token } = await registerAndLogin("checkout-error");
    const response = await request(app).post("/api/checkout").set("Authorization", `Bearer ${token}`).send({ total_amount: 100000, shipping_address: "FAIL_CHECKOUT" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "forced checkout failure" });
  });

  test("reads an order by ID and reports an unknown ID", async () => {
    const { token } = await registerAndLogin("order-detail");
    const order = await createOrder(token, {
      total_amount: 440000,
      shipping_address: "Detail address",
    });

    const detailResponse = await request(app).get(`/api/orders/${order.id}`);
    const missingResponse = await request(app).get("/api/orders/999999");

    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body).toEqual(
      expect.objectContaining({
        id: order.id,
        total_amount: 440000,
        status: "pending",
        shipping_address: "Detail address",
      }),
    );
    expect(missingResponse.status).toBe(404);
    expect(missingResponse.body).toEqual({ error: "Order not found" });
  });

  test("does not let one user cancel another user's order", async () => {
    const owner = await registerAndLogin("order-owner");
    const otherUser = await registerAndLogin("order-other");
    const order = await createOrder(owner.token);

    const response = await cancelOrder(otherUser.token, order.id);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Order not found" });
  });

  test("cancels pending and confirmed orders", async () => {
    const user = await registerAndLogin("cancel-valid");
    const pendingOrder = await createOrder(user.token);
    const confirmedOrder = await createOrder(user.token);
    const confirmResponse = await updateOrderStatus(user.token, confirmedOrder.id, "confirmed");

    const pendingResponse = await cancelOrder(user.token, pendingOrder.id);
    const confirmedResponse = await cancelOrder(user.token, confirmedOrder.id);

    expect(confirmResponse.status).toBe(200);
    expect(pendingResponse.status).toBe(200);
    expect(pendingResponse.body).toEqual({
      message: "Order canceled successfully",
    });
    expect(confirmedResponse.status).toBe(200);
    expect(confirmedResponse.body).toEqual({
      message: "Order canceled successfully",
    });
  });

  test("rejects cancellation of delivered and already canceled orders", async () => {
    const user = await registerAndLogin("cancel-final");
    const deliveredOrder = await createOrder(user.token);
    await updateOrderStatus(user.token, deliveredOrder.id, "confirmed");
    await updateOrderStatus(user.token, deliveredOrder.id, "shipping");
    await updateOrderStatus(user.token, deliveredOrder.id, "delivered");

    const canceledOrder = await createOrder(user.token);
    await cancelOrder(user.token, canceledOrder.id);

    const deliveredResponse = await cancelOrder(user.token, deliveredOrder.id);
    const canceledResponse = await cancelOrder(user.token, canceledOrder.id);

    expect(deliveredResponse.status).toBe(400);
    expect(deliveredResponse.body).toEqual({
      error: "Cannot cancel this order.",
    });
    expect(canceledResponse.status).toBe(400);
    expect(canceledResponse.body).toEqual({
      error: "Cannot cancel this order.",
    });
  });

  test("captures the current behavior that lets a user cancel a shipping order", async () => {
    const user = await registerAndLogin("cancel-shipping");
    const order = await createOrder(user.token);
    await updateOrderStatus(user.token, order.id, "confirmed");
    await updateOrderStatus(user.token, order.id, "shipping");

    const response = await cancelOrder(user.token, order.id);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Order canceled successfully" });
  });

  test("returns exact errors for missing, unknown, and inactive coupon codes", async () => {
    const missingResponse = await request(app).post("/api/apply-coupon").send({ total_amount: 200000 });
    const unknownResponse = await request(app).post("/api/apply-coupon").send({ code: "UNKNOWN", total_amount: 200000 });
    const inactiveResponse = await request(app).post("/api/apply-coupon").send({ code: "INACTIVE", total_amount: 200000 });

    expect(missingResponse.status).toBe(400);
    expect(missingResponse.body).toEqual({
      error: "Vui lòng nhập mã giảm giá",
    });
    for (const response of [unknownResponse, inactiveResponse]) {
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa",
      });
    }
  });

  test("rejects totals below and exactly equal to the current minimum threshold", async () => {
    const belowResponse = await request(app).post("/api/apply-coupon").send({ code: "FIXED50", total_amount: 99999 });
    const equalResponse = await request(app).post("/api/apply-coupon").send({ code: "FIXED50", total_amount: 100000 });

    for (const response of [belowResponse, equalResponse]) {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Đơn hàng chưa đủ giá trị tối thiểu 100,000 ₫ để áp dụng mã này",
      });
    }
  });

  test("rejects an expired coupon", async () => {
    const response = await request(app).post("/api/apply-coupon").send({ code: "EXPIRED", total_amount: 200000 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Mã giảm giá đã hết hạn" });
  });

  test("applies fixed and percent coupons without a user ID", async () => {
    const usageQueriesBefore = db.__state.metrics.couponUsageQueries;
    const fixedResponse = await request(app).post("/api/apply-coupon").send({ code: "FIXED50", total_amount: 200000 });
    const percentResponse = await request(app).post("/api/apply-coupon").send({ code: "SAVE10", total_amount: 500000 });

    expect(fixedResponse.body).toEqual({
      success: true,
      coupon_id: 2,
      discount_amount: 50000,
      final_amount: 150000,
      message: "Áp dụng thành công! Giảm 50,000 ₫",
    });
    expect(percentResponse.body).toEqual({
      success: true,
      coupon_id: 1,
      discount_amount: -4500000,
      final_amount: 5000000,
      message: "Áp dụng thành công! Giảm 10%",
    });
    expect(db.__state.metrics.couponUsageQueries).toBe(usageQueriesBefore);
  });

  test("applies coupons for a user below the usage limit", async () => {
    const user = await registerAndLogin("coupon-user");
    const fixedResponse = await request(app).post("/api/apply-coupon").send({ code: "FIXED50", total_amount: 200000, user_id: user.id });
    const percentResponse = await request(app).post("/api/apply-coupon").send({ code: "SAVE10", total_amount: 500000, user_id: user.id });

    expect(fixedResponse.body).toEqual({
      success: true,
      coupon_id: 2,
      discount_amount: 50000,
      final_amount: 150000,
      message: "Áp dụng thành công! Giảm 50,000 ₫",
    });
    expect(percentResponse.body).toEqual({
      success: true,
      coupon_id: 1,
      discount_amount: -4500000,
      final_amount: 5000000,
      message: "Áp dụng thành công! Giảm 10%",
    });
  });

  test("rejects a coupon after the user reaches its usage limit", async () => {
    const user = await registerAndLogin("coupon-limit");
    const usageResponse = await request(app).post("/api/coupon-usage").set("Authorization", `Bearer ${user.token}`).send({ coupon_id: 1 });
    const applyResponse = await request(app).post("/api/apply-coupon").send({ code: "SAVE10", total_amount: 500000, user_id: user.id });

    expect(usageResponse.status).toBe(200);
    expect(usageResponse.body).toEqual({ message: "Usage recorded" });
    expect(applyResponse.status).toBe(400);
    expect(applyResponse.body).toEqual({
      error: "Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)",
    });
  });

  test("distinguishes expiry exactly at the current instant", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2030-01-01T00:00:00.000Z"));

    try {
      const response = await request(app).post("/api/apply-coupon").send({ code: "BOUNDARY", total_amount: 10000 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        coupon_id: 5,
        discount_amount: 1000,
        final_amount: 9000,
        message: "Áp dụng thành công! Giảm 1,000 ₫",
      });
    } finally {
      jest.useRealTimers();
    }
  });

  test("returns database errors while saving coupon usage", async () => {
    const user = await registerAndLogin("coupon-usage-error");
    const response = await request(app).post("/api/coupon-usage").set("Authorization", `Bearer ${user.token}`).send({ coupon_id: -1 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "forced usage failure" });
  });

  test("returns database error when getMyOrders fails", async () => {
    const { token } = await registerAndLogin("orders-db-error");
    const spy = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(new Error("forced getMyOrders failure"));
    });

    const response = await request(app).get("/api/orders/my-orders").set("Authorization", `Bearer ${token}`);
    spy.mockRestore();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "forced getMyOrders failure" });
  });

  test("returns database errors when getOrderById fails", async () => {
    const spy = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
      callback(new Error("forced getOrderById failure"));
    });

    const response = await request(app).get("/api/orders/1");
    spy.mockRestore();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "forced getOrderById failure" });
  });

  test("returns database errors when cancelOrder select or update fails", async () => {
    const user = await registerAndLogin("cancel-db-error");
    const order = await createOrder(user.token);

    // 1. Test cancelOrder SELECT failure
    const selectSpy = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
      callback(new Error("forced cancel select failure"));
    });
    const selectResponse = await cancelOrder(user.token, order.id);
    selectSpy.mockRestore();

    expect(selectResponse.status).toBe(500);
    expect(selectResponse.body).toEqual({ error: "forced cancel select failure" });

    // 2. Test cancelOrder UPDATE failure
    const runSpy = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      if (sql.includes("UPDATE orders SET status = ?")) {
        callback(new Error("forced cancel update failure"));
      }
    });
    const updateResponse = await cancelOrder(user.token, order.id);
    runSpy.mockRestore();

    expect(updateResponse.status).toBe(500);
    expect(updateResponse.body).toEqual({ error: "forced cancel update failure" });
  });

  test("returns database errors when applyCoupon queries fail", async () => {
    const user = await registerAndLogin("apply-coupon-db-error");

    // 1. Test applyCoupon SELECT coupon failure
    const couponSpy = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
      callback(new Error("forced coupon select failure"));
    });
    const couponResponse = await request(app)
      .post("/api/apply-coupon")
      .send({ code: "SAVE10", total_amount: 500000 });
    couponSpy.mockRestore();

    expect(couponResponse.status).toBe(500);
    expect(couponResponse.body).toEqual({ error: "forced coupon select failure" });

    // 2. Test applyCoupon SELECT usage count failure
    const originalGet = db.get.bind(db);
    const usageSpy = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      if (sql.includes("COUNT(*)")) {
        callback(new Error("forced usage count failure"));
      } else {
        originalGet(sql, params, callback);
      }
    });

    const usageResponse = await request(app)
      .post("/api/apply-coupon")
      .send({ code: "SAVE10", total_amount: 500000, user_id: user.id });

    usageSpy.mockRestore();

    expect(usageResponse.status).toBe(500);
    expect(usageResponse.body).toEqual({ error: "forced usage count failure" });
  });
});

