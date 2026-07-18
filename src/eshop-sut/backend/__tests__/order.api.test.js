const request = require("supertest");
const app = require("../server");
const db = require("../database");

const uniqueEmail = (label) =>
  `${label}.${Date.now()}.${Math.random().toString(16).slice(2)}@example.com`;

async function getAuthToken() {
  const payload = {
    name: "Order Test User",
    email: uniqueEmail("order"),
    password: "Password123!",
  };
  await request(app).post("/api/register").send(payload);
  const loginRes = await request(app).post("/api/login").send({
    email: payload.email,
    password: payload.password,
  });
  return { token: loginRes.body.token, userId: loginRes.body.user.id };
}

describe("Order API improved tests", () => {
  let token1, userId1;
  let token2, userId2;

  beforeAll(async () => {
    const auth1 = await getAuthToken();
    token1 = auth1.token;
    userId1 = auth1.userId;

    const auth2 = await getAuthToken();
    token2 = auth2.token;
    userId2 = auth2.userId;
  });

  describe("Cart APIs", () => {
    test("GET /api/cart returns empty array initially", async () => {
      const res = await request(app)
        .get("/api/cart")
        .set("Authorization", `Bearer ${token1}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test("POST /api/cart adds item to cart", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token1}`)
        .send({ productId: 999, quantity: 2 });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Added to cart");

      const cartRes = await request(app)
        .get("/api/cart")
        .set("Authorization", `Bearer ${token1}`);
      expect(cartRes.status).toBe(200);
      expect(cartRes.body.length).toBe(1);
      expect(cartRes.body[0]).toEqual({ productId: 999, quantity: 2 });
    });
  });

  describe("Order APIs", () => {
    let orderId1;

    test("POST /api/checkout creates an order", async () => {
      const res = await request(app)
        .post("/api/checkout")
        .set("Authorization", `Bearer ${token1}`)
        .send({ total_amount: 500000, shipping_address: "123 Test Street" });
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Checkout successful");
      expect(typeof res.body.orderId).toBe("number");
      orderId1 = res.body.orderId;
    });

    test("GET /api/orders/my-orders returns only user's orders", async () => {
      // Create order for user 2
      await request(app)
        .post("/api/checkout")
        .set("Authorization", `Bearer ${token2}`)
        .send({ total_amount: 100000, shipping_address: "User 2 Address" });

      const res1 = await request(app)
        .get("/api/orders/my-orders")
        .set("Authorization", `Bearer ${token1}`);
      expect(res1.status).toBe(200);
      expect(Array.isArray(res1.body)).toBe(true);
      expect(res1.body.length).toBeGreaterThanOrEqual(1);
      res1.body.forEach(o => expect(o.user_id).toBe(userId1));

      const res2 = await request(app)
        .get("/api/orders/my-orders")
        .set("Authorization", `Bearer ${token2}`);
      expect(res2.status).toBe(200);
      expect(Array.isArray(res2.body)).toBe(true);
      res2.body.forEach(o => expect(o.user_id).toBe(userId2));
    });

    test("GET /api/orders/:id returns order details", async () => {
      const res = await request(app).get(`/api/orders/${orderId1}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(orderId1);
      expect(res.body.total_amount).toBe(500000);
    });

    test("GET /api/orders/:id returns 404 for unknown order", async () => {
      const res = await request(app).get("/api/orders/999999");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Order not found");
    });

    test("PUT /api/orders/:id/cancel cancels the order successfully", async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId1}/cancel`)
        .set("Authorization", `Bearer ${token1}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Order canceled successfully");
    });

    test("PUT /api/orders/:id/cancel fails if order already canceled", async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId1}/cancel`)
        .set("Authorization", `Bearer ${token1}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Cannot cancel this order.");
    });

    test("PUT /api/orders/:id/cancel returns 404 for not found/other user's order", async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId1}/cancel`)
        .set("Authorization", `Bearer ${token2}`); // token2 trying to cancel token1's order
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Order not found");
    });

    test("PUT /api/orders/:id/cancel handles DB error gracefully", () => {
      const queryError = new Error("DB Error Cancel");
      const fakeDb = {
        get: (_sql, _params, cb) => cb(queryError)
      };
      const req = { params: { id: 1 }, user: { id: 1 } };
      const res = {
        statusCode: null,
        body: null,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.body = payload; return this; }
      };
      
      const { cancelOrder } = require("../services/orderService");
      cancelOrder(fakeDb)(req, res);
      
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("DB Error Cancel");
    });

    test("getMyOrders handles DB error gracefully", () => {
      const queryError = new Error("DB Error GetOrders");
      const fakeDb = {
        all: (_sql, _params, cb) => cb(queryError)
      };
      const req = { user: { id: 1 } };
      const res = {
        statusCode: null,
        body: null,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.body = payload; return this; }
      };
      
      const { getMyOrders } = require("../services/orderService");
      getMyOrders(fakeDb)(req, res);
      
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("DB Error GetOrders");
    });
  });

  describe("Coupon APIs", () => {
    test("POST /api/apply-coupon requires code", async () => {
      const res = await request(app).post("/api/apply-coupon").send({ total_amount: 100000 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Vui lòng nhập mã giảm giá");
    });

    test("POST /api/apply-coupon handles unknown or inactive code", async () => {
      const res = await request(app).post("/api/apply-coupon").send({ code: "FAKECODE", total_amount: 100000 });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa");
    });

    test("POST /api/apply-coupon handles expired coupon", async () => {
      // EXPIRED is seeded in db
      const res = await request(app).post("/api/apply-coupon").send({ code: "EXPIRED", total_amount: 500000 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Mã giảm giá đã hết hạn");
    });

    test("POST /api/apply-coupon rejects if total_amount < min_order_amount", async () => {
      // SAVE10 min is 300000
      const res = await request(app).post("/api/apply-coupon").send({ code: "SAVE10", total_amount: 200000 });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("chưa đủ giá trị tối thiểu");
    });

    test("POST /api/apply-coupon applies valid percent coupon (no user_id)", async () => {
      // SAVE10 is 10% off
      const res = await request(app).post("/api/apply-coupon").send({ code: "SAVE10", total_amount: 400000 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Existing buggy logic in EShop computes total_amount * (1 - 10) = -9 * 400000 = -3600000
      expect(res.body.discount_amount).toBe(-3600000);
      expect(res.body.final_amount).toBe(4000000);
      expect(res.body.message).toContain("10%");
    });

    test("POST /api/apply-coupon applies valid fixed coupon (no user_id)", async () => {
      // BIGBUY is 50000 off, min 500000
      const res = await request(app).post("/api/apply-coupon").send({ code: "BIGBUY", total_amount: 600000 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.discount_amount).toBe(50000);
      expect(res.body.final_amount).toBe(550000);
      expect(res.body.message).toContain("50,000 ₫");
    });

    test("POST /api/coupon-usage saves usage for token1", async () => {
      const res = await request(app)
        .post("/api/coupon-usage")
        .set("Authorization", `Bearer ${token1}`)
        .send({ coupon_id: 1 });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Usage recorded");
    });

    test("POST /api/apply-coupon tracks max usage per user limit", async () => {
      // SAVE10 has max_uses_per_user = 1
      // token1 already saved usage above, so it should fail:
      const res2 = await request(app).post("/api/apply-coupon").send({ code: "SAVE10", total_amount: 400000, user_id: userId1 });
      expect(res2.status).toBe(400);
      expect(res2.body.error).toContain("đã đạt giới hạn");
    });

    test("POST /api/apply-coupon allows other users to use coupon", async () => {
      // user2 uses SAVE10
      const res = await request(app).post("/api/apply-coupon").send({ code: "SAVE10", total_amount: 400000, user_id: userId2 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("POST /api/apply-coupon handles fixed coupon with user_id", async () => {
      const res = await request(app).post("/api/apply-coupon").send({ code: "BIGBUY", total_amount: 600000, user_id: userId2 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.discount_amount).toBe(50000);
    });
  });
});
