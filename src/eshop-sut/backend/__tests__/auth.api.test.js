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

  test("allows login when account lockout time (locked_until) has expired in the past", async () => {
    const db = require("../database");
    const user = await registerUser();
    const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();

    await new Promise((resolve) => {
      db.run("UPDATE users SET locked_until = ? WHERE email = ?", [pastDate, user.email], resolve);
    });

    const res = await request(app)
      .post("/api/login")
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("resets login_attempts to 0 in database after a successful login", async () => {
    const db = require("../database");
    const user = await registerUser();

    await new Promise((resolve) => {
      db.run("UPDATE users SET login_attempts = 2 WHERE email = ?", [user.email], resolve);
    });

    const res = await request(app)
      .post("/api/login")
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);

    const updatedUser = await new Promise((resolve) => {
      db.get("SELECT login_attempts, locked_until FROM users WHERE email = ?", [user.email], (err, row) => resolve(row));
    });

    expect(updatedUser.login_attempts).toBe(0);
    expect(updatedUser.locked_until).toBeNull();
  });
});



