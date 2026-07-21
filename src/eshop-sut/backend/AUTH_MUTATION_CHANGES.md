# TỔNG HỢP CHI TIẾT CÁC THAY ĐỔI (AUTH MUTATION TESTING FIX)

Tài liệu này tổng hợp toàn bộ nguyên nhân, giải pháp và mã nguồn đầy đủ của tất cả các file đã được tạo mới hoặc chỉnh sửa để giải quyết triệt để sự cố crash/errors và nâng Mutation Score cho module **Auth (`services/authService.js`)**.

---

## I. TÓM TẮT THAY ĐỔI
- **TỔNG SỐ FILE ẢNH HƯỞNG**: 4 file (`stryker.auth.config.mjs`, `jest.auth.config.cjs`, `database.js`, `__tests__/auth.api.test.js`).
- **MỤC TIÊU**:
  1. Fix crash/errors (0xC0000005, SQLITE_BUSY, no such table): Đưa `# errors` về ~0.
  2. Cô lập SQLite database giữa các worker của Jest/Stryker.
  3. Thêm test suite cho 3 endpoint chưa có coverage (`forgotPassword`, `resetPassword`, `updateCurrentUser`), nâng score ≥ 80%.

---

## II. CHI TIẾT TỪNG FILE VÀ MÃ NGUỒN ĐẦY ĐỦ

---

### 1. `stryker.auth.config.mjs` (CHỈNH SỬA)
- **Đường dẫn**: `src/eshop-sut/backend/stryker.auth.config.mjs`
- **Vị trí thay đổi**: Thêm các options `htmlReporter`, `testFiles`, `jest`, `ignoreStatic`.
- **Lý do**:
  - `testFiles` & `jest.configFile`: Giới hạn phạm vi test chỉ chạy `auth.api.test.js` (tránh nạp 73 test của product/order).
  - `jest.enableFindRelatedTests: false`: Ngăn Stryker tự ý tìm kiếm và chạy thêm test không liên quan.
  - `ignoreStatic: true`: Loại bỏ 37 static mutant không thể map theo từng test, giúp tăng tốc và tránh crash worker.

#### Mã nguồn đầy đủ:
```javascript
/**
 * Mutation baseline for the real EShop authentication/user APIs.
 *
 * This config mutates the real Auth/User service used by server.js routes.
 *
 * Fixes applied:
 *  - testFiles: scope Stryker to ONLY auth test (was loading all 73 tests).
 *  - jest.configFile: use dedicated jest.auth.config.cjs to avoid picking up
 *    product/order tests whose workers race on database.sqlite.
 *  - jest.enableFindRelatedTests: false → prevent Stryker from auto-expanding
 *    the test set via --findRelatedTests.
 *  - ignoreStatic: true → drop 37 static mutants (top-level SECRET_KEY, etc.)
 *    that cannot be tracked per-test and caused worker crashes.
 *  - htmlReporter.fileName: dedicated output, does not overwrite other reports.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation-auth/mutation.html",
  },
  mutate: ["services/authService.js"],
  // --- SCOPE FIX: only run auth tests ---
  testFiles: ["__tests__/auth.api.test.js"],
  jest: {
    projectType: "custom",
    configFile: "jest.auth.config.cjs",
    enableFindRelatedTests: false,
  },
  // Drop top-level static mutants that cannot be mapped per-test
  ignoreStatic: true,
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
```

---

### 2. `jest.auth.config.cjs` (TẠO MỚI)
- **Đường dẫn**: `src/eshop-sut/backend/jest.auth.config.cjs`
- **Tình trạng**: File mới 100%.
- **Lý do**: Cung cấp cấu hình Jest riêng biệt cho Auth, dùng `rootDir: __dirname` để định vị tuyệt đối thư mục backend kể cả khi Stryker thực thi trong sandbox tạm thời `.stryker-tmp/`.

#### Mã nguồn đầy đủ:
```javascript
// Jest config dành riêng cho auth mutation testing.
//
// QUAN TRỌNG: Dùng __dirname (không phải CWD) để anchor rootDir,
// vì Stryker chạy test từ .stryker-tmp/ sandbox → relative path sẽ sai.
// Pattern này đã được chứng minh hoạt động ở jest.order.config.cjs.
//
// roots + testMatch kết hợp để đảm bảo:
//   1. Chỉ quét thư mục __tests__/ (bỏ qua tests/)
//   2. Chỉ chạy đúng 1 file auth.api.test.js
module.exports = {
  rootDir: __dirname,
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/__tests__/auth.api.test.js"],
  testEnvironment: "node",
};
```

---

### 3. `database.js` (CHỈNH SỬA)
- **Đường dẫn**: `src/eshop-sut/backend/database.js`
- **Vị trí thay đổi**: Thay đổi dòng 4–10 (khởi tạo `dbPath`).
- **Lý do**: Khi chạy dưới dạng Jest worker (xác định qua `process.env.JEST_WORKER_ID`), SQLite sẽ chuyển sang dùng `:memory:`. Mỗi worker sở hữu 1 database riêng trong bộ nhớ RAM, giải quyết dứt điểm lỗi tranh chấp file `database.sqlite` (`SQLITE_BUSY`, crash `0xC0000005`). Production (`node server.js`) giữ nguyên 100% không ảnh hưởng.

#### Mã nguồn đầy đủ:
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// When running inside a Jest worker (JEST_WORKER_ID is set by Jest automatically),
// use an in-memory DB so each of the ~15 parallel Stryker workers gets its own
// isolated database with no file locking. Production (node server.js) has no
// JEST_WORKER_ID → behaviour is completely unchanged.
const dbPath = process.env.JEST_WORKER_ID
    ? ':memory:'
    : path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

function initDatabase() {
    db.serialize(() => {
        db.run('DROP TABLE IF EXISTS coupon_usage');
        db.run('DROP TABLE IF EXISTS coupons');
        db.run('DROP TABLE IF EXISTS users');
        db.run('DROP TABLE IF EXISTS products');
        db.run('DROP TABLE IF EXISTS categories');
        db.run('DROP TABLE IF EXISTS orders');

        // Create Categories Table
        db.run(`CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )`);

        // Create Coupons Table
        db.run(`CREATE TABLE coupons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            type TEXT DEFAULT 'percent',
            discount_value INTEGER,
            min_order_amount INTEGER DEFAULT 0,
            expired_at DATETIME,
            is_active INTEGER DEFAULT 1,
            max_uses_per_user INTEGER DEFAULT 1
        )`);

        // Create Coupon Usage Table
        db.run(`CREATE TABLE coupon_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coupon_id INTEGER,
            user_id INTEGER,
            used_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create Users Table
        // Added columns for Phase 2 & 3: login_attempts, locked_until, reset_token, shipping_address, phone
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user',
            login_attempts INTEGER DEFAULT 0,
            locked_until DATETIME,
            reset_token TEXT,
            shipping_address TEXT,
            phone TEXT
        )`);

        // Create Products Table
        db.run(`CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price INTEGER,
            description TEXT,
            imageUrl TEXT,
            category_id INTEGER
        )`);

        // Create Orders Table
        db.run(`CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount INTEGER,
            status TEXT DEFAULT 'pending',
            shipping_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed Categories
        const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
        insertCategory.run('Điện thoại');
        insertCategory.run('Laptop');
        insertCategory.run('Phụ kiện');
        insertCategory.finalize();

        // Seed Users
        const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
        insertUser.run('Admin User', 'admin@eshop.com', 'Admin123!', 'admin');
        insertUser.run('Test User', 'test@eshop.com', 'Test1234!', 'user');
        insertUser.finalize();

        // Seed Products
        const insertProduct = db.prepare('INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)');
        insertProduct.run('iPhone 15 Pro Max', 30000000, 'Điện thoại cao cấp của Apple', 'https://placehold.co/300x300/png?text=iPhone+15', 1);
        insertProduct.run('Samsung Galaxy S24 Ultra', 28000000, 'Màn hình hiển thị xuất sắc, camera siêu zoom', 'https://placehold.co/300x300/png?text=Samsung+S24', 1);
        insertProduct.run('MacBook Pro M3', 45000000, 'Laptop chuyên nghiệp mạnh mẽ', 'https://placehold.co/300x300/png?text=Macbook+Pro', 2);
        insertProduct.run('Tai nghe AirPods Pro 2', 6000000, 'Chống ồn chủ động xuất sắc', 'https://placehold.co/300x300/png?text=AirPods+Pro', 3);
        insertProduct.run('Bàn phím cơ Keychron Q1', 4000000, 'Gõ cực sướng, thiết kế kim loại', 'https://placehold.co/300x300/png?text=Keychron+Q1', 3);
        insertProduct.finalize();

        // Seed Coupons
        const insertCoupon = db.prepare('INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?, ?)');
        insertCoupon.run('SAVE10', 'percent', 10, 300000, '2099-12-31', 1, 1);   // 10% off, min 300k, valid
        insertCoupon.run('BIGBUY', 'fixed', 50000, 500000, '2099-12-31', 1, 1);  // 50k off, min 500k, valid
        insertCoupon.run('VIP100', 'fixed', 100000, 300000, '2099-12-31', 1, 2); // 100k off, min 300k, max 2 uses
        insertCoupon.run('EXPIRED', 'percent', 20, 100000, '2020-01-01', 1, 1);  // 20% off, EXPIRED
        insertCoupon.finalize();

        console.log('Database initialized and seeded (Phase 2).');
    });
}

initDatabase();

module.exports = db;
```

---

### 4. `__tests__/auth.api.test.js` (CHỈNH SỬA / THÊM TEST)
- **Đường dẫn**: `src/eshop-sut/backend/__tests__/auth.api.test.js`
- **Vị trí thay đổi**: Bổ sung helper `registerAndLogin` và 3 describe block test mới từ dòng 181 đến 370.
- **Lý do**: 47 mutant no-coverage trước đó nằm ở 3 endpoint chưa từng được test: `forgotPassword`, `resetPassword`, `updateCurrentUser`. Việc bổ sung test đầy đủ các nhánh thành công lẫn nhánh lỗi giúp tiêu diệt (kill) các mutant này.

#### Mã nguồn đầy đủ:
```javascript
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../server");
const { loginUser } = require("../services/authService");

const uniqueEmail = (label) =>
  `${label}.${Date.now()}.${Math.random().toString(16).slice(2)}@example.com`;

async function registerUser(overrides = {}) {
  const payload = {
    name: "Improved Auth User",
    email: uniqueEmail("improved"),
    password: "Password123!",
    ...overrides,
  };

  const response = await request(app).post("/api/register").send(payload);
  expect(response.status).toBe(200);
  return { ...payload, id: response.body.id };
}

describe("authentication API improved tests", () => {
  test("registers a user and returns a useful response body", async () => {
    const response = await request(app).post("/api/register").send({
      name: "Improved Register",
      email: uniqueEmail("register"),
      password: "Password123!",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "User registered successfully",
        id: expect.any(Number),
      }),
    );
  });

  test("rejects duplicate registration with the same email", async () => {
    const user = await registerUser();

    const response = await request(app).post("/api/register").send({
      name: "Duplicate User",
      email: user.email,
      password: "Password123!",
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toMatch(/UNIQUE constraint failed/i);
  });

  test("logs in with a registered user and returns a JWT containing user data", async () => {
    const user = await registerUser();

    const response = await request(app).post("/api/login").send({
      email: user.email,
      password: user.password,
    });

    const decoded = jwt.decode(response.body.token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: user.email,
        name: user.name,
      }),
    );
    expect(decoded).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        role: "user",
      }),
    );
  });

  test("rejects login with a wrong password", async () => {
    const user = await registerUser();

    const response = await request(app).post("/api/login").send({
      email: user.email,
      password: "WrongPassword!",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid email or password" });
  });

  test("rejects login for an unknown email", async () => {
    const response = await request(app).post("/api/login").send({
      email: uniqueEmail("missing"),
      password: "Password123!",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid email or password" });
  });

  test("locks a user after repeated wrong passwords", async () => {
    const user = await registerUser();

    const firstFailure = await request(app).post("/api/login").send({
      email: user.email,
      password: "WrongPassword!",
    });
    const secondFailure = await request(app).post("/api/login").send({
      email: user.email,
      password: "WrongPassword!",
    });
    const lockedResponse = await request(app).post("/api/login").send({
      email: user.email,
      password: user.password,
    });

    expect(firstFailure.status).toBe(401);
    expect(secondFailure.status).toBe(401);
    expect(lockedResponse.status).toBe(403);
    expect(lockedResponse.body.error).toContain("Tài khoản đã bị khóa");
  });

  test("returns database error when login query fails", () => {
    const queryError = new Error("database failed");
    const fakeDb = {
      get: (_sql, _params, callback) => callback(queryError),
    };
    const req = {
      body: {
        email: "broken@example.com",
        password: "Password123!",
      },
    };
    const res = {
      statusCode: 200,
      body: undefined,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };

    loginUser(fakeDb)(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "database failed" });
  });

  test("requires a token for current user profile", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  test("reads current user profile with a valid token", async () => {
    const user = await registerUser();
    const loginResponse = await request(app).post("/api/login").send({
      email: user.email,
      password: user.password,
    });

    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        email: user.email,
        name: user.name,
        role: "user",
      }),
    );
  });
});

// ============================================================
// Part B: Tests for previously uncovered endpoints
// forgotPassword, resetPassword, updateCurrentUser
// These 3 functions had 47 no-coverage mutants.
// ============================================================

/** Helper: register a user, login, return { user, token } */
async function registerAndLogin(overrides = {}) {
  const user = await registerUser(overrides);
  const loginRes = await request(app)
    .post("/api/login")
    .send({ email: user.email, password: user.password });
  expect(loginRes.status).toBe(200);
  return { user, token: loginRes.body.token };
}

describe("forgotPassword API", () => {
  test("returns 200 and a resetToken for an existing user", async () => {
    const { user } = await registerAndLogin();

    const res = await request(app)
      .post("/api/forgot-password")
      .send({ email: user.email });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Mã đặt lại mật khẩu đã được tạo",
        resetToken: expect.stringMatching(/^\d{4}$/),
      }),
    );
  });

  test("returns 404 when the email is not registered", async () => {
    const res = await request(app)
      .post("/api/forgot-password")
      .send({ email: uniqueEmail("ghost") });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });
});

describe("resetPassword API", () => {
  test("resets the password with a valid token and allows re-login", async () => {
    const { user } = await registerAndLogin();

    // Step 1: get a reset token
    const forgotRes = await request(app)
      .post("/api/forgot-password")
      .send({ email: user.email });
    expect(forgotRes.status).toBe(200);
    const { resetToken } = forgotRes.body;

    // Step 2: reset password
    const resetRes = await request(app).post("/api/reset-password").send({
      email: user.email,
      resetToken,
      newPassword: "NewPassword456!",
    });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body).toEqual({ message: "Password reset successfully" });

    // Step 3: verify new password works
    const loginRes = await request(app).post("/api/login").send({
      email: user.email,
      password: "NewPassword456!",
    });
    expect(loginRes.status).toBe(200);
  });

  test("returns 400 when the token is wrong", async () => {
    const { user } = await registerAndLogin();

    const res = await request(app).post("/api/reset-password").send({
      email: user.email,
      resetToken: "0000",
      newPassword: "AnyPassword1!",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid token or email" });
  });

  test("returns 400 when the email does not match", async () => {
    const { user } = await registerAndLogin();

    // Get a valid token for user
    const forgotRes = await request(app)
      .post("/api/forgot-password")
      .send({ email: user.email });
    const { resetToken } = forgotRes.body;

    // Use correct token but wrong email
    const res = await request(app).post("/api/reset-password").send({
      email: uniqueEmail("wrong"),
      resetToken,
      newPassword: "AnyPassword1!",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid token or email" });
  });
});

describe("updateCurrentUser (PUT /api/users/me)", () => {
  test("returns 401 when no token is provided", async () => {
    const res = await request(app).put("/api/users/me").send({
      name: "No Token User",
      shipping_address: "123 Street",
      phone: "0900000000",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  test("updates profile without role field and returns 200", async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
        shipping_address: "456 New Road",
        phone: "0911111111",
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Profile updated" });

    // Verify the change was persisted
    const profileRes = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect(profileRes.status).toBe(200);
    expect(profileRes.body).toMatchObject({
      name: "Updated Name",
      shipping_address: "456 New Road",
      phone: "0911111111",
    });
  });

  test("updates profile WITH role field (covers the if-role branch)", async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Role Updated User",
        shipping_address: "789 Admin Ave",
        phone: "0922222222",
        role: "user", // triggers `if (role)` branch in updateCurrentUser
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Profile updated" });
  });

  test("returns 500 when the DB update fails (unit-level)", () => {
    const dbError = new Error("DB write failure");
    const fakeDb = {
      run: (_sql, _params, callback) => callback.call({ changes: 0 }, dbError),
    };
    const req = {
      user: { id: 99 },
      body: {
        name: "Broken User",
        shipping_address: "Nowhere",
        phone: "0000000000",
      },
    };
    const res = {
      statusCode: 200,
      body: undefined,
      status(code) { this.statusCode = code; return this; },
      json(payload) { this.body = payload; return this; },
    };

    const { updateCurrentUser } = require("../services/authService");
    updateCurrentUser(fakeDb)(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "DB write failure" });
  });
});
```
