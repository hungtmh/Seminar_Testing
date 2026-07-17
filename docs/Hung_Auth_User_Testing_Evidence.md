# Evidence - Auth/User API Testing

Phu trach: 23127195 - Tran Manh Hung

## 1. Pham vi

Phan nay test truc tiep Auth/User API that trong EShop backend, khong dung module demo ben ngoai project.

Code EShop duoc test/mutate:

```text
eshop-sut/backend/server.js
eshop-sut/backend/services/authService.js
eshop-sut/backend/database.js
```

File test:

```text
eshop-sut/backend/__tests__/auth.api.test.js
```

Config Stryker:

```text
eshop-sut/backend/stryker.auth.config.mjs
```

## 2. Cach ket noi API test voi logic that

`server.js` van giu route API that:

```javascript
app.post("/api/register", registerUser(db));
app.post("/api/login", loginUser(db));
app.post("/api/forgot-password", forgotPassword(db));
app.post("/api/reset-password", resetPassword(db));
app.get("/api/users/me", authenticateToken, getCurrentUser(db));
app.put("/api/users/me", authenticateToken, updateCurrentUser(db));
```

Logic Auth/User duoc tach tu `server.js` sang:

```text
eshop-sut/backend/services/authService.js
```

Jest/Supertest goi API that qua Express app:

```text
auth.api.test.js -> server.js route -> authService.js -> database.sqlite
```

Vi vay test van la API test that, khong phai test module gia.

## 3. Lenh chay

Chay Jest:

```powershell
cd eshop-sut\backend
npm test
```

Ket qua improved moi nhat:

```text
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
```

Chay Stryker Auth:

```powershell
cd eshop-sut\backend
npm run mutation:auth
```

Stryker config mutate logic that:

```javascript
mutate: ["services/authService.js"]
```

Report mac dinh moi lan chay:

```text
eshop-sut/backend/reports/mutation/mutation.html
```

Report da luu rieng:

```text
eshop-sut/backend/reports/mutation-auth-baseline/mutation.html
eshop-sut/backend/reports/mutation-auth-improved/mutation.html
```

## 4. Baseline vs Improved

Baseline la ban test yeu ban dau, chi co cac case co ban: register, login dung, login sai password, profile khong token.

Improved la ban da them assertion/test de kill surviving mutants: duplicate registration, unknown email, lock account, login DB error, response body, profile token hop le.

| Lan chay | Jest tests | Mutation score | Killed | Timeout | Survived | NoCoverage | Errors | Report |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Baseline | 4 | 38.14% | 28 | 17 | 5 | 68 | 7 | `reports/mutation-auth-baseline/mutation.html` |
| Improved | 9 | 59.83% | 48 | 22 | 0 | 47 | 8 | `reports/mutation-auth-improved/mutation.html` |

Ket qua quan trong:

```text
Survived mutants giam tu 5 xuong 0.
Mutation score tang tu 38.14% len 59.83%.
NoCoverage giam tu 68 xuong 47.
```

## 5. Survived mutants baseline va cach cai thien

| Baseline mutant | Vi sao survived | Test/assertion da them |
|---|---|---|
| Register response body bi doi thanh `{}` hoac message rong | Test baseline chi check status `200`, chua check body | Assert `message: "User registered successfully"` va `id: expect.any(Number)` |
| Header `authorization` bi doi thanh chuoi rong | Test baseline chi goi profile khong token, chua co token hop le | Them test login lay token va `GET /api/users/me` phai tra `200` |
| Unauthorized body bi doi thanh `{}` hoac error rong | Test baseline chi check status `401` | Assert body bang `{ error: "Unauthorized" }` |
| `if (token == null)` bi doi thanh `if (true)` | Chua test truong hop token hop le di qua middleware | Them test profile voi `Authorization: Bearer <token>` |
| Login attempts update bi doi nhung test van pass | Test baseline chi check mot lan sai password | Them test sai password nhieu lan va account bi khoa |

## 6. Test cases improved hien tai

File:

```text
eshop-sut/backend/__tests__/auth.api.test.js
```

| # | Test case | Muc dich |
|---:|---|---|
| 1 | registers a user | Check status va response body khi register thanh cong |
| 2 | rejects duplicate registration with the same email | Cover nhanh database error cua register |
| 3 | logs in with a registered user | Check login thanh cong, message va token |
| 4 | rejects login with a wrong password | Check login sai password tra dung error |
| 5 | rejects login for an unknown email | Cover nhanh `!user` trong login |
| 6 | locks a user after repeated wrong passwords | Bao ve logic `login_attempts` va `locked_until` |
| 7 | returns database error when login query fails | Cover nhanh `err` cua `db.get` trong login |
| 8 | requires a token for current user profile | Check middleware khi thieu token |
| 9 | reads current user profile with a valid token | Check middleware token hop le va API profile |

## 7. Ghi chu ve SQLite khi chay Stryker

Stryker co the tao nhieu sandbox/test runner va SQLite la file database, nen co the gap warning:

```text
SQLITE_BUSY: database is locked
ChildProcessCrashedError
```

Report van dung neu Stryker ket thuc va sinh HTML report. De giam lock, config da them:

```javascript
maxConcurrentTestRunners: 1
```

## 8. Ket luan

Phan Auth/User da di dung full flow:

```text
Doc code EShop -> Viet Jest baseline -> Chay Jest -> Chay Stryker baseline
-> Doc survived mutants -> Them assertion/test -> Chay Jest -> Chay Stryker improved
-> Luu baseline/improved report
```

Ket qua improved khong con surviving mutant trong pham vi Auth/User da cover.
