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
