# Bằng Chứng Kiểm Thử API Auth/User

Phụ trách: 23127195 - Trần Mạnh Hùng

## 1. Phạm vi

Phần này kiểm thử trực tiếp các API Auth/User thật trong backend EShop, không dùng module demo tách rời khỏi project.

Code EShop được kiểm thử và mutation:

```text
eshop-sut/backend/server.js
eshop-sut/backend/services/authService.js
eshop-sut/backend/database.js
```

File test:

```text
eshop-sut/backend/__tests__/auth.api.test.js
```

File cấu hình Stryker:

```text
eshop-sut/backend/stryker.auth.config.mjs
```

## 2. Cách kết nối API test với logic thật

`server.js` vẫn giữ các route API thật:

```javascript
app.post("/api/register", registerUser(db));
app.post("/api/login", loginUser(db));
app.post("/api/forgot-password", forgotPassword(db));
app.post("/api/reset-password", resetPassword(db));
app.get("/api/users/me", authenticateToken, getCurrentUser(db));
app.put("/api/users/me", authenticateToken, updateCurrentUser(db));
```

Logic Auth/User được tách từ `server.js` sang:

```text
eshop-sut/backend/services/authService.js
```

Jest/Supertest gọi API thật qua Express app:

```text
auth.api.test.js -> server.js route -> authService.js -> database.sqlite
```

Vì vậy đây vẫn là API test thật của EShop, không phải test một module giả.

## 3. Lệnh đã chạy

Chạy Jest:

```powershell
cd eshop-sut\backend
npm test
```

Kết quả improved mới nhất:

```text
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
```

Chạy Stryker cho Auth/User:

```powershell
cd eshop-sut\backend
npm run mutation:auth
```

Stryker config mutate logic thật:

```javascript
mutate: ["services/authService.js"]
```

Report mặc định sau mỗi lần chạy:

```text
eshop-sut/backend/reports/mutation/mutation.html
```

Report đã lưu riêng:

```text
eshop-sut/backend/reports/mutation-auth-baseline/mutation.html
eshop-sut/backend/reports/mutation-auth-improved/mutation.html
```

## 4. So sánh Baseline và Improved

Baseline là bản test yếu ban đầu, chỉ có các case cơ bản: đăng ký user, đăng nhập đúng, đăng nhập sai mật khẩu, profile không có token.

Improved là bản đã thêm assertion/test để kill surviving mutants: đăng ký trùng email, email không tồn tại, khóa tài khoản, lỗi database khi login, kiểm tra response body, profile với token hợp lệ.

| Lần chạy | Số test Jest | Mutation score | Killed | Timeout | Survived | NoCoverage | Errors | Report |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Baseline | 4 | 38.14% | 28 | 17 | 5 | 68 | 7 | `reports/mutation-auth-baseline/mutation.html` |
| Improved | 9 | 59.83% | 48 | 22 | 0 | 47 | 8 | `reports/mutation-auth-improved/mutation.html` |

Kết quả quan trọng:

```text
Survived mutants giảm từ 5 xuống 0.
Mutation score tăng từ 38.14% lên 59.83%.
NoCoverage giảm từ 68 xuống 47.
```

## 5. Survived mutants baseline và cách cải thiện

| Baseline mutant | Vì sao survived | Test/assertion đã thêm |
|---|---|---|
| Register response body bị đổi thành `{}` hoặc message rỗng | Test baseline chỉ check status `200`, chưa check response body | Assert `message: "User registered successfully"` và `id: expect.any(Number)` |
| Header `authorization` bị đổi thành chuỗi rỗng | Test baseline chỉ gọi profile không token, chưa có case token hợp lệ | Thêm test login lấy token và `GET /api/users/me` phải trả `200` |
| Unauthorized body bị đổi thành `{}` hoặc error rỗng | Test baseline chỉ check status `401` | Assert body bằng `{ error: "Unauthorized" }` |
| `if (token == null)` bị đổi thành `if (true)` | Chưa test trường hợp token hợp lệ đi qua middleware | Thêm test profile với `Authorization: Bearer <token>` |
| Login attempts update bị đổi nhưng test vẫn pass | Test baseline chỉ check một lần sai password | Thêm test sai password nhiều lần và account bị khóa |

## 6. Test cases improved hiện tại

File:

```text
eshop-sut/backend/__tests__/auth.api.test.js
```

| # | Test case | Mục đích |
|---:|---|---|
| 1 | registers a user | Kiểm tra status và response body khi register thành công |
| 2 | rejects duplicate registration with the same email | Cover nhánh database error của register |
| 3 | logs in with a registered user | Kiểm tra login thành công, message và token |
| 4 | rejects login with a wrong password | Kiểm tra login sai password trả đúng error |
| 5 | rejects login for an unknown email | Cover nhánh `!user` trong login |
| 6 | locks a user after repeated wrong passwords | Bảo vệ logic `login_attempts` và `locked_until` |
| 7 | returns database error when login query fails | Cover nhánh `err` của `db.get` trong login |
| 8 | requires a token for current user profile | Kiểm tra middleware khi thiếu token |
| 9 | reads current user profile with a valid token | Kiểm tra middleware token hợp lệ và API profile |

## 7. Ghi chú về SQLite khi chạy Stryker

Stryker có thể tạo nhiều sandbox/test runner và SQLite là file database, nên có thể gặp warning:

```text
SQLITE_BUSY: database is locked
ChildProcessCrashedError
```

Report vẫn dùng được nếu Stryker kết thúc và sinh HTML report. Để giảm lỗi lock, config đã thêm:

```javascript
maxConcurrentTestRunners: 1
```

## 8. Kết luận

Phần Auth/User đã đi đúng full flow:

```text
Đọc code EShop -> Viết Jest baseline -> Chạy Jest -> Chạy Stryker baseline
-> Đọc surviving mutants -> Thêm assertion/test -> Chạy Jest
-> Chạy Stryker improved -> Lưu baseline/improved report
```

Kết quả improved không còn surviving mutant trong phạm vi Auth/User đã cover.
