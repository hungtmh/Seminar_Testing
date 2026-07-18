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

## 3. Full flow đã thực hiện

Quy trình làm lại từ đầu:

```text
Đọc code EShop -> Viết auth.api.test.js bản baseline yếu
-> Chạy Jest baseline -> Chạy Stryker baseline
-> Lưu reports/mutation/mutation.html vào mutation-auth-baseline
-> Đọc surviving mutants -> Cải thiện auth.api.test.js
-> Chạy Jest improved -> Chạy Stryker improved
-> Lưu reports/mutation/mutation.html vào mutation-auth-improved
-> Cập nhật báo cáo và PDF
```

## 4. Lệnh đã chạy

Chạy Jest baseline:

```powershell
cd eshop-sut\backend
npm test
```

Kết quả baseline:

```text
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
```

Chạy Stryker baseline:

```powershell
npm run mutation:auth
```

Sau khi chạy xong, lưu report baseline:

```powershell
mkdir reports\mutation-auth-baseline
copy reports\mutation\mutation.html reports\mutation-auth-baseline\mutation.html
```

Chạy Jest improved:

```powershell
npm test
```

Kết quả improved:

```text
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
```

Chạy Stryker improved:

```powershell
npm run mutation:auth
```

Sau khi chạy xong, lưu report improved:

```powershell
mkdir reports\mutation-auth-improved
copy reports\mutation\mutation.html reports\mutation-auth-improved\mutation.html
```

## 5. Cấu hình Stryker

File:

```text
eshop-sut/backend/stryker.auth.config.mjs
```

Nội dung chính:

```javascript
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  mutate: ["services/authService.js"],
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
```

Ý nghĩa:

```text
Stryker chỉ tạo mutant trong services/authService.js.
Sau mỗi mutant, Stryker chạy lại Jest/Supertest.
Report mặc định được sinh tại reports/mutation/mutation.html.
```

## 6. So sánh Baseline và Improved

Baseline là bản test yếu ban đầu, chỉ có các case cơ bản: đăng ký user, đăng nhập đúng, đăng nhập sai mật khẩu, profile không có token.

Improved là bản đã thêm assertion/test để kill surviving mutants: đăng ký trùng email, email không tồn tại, khóa tài khoản, lỗi database khi login, kiểm tra response body, kiểm tra JWT payload, profile với token hợp lệ.

| Lần chạy | Số test Jest | Mutation score | Killed | Timeout | Survived | NoCoverage | Errors | Report |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Baseline | 4 | 31.30% | 32 | 4 | 11 | 68 | 10 | `reports/mutation-auth-baseline/mutation.html` |
| Improved | 9 | 59.83% | 47 | 23 | 0 | 47 | 8 | `reports/mutation-auth-improved/mutation.html` |

Kết quả quan trọng:

```text
Survived mutants giảm từ 11 xuống 0.
Mutation score tăng từ 31.30% lên 59.83%.
NoCoverage giảm từ 68 xuống 47.
```

## 7. Survived mutants baseline và cách cải thiện

| Baseline mutant | Vì sao survived | Test/assertion đã thêm |
|---|---|---|
| `if (!user)` trong login bị đổi thành `if (false)` | Baseline chưa test email không tồn tại | Thêm test `rejects login for an unknown email` |
| Query reset `login_attempts` khi login thành công bị đổi params thành `[]` | Baseline chỉ check login trả `200`, chưa quan sát dữ liệu liên quan | Thêm kiểm tra JWT/user data và các flow login sau đó |
| `newAttempts = user.login_attempts + 2` bị đổi thành `- 2` | Baseline chỉ test một lần sai password | Thêm test sai password nhiều lần và account bị khóa |
| JWT payload bị đổi thành `{}` | Baseline chỉ check token tồn tại | Decode JWT và assert có `id`, `role` |
| Điều kiện lock `newAttempts >= 3` bị đổi thành `> 3` hoặc `< 3` | Baseline chưa test ngưỡng khóa tài khoản | Thêm test lock account sau nhiều lần sai password |
| Body lỗi login sai bị đổi thành `{}` | Baseline chỉ check status `401` | Assert body bằng `{ error: "Invalid email or password" }` |
| Header `authorization` bị đổi thành chuỗi rỗng | Baseline chỉ test không có token | Thêm test token hợp lệ gọi `GET /api/users/me` phải trả `200` |
| Body lỗi Unauthorized bị đổi thành `{}` hoặc error rỗng | Baseline chỉ check status `401` | Assert body bằng `{ error: "Unauthorized" }` |
| `if (token == null)` bị đổi thành `if (true)` | Baseline chưa có case token hợp lệ đi qua middleware | Thêm test profile với `Authorization: Bearer <token>` |

## 8. Test cases improved hiện tại

File:

```text
eshop-sut/backend/__tests__/auth.api.test.js
```

| # | Test case | Mục đích |
|---:|---|---|
| 1 | registers a user and returns a useful response body | Kiểm tra status và response body khi register thành công |
| 2 | rejects duplicate registration with the same email | Cover nhánh database error của register |
| 3 | logs in with a registered user and returns a JWT containing user data | Kiểm tra login thành công, message, user data và JWT payload |
| 4 | rejects login with a wrong password | Kiểm tra login sai password trả đúng error |
| 5 | rejects login for an unknown email | Cover nhánh `!user` trong login |
| 6 | locks a user after repeated wrong passwords | Bảo vệ logic `login_attempts` và `locked_until` |
| 7 | returns database error when login query fails | Cover nhánh `err` của `db.get` trong login |
| 8 | requires a token for current user profile | Kiểm tra middleware khi thiếu token |
| 9 | reads current user profile with a valid token | Kiểm tra middleware token hợp lệ và API profile |

## 9. Ghi chú về SQLite khi chạy Stryker

Khi chạy mặc định, Stryker tạo nhiều test runner để chạy nhanh hơn. Vì SQLite là file database, console có thể xuất hiện warning:

```text
SQLITE_BUSY: database is locked
ChildProcessCrashedError
```

Report vẫn dùng được nếu Stryker kết thúc và sinh HTML report. Trong lần chạy này Stryker đã hoàn thành và tạo đủ:

```text
reports/mutation-auth-baseline/mutation.html
reports/mutation-auth-improved/mutation.html
```

## 10. Kết luận

Phần Auth/User đã được làm lại đúng full flow từ đầu. Baseline cố ý còn yếu để Stryker sinh surviving mutants thật. Sau khi đọc mutant và thêm assertion/test, improved report không còn surviving mutant trong phạm vi Auth/User đã cover.
