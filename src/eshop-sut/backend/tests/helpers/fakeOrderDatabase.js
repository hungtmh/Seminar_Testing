function createFakeOrderDatabase() {
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
  const orders = [];
  const couponUsage = [];
  const metrics = { couponUsageQueries: 0 };
  const coupons = [
    {
      id: 1,
      code: "SAVE10",
      type: "percent",
      discount_value: 10,
      min_order_amount: 300000,
      expired_at: "2099-12-31",
      is_active: 1,
      max_uses_per_user: 1,
    },
    {
      id: 2,
      code: "FIXED50",
      type: "fixed",
      discount_value: 50000,
      min_order_amount: 100000,
      expired_at: "2099-12-31",
      is_active: 1,
      max_uses_per_user: 2,
    },
    {
      id: 3,
      code: "EXPIRED",
      type: "percent",
      discount_value: 20,
      min_order_amount: 100000,
      expired_at: "2020-01-01",
      is_active: 1,
      max_uses_per_user: 1,
    },
    {
      id: 4,
      code: "INACTIVE",
      type: "fixed",
      discount_value: 10000,
      min_order_amount: 0,
      expired_at: "2099-12-31",
      is_active: 0,
      max_uses_per_user: 1,
    },
    {
      id: 5,
      code: "BOUNDARY",
      type: "fixed",
      discount_value: 1000,
      min_order_amount: 0,
      expired_at: "2030-01-01T00:00:00.000Z",
      is_active: 1,
      max_uses_per_user: 1,
    },
  ];

  let nextUserId = 1;
  let nextOrderId = 0;

  const normalizeSql = (sql) => sql.replace(/\s+/g, " ").trim();
  const copy = (row) => (row ? { ...row } : row);
  const finishRun = (callback, context, error = null) => {
    if (typeof callback === "function") callback.call(context, error);
  };
  const hasParameterCount = (params, expected, callback) => {
    if (!Array.isArray(params) || params.length !== expected) {
      callback(new Error(`Expected ${expected} query parameters`));
      return false;
    }
    return true;
  };

  return {
    __state: { users, orders, couponUsage, coupons, metrics },

    all(sql, params, callback) {
      const normalized = normalizeSql(sql);
      if (
        normalized ===
        "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC"
      ) {
        if (!hasParameterCount(params, 1, callback)) return;
        callback(
          null,
          orders
            .filter((order) => order.user_id === Number(params[0]))
            .slice()
            .sort((left, right) => right.id - left.id)
            .map(copy),
        );
        return;
      }

      callback(new Error(`Unexpected all query: ${normalized}`));
    },

    get(sql, params, callback) {
      const normalized = normalizeSql(sql);
      if (normalized === "SELECT * FROM users WHERE email = ?") {
        if (!hasParameterCount(params, 1, callback)) return;
        callback(null, copy(users.find((user) => user.email === params[0])));
        return;
      }
      if (
        normalized ===
        "SELECT * FROM orders WHERE id = ? AND user_id = ?"
      ) {
        if (!hasParameterCount(params, 2, callback)) return;
        callback(
          null,
          copy(
            orders.find(
              (order) =>
                order.id === Number(params[0]) &&
                order.user_id === Number(params[1]),
            ),
          ),
        );
        return;
      }
      if (normalized === "SELECT * FROM orders WHERE id = ?") {
        if (!hasParameterCount(params, 1, callback)) return;
        callback(
          null,
          copy(orders.find((order) => order.id === Number(params[0]))),
        );
        return;
      }
      if (normalized === "SELECT status FROM orders WHERE id = ?") {
        if (!hasParameterCount(params, 1, callback)) return;
        const order = orders.find((item) => item.id === Number(params[0]));
        callback(null, order ? { status: order.status } : undefined);
        return;
      }
      if (
        normalized ===
        "SELECT * FROM coupons WHERE code = ? AND is_active = 1"
      ) {
        if (!hasParameterCount(params, 1, callback)) return;
        callback(
          null,
          copy(
            coupons.find(
              (coupon) => coupon.code === params[0] && coupon.is_active === 1,
            ),
          ),
        );
        return;
      }
      if (
        normalized ===
        "SELECT COUNT(*) as usage_count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?"
      ) {
        if (!hasParameterCount(params, 2, callback)) return;
        metrics.couponUsageQueries++;
        callback(null, {
          usage_count: couponUsage.filter(
            (usage) =>
              usage.coupon_id === Number(params[0]) &&
              usage.user_id === Number(params[1]),
          ).length,
        });
        return;
      }

      callback(new Error(`Unexpected get query: ${normalized}`));
    },

    run(sql, params, callback) {
      const normalized = normalizeSql(sql);
      if (
        normalized ===
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
      ) {
        if (!hasParameterCount(params, 3, callback)) return;
        if (users.some((user) => user.email === params[1])) {
          finishRun(
            callback,
            {},
            new Error("UNIQUE constraint failed: users.email"),
          );
          return;
        }
        const user = {
          id: ++nextUserId,
          name: params[0],
          email: params[1],
          password: params[2],
          role: "user",
          login_attempts: 0,
          locked_until: null,
        };
        users.push(user);
        finishRun(callback, { lastID: user.id, changes: 1 });
        return;
      }
      if (
        normalized ===
        "UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?"
      ) {
        if (!hasParameterCount(params, 1, callback)) return;
        finishRun(callback, { changes: 1 });
        return;
      }
      if (
        normalized ===
        "UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?"
      ) {
        if (!hasParameterCount(params, 3, callback)) return;
        const user = users.find((item) => item.id === Number(params[2]));
        if (user) {
          user.login_attempts = params[0];
          user.locked_until = params[1];
        }
        finishRun(callback, { changes: user ? 1 : 0 });
        return;
      }
      if (
        normalized ===
        "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)"
      ) {
        if (!hasParameterCount(params, 4, callback)) return;
        if (params[3] === "FAIL_CHECKOUT") {
          finishRun(callback, {}, new Error("forced checkout failure"));
          return;
        }
        const order = {
          id: ++nextOrderId,
          user_id: Number(params[0]),
          total_amount: params[1],
          status: params[2],
          shipping_address: params[3],
          created_at: new Date().toISOString(),
        };
        orders.push(order);
        finishRun(callback, { lastID: order.id, changes: 1 });
        return;
      }
      if (normalized === "UPDATE orders SET status = ? WHERE id = ?") {
        if (!hasParameterCount(params, 2, callback)) return;
        const order = orders.find((item) => item.id === Number(params[1]));
        if (order) order.status = params[0];
        finishRun(callback, { changes: order ? 1 : 0 });
        return;
      }
      if (
        normalized ===
        "INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)"
      ) {
        if (!hasParameterCount(params, 2, callback)) return;
        if (Number(params[0]) === -1) {
          finishRun(callback, {}, new Error("forced usage failure"));
          return;
        }
        couponUsage.push({
          coupon_id: Number(params[0]),
          user_id: Number(params[1]),
        });
        finishRun(callback, { lastID: couponUsage.length, changes: 1 });
        return;
      }

      finishRun(callback, {}, new Error(`Unexpected run query: ${normalized}`));
    },
  };
}

module.exports = createFakeOrderDatabase;
