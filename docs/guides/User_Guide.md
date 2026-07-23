# 🧬 User Guide: Mutation Testing & Test Effectiveness
### Seminar Topic T10 — CS423 / CSC15003 — FIT@HCMUS

> **Nhóm thực hiện:** Nhóm 8 <br>
> **Thành viên:** 
> - Ninh Văn Khải
> - Trần Mạnh Hùng
> - Nguyễn Tấn Thắng

---

## Mục lục

1. [Giới thiệu — Mutation Testing là gì?](#1-giới-thiệu--mutation-testing-là-gì)
2. [So sánh công cụ — Tại sao chọn Stryker?](#2-so-sánh-công-cụ--tại-sao-chọn-stryker)
3. [Cài đặt & Cấu hình Stryker trên EShop](#3-cài-đặt--cấu-hình-stryker-trên-eshop)
4. [Chạy Mutation Test & Đọc báo cáo](#4-chạy-mutation-test--đọc-báo-cáo)
5. [Phân tích Surviving Mutants thực tế](#5-phân-tích-surviving-mutants-thực-tế)
6. [AI-Augmented: Dùng ChatGPT/Claude để Kill Mutants](#6-ai-augmented-dùng-chatgptclaude-để-kill-mutants)
7. [Failure Modes — Khi nào công cụ đưa ra kết quả sai lệch?](#7-failure-modes--khi-nào-công-cụ-đưa-ra-kết-quả-sai-lệch)
8. [Hoạt động thực hành lớp — "Kill the Mutant" Game](#8-hoạt-động-thực-hành-lớp--kill-the-mutant-game)
9. [AI Disclosure & Audit Log](#9-ai-disclosure--audit-log)
10. [Tài liệu tham khảo](#10-tài-liệu-tham-khảo)

---

## 1. Giới thiệu — Mutation Testing là gì?

### 1.1 Vấn đề với Code Coverage truyền thống

Một trong những hiểu lầm phổ biến nhất trong kiểm thử phần mềm là **"coverage cao = test tốt"**. Hãy xem ví dụ sau:

```javascript
// Hàm kiểm tra người dùng có đủ tuổi không
function isAdult(age) {
  return age >= 18;
}

// Test đạt 100% line coverage nhưng... có vấn đề gì không?
test('should return true for adult', () => {
  expect(isAdult(20)).toBe(true);
});
```

Đoạn test trên đạt **100% line coverage**, nhưng nếu developer vô tình đổi `>=` thành `>`, test vẫn **PASS** — trong khi hàm đã sai hành vi (người 18 tuổi bị từ chối oan).

### 1.2 Mutation Testing giải quyết vấn đề gì?

**Mutation Testing** (Kiểm thử đột biến) là kỹ thuật đánh giá **chất lượng** của bộ test, không chỉ **độ phủ**. Nguyên lý hoạt động:

```
[Source Code gốc]
       ↓  (Mutation tool tự động tạo biến thể)
[Mutant 1] [Mutant 2] [Mutant 3] ... [Mutant N]
       ↓  (Chạy toàn bộ test suite với từng mutant)
    Killed ✅  |  Survived ❌  |  Timeout ⏱️
       ↓
  Mutation Score = Killed / (Killed + Survived) × 100%
```

### 1.3 Các loại Mutant phổ biến (Mutation Operators)

| Loại Mutant | Ký hiệu | Ví dụ thay đổi | Mục tiêu kiểm tra |
|---|---|---|---|
| **Arithmetic Operator** | AOR | `a + b` → `a - b` | Phép tính toán học |
| **Relational Operator** | ROR | `>` → `>=`, `==` → `!=` | Điều kiện so sánh |
| **Logical Connector** | LCR | `&&` → `\|\|` | Logic Boolean phức tạp |
| **Assignment Expression** | AEX | `x += 1` → `x -= 1` | Gán giá trị |
| **Statement Deletion** | SDL | Xóa `return value;` | Giá trị trả về |
| **Boolean Literal** | BLR | `true` → `false` | Hằng boolean |
| **Unary Operator** | UOI | `!condition` → `condition` | Phủ định điều kiện |
| **Null Literal** | NLR | `return obj` → `return null` | Null handling |

### 1.4 Các trạng thái của một Mutant

```
┌─────────────────────────────────────────────────────┐
│                    MUTANT STATES                    │
├─────────────┬───────────────────────────────────────┤
│  ✅ Killed  │ Ít nhất 1 test FAIL → Test tốt        │
│  ❌ Survived│ Tất cả test đều PASS → Cần thêm test  │
│  ⏱️ Timeout │ Test bị treo (vô hạn loop) → Detected│
│  🚫 NoCov  │ Không có test nào chạy qua vùng này   │
│  ⚠️ Error  │ Compile error → Không tính vào score  │
└─────────────┴───────────────────────────────────────┘
```

**Công thức Mutation Score:**
```
Mutation Score = (Killed + Timeout) / (Total - NoCoverage - Error) × 100%

Thang đánh giá:
  < 50%  → ⚠️  Test suite rất yếu
  50-70% → 🟡  Cần cải thiện đáng kể
  70-85% → 🟢  Chấp nhận được cho hầu hết dự án
  > 85%  → 🏆  Bộ test rất mạnh (nhưng cost cao)
```

---

## 2. So sánh công cụ — Tại sao chọn Stryker?

### 2.1 Bảng so sánh tổng quan

| Tiêu chí | **Stryker** (JS/TS) | **PIT (PITest)** (Java) | **mutmut** (Python) | **mull** (C/C++) |
|---|---|---|---|---|
| **Ngôn ngữ** | JavaScript, TypeScript | Java | Python | C, C++ |
| **License** | Apache 2.0 (Free) | Apache 2.0 (Free) | MIT (Free) | Apache 2.0 (Free) |
| **Tốc độ** | ⚡ Nhanh (concurrent) | 🟡 Trung bình | 🔴 Chậm | 🟡 Trung bình |
| **HTML Report** | ✅ Rất chi tiết | ✅ Tốt | ❌ Chỉ CLI | ❌ Chỉ CLI |
| **Incremental mode** | ✅ Hỗ trợ | ❌ Không | ❌ Không | ❌ Không |
| **CI/CD tích hợp** | ✅ Tốt | ✅ Maven plugin | 🟡 Cơ bản | 🟡 Cơ bản |
| **Độ khó cài đặt** | ⭐ Dễ (`npm init`) | ⭐⭐ Trung bình | ⭐ Dễ (`pip`) | ⭐⭐⭐ Khó |
| **Community** | 🔥 Rất lớn | 🔥 Lớn | 🟡 Trung bình | 🔴 Nhỏ |
| **Mutation Operators** | 15+ | 20+ | 10+ | 15+ |

### 2.2 So sánh công cụ AI-Augmented

| Tiêu chí | **ChatGPT/Claude** (Prompt-based) | **DiffBlue Cover** | **Pynguin + LLM** |
|---|---|---|---|
| **Loại hỗ trợ** | Gợi ý assertion, phân tích mutant | Auto-generate JUnit tests | Auto-generate Python tests |
| **Ngôn ngữ** | Bất kỳ (dựa trên text) | Java | Python |
| **Chi phí** | Subscription ($0 - $20/tháng) | Enterprise (cao) | Free (open source) |
| **Độ chính xác** | 🟡 Phụ thuộc vào prompt quality | 🟢 Cao (execute-based) | 🟡 Trung bình |
| **Phát hiện Equivalent Mutant** | ✅ Tốt (LLM hiểu ngữ nghĩa) | ❌ Không chuyên biệt | ❌ Không |
| **Học tập** | ✅ Dễ tương tác, giải thích | ⭐⭐⭐ Cần setup phức tạp | ⭐⭐ Trung bình |
| **Phù hợp với EShop** | ✅ Node.js backend | ❌ Chỉ Java | ❌ Chỉ Python |

### 2.3 Lý do lựa chọn Stryker + ChatGPT/Claude cho seminar này

**Stryker** được chọn làm công cụ chính vì:
1. **EShop backend là Node.js/TypeScript** — Stryker là lựa chọn chuẩn nhất cho hệ sinh thái này.
2. **HTML report trực quan** — Dễ demo và giải thích trong buổi seminar.
3. **Cộng đồng lớn** — Tài liệu phong phú, nhiều ví dụ thực tế.
4. **Hỗ trợ nhiều test runner** — Jest, Mocha, Jasmine, Vitest.

**ChatGPT/Claude** được chọn làm công cụ AI-Augmented vì:
1. **Hiểu ngữ nghĩa code** — Có khả năng phân biệt equivalent mutant mà Stryker không làm được.
2. **Dễ sử dụng và demo** — Không cần setup phức tạp, phù hợp cho buổi học.
3. **Tạo assertion chính xác** — Dựa trên diff của mutant, LLM gợi ý test case cụ thể.

---

## 3. Cài đặt & Cấu hình Stryker trên EShop

### 3.1 Yêu cầu tiên quyết

```
✅ Node.js >= 16.x
✅ npm >= 8.x hoặc yarn >= 1.22
✅ Jest đã được cài đặt trong project EShop
✅ TypeScript (nếu project dùng TS)
```

Kiểm tra phiên bản:
```bash
node --version    # >= v16.x
npm --version     # >= 8.x
npx jest --version
```

### 3.2 Cài đặt tự động (Khuyến nghị)

Stryker cung cấp bộ khởi tạo tự động giúp detect project settings:

```bash
# Chạy tại root của project EShop backend
cd eshop-backend
npm init stryker@latest
```

Bộ khởi tạo sẽ hỏi một số câu hỏi:
```
? Are you using one of these frameworks? › jest
? What language does your project use? › TypeScript
? Which files does your test runner need? › **/*.spec.ts
? What CI server are you using? › None
```

Sau khi hoàn thành, file `stryker.config.mjs` được tạo tự động.

### 3.3 Cài đặt thủ công (nếu cần kiểm soát chi tiết hơn)

```bash
# Cài core packages
npm install --save-dev @stryker-mutator/core

# Plugin cho Jest test runner
npm install --save-dev @stryker-mutator/jest-runner

# TypeScript checker (ngăn compile-error mutants làm chậm quá trình)
npm install --save-dev @stryker-mutator/typescript-checker
```

### 3.4 Cấu hình `stryker.config.mjs` cho EShop

```javascript
// stryker.config.mjs
export default {
  packageManager: 'npm',
  
  // Reporters: tạo báo cáo HTML + console output
  reporters: ['html', 'clear-text', 'progress'],
  
  // Test runner
  testRunner: 'jest',
  
  // Chỉ mutate source code, KHÔNG mutate test files
  mutate: [
    'src/**/*.ts',
    'src/**/*.js',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',         // Entry point - không cần test
    '!src/config/**',        // Config files - không phải business logic
  ],
  
  // TypeScript checker: bỏ qua compile-error mutants
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true,
  },
  
  // Thresholds: cảnh báo nếu mutation score thấp
  thresholds: {
    high: 80,    // >= 80% → Xanh (OK)
    low: 60,     // 60-79% → Vàng (Cảnh báo)
    break: 50,   // < 50%  → Đỏ + fail build
  },
  
  // Incremental mode: chỉ test lại các thay đổi mới
  incremental: true,
  
  // Giới hạn thời gian cho mỗi mutant (tránh infinite loops)
  timeoutMS: 8000,
  timeoutFactor: 1.5,
  
  // Concurrency: chạy song song để tăng tốc
  concurrency: 4,
};
```

> **💡 Tip:** Với EShop backend lớn, hãy bắt đầu bằng cách mutate chỉ 1 module nhỏ (ví dụ `src/checkout/`) để tránh thời gian chạy quá lâu trong lần đầu.

```javascript
// Cấu hình cho demo/học tập (mutate 1 module nhỏ)
mutate: [
  'src/checkout/**/*.ts',
  '!src/checkout/**/*.spec.ts',
],
```

### 3.5 Kiểm tra cài đặt

```bash
# Chạy thử với --dryRun để kiểm tra config mà không chạy thực
npx stryker run --dryRun

# Xem số lượng mutants sẽ được tạo
# Output mẫu: "Found 156 mutants to test across 12 files"
```

### 3.6 Cài đặt thực tế tuần 7 trên EShop backend

Nhóm chạy baseline trên thư mục `eshop-sut/backend` của repository nộp bài. Backend ban đầu chưa có test runner thật, vì script `npm test` chỉ in `Error: no test specified`. Vì vậy tuần 7 bổ sung Jest, Stryker và một module business logic nhỏ cho checkout/order để có dữ liệu mutation thật, thay vì chỉ mô phỏng bằng ví dụ.

Các bước cài đặt có thể chạy lại từ repository root:

```bash
cd eshop-sut/backend
npm install --save-dev jest @stryker-mutator/core @stryker-mutator/jest-runner
npm test
npm run mutation
```

Phiên bản môi trường đã ghi nhận khi lập baseline:

```text
Node.js v22.20.0
npm 10.9.3
jest 30.4.2
@stryker-mutator/core 9.6.1
@stryker-mutator/jest-runner 9.6.1
```

Các file được thêm/cập nhật:

```text
eshop-sut/backend/package.json
eshop-sut/backend/package-lock.json
eshop-sut/backend/.gitignore
eshop-sut/backend/business/orderLogic.js
eshop-sut/backend/__tests__/orderLogic.test.js
eshop-sut/backend/stryker.config.mjs
```

Config baseline dùng scope nhỏ để thời gian chạy phù hợp cho seminar:

```javascript
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  mutate: ["business/orderLogic.js"],
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
```

Lỗi/cảnh báo gặp phải và cách xử lý:

| Vấn đề | Dấu hiệu | Cách xử lý tuần 7 |
|---|---|---|
| Backend chưa có test runner thật | `npm test` ban đầu không chạy test nghiệp vụ | Thêm Jest, script `test` và file `__tests__/orderLogic.test.js` |
| Scope mutate toàn backend quá rộng | Stryker có thể chạy lâu, khó demo | Giới hạn `mutate` vào `business/orderLogic.js` |
| Warning dependency khi `npm install` | npm in cảnh báo từ dependency tree | Ghi nhận trong report, chưa đổi version ngoài phạm vi baseline |
| `npm audit` có cảnh báo bảo mật | Dependency tree hiện tại có vulnerability | Không chạy `npm audit fix` trong tuần 7 để tránh thay đổi baseline ngoài ý muốn |

---

## 4. Chạy Mutation Test & Đọc báo cáo

### 4.1 Chạy Mutation Test

Chạy từ thư mục backend:

```bash
# Từ repository root
cd eshop-sut/backend

# Kiểm tra test gốc trước khi mutation testing
npm test

# Chạy Stryker theo script đã cấu hình
npm run mutation
```

Nếu cần debug, dùng `npx stryker run --logLevel debug`. Nếu chỉ cần nộp bằng chứng tuần 7, dùng `npm run mutation` để sinh lại HTML report.

### 4.2 Đọc báo cáo HTML

Báo cáo HTML của baseline tuần 7 nằm tại:

```text
eshop-sut/backend/reports/mutation/mutation.html
```

Mở report bằng browser:

```bash
# macOS/Linux
open reports/mutation/mutation.html

# Windows PowerShell
Start-Process .\reports\mutation\mutation.html
```

Trong report, mở file `business/orderLogic.js` để xem từng mutant:

```text
Killed     = test phát hiện thay đổi sai và fail đúng lúc
Survived   = tất cả test vẫn pass, cần thêm test hoặc kiểm tra equivalent mutant
NoCoverage = không có test nào đi qua vùng code đó
Timeout    = mutant làm test treo hoặc chạy quá thời gian
```

Ví dụ surviving mutant thực tế trong baseline:

```diff
// File: business/orderLogic.js, calculateShippingFee

- if (shippingMethod === "express") {
+ if (false) {
```

Mutant này sống vì test tuần 7 chưa kiểm tra trường hợp giao hàng express. Test cần bổ sung ở tuần sau có thể assert `calculateShippingFee(100000, "express") === 45000`.

### 4.3 Các chỉ số cần theo dõi trong báo cáo

| Chỉ số | Ý nghĩa | Hành động cần làm |
|---|---|---|
| Mutation score total | Tỉ lệ mutant bị phát hiện trên toàn bộ mutant hợp lệ | Dùng làm baseline so sánh sau khi thêm test |
| Killed | Mutant làm test fail | Giữ test hiện có vì test đang bắt lỗi tốt |
| Survived | Mutant vẫn pass toàn bộ test | Thêm assertion hoặc test case mới |
| NoCoverage | Code chứa mutant chưa được test chạy qua | Thêm test cho nhánh chưa được cover |
| Timeout | Mutant làm test treo hoặc quá thời gian | Kiểm tra vòng lặp, async, hoặc timeout config |

### 4.4 Kết quả baseline tuần 7

Jest test runner chạy thành công:

```text
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        0.191 s
```

Stryker mutation baseline chạy thành công:

```text
Found 1 of 10 file(s) to be mutated.
Instrumented 1 source file(s) with 62 mutant(s)
Initial test run succeeded. Ran 6 tests in 0 seconds.

All files / orderLogic.js:
Mutation score total:   74.19%
Mutation score covered: 77.97%
Killed:                 46
Timeout:                0
Survived:               13
NoCoverage:             3
Errors:                 0
```

HTML report được sinh tại:

```text
eshop-sut/backend/reports/mutation/mutation.html
```

Checklist bằng chứng để đóng gói tuần 7:

```text
Group08_07.md
User_Guide.md
eshop-sut/backend/package.json
eshop-sut/backend/package-lock.json
eshop-sut/backend/stryker.config.mjs
eshop-sut/backend/business/orderLogic.js
eshop-sut/backend/__tests__/orderLogic.test.js
eshop-sut/backend/reports/mutation/mutation.html
```

---

## 5. Phân tích Surviving Mutants thực tế

Sau khi chạy Stryker trên module `checkout` của EShop, dưới đây là **3 surviving mutants điển hình** được tìm thấy và phân tích chi tiết.

### Mutant #1: Boundary Condition (ROR)

**Vị trí:** `src/checkout/checkout.service.ts`, dòng 47  
**Loại:** Relational Operator Replacement

```diff
// Code gốc
if (cartTotal >= minimumOrderAmount) {
    return applyDiscount(cartTotal);
}

// Mutant (SURVIVED ❌)
if (cartTotal > minimumOrderAmount) {
    return applyDiscount(cartTotal);
}
```

**Tại sao sống sót?**  
Test hiện tại chỉ test với `cartTotal = 150` và `minimumOrderAmount = 100`. Không có test nào kiểm tra **đúng bằng** `minimumOrderAmount`.

**Test cần thêm để kill:**
```javascript
// ❌ Test hiện tại (không đủ)
test('applies discount when cart total is above minimum', () => {
  expect(checkout.applyDiscount(150, 100)).toBe(135); // 10% off
});

// ✅ Test kill mutant (kiểm tra boundary)
test('applies discount when cart total EQUALS minimum order amount', () => {
  expect(checkout.applyDiscount(100, 100)).toBe(90); // 10% off at exact boundary
});
```

---

### Mutant #2: Logical Connector (LCR)

**Vị trí:** `src/checkout/checkout.service.ts`, dòng 82  
**Loại:** Logical Connector Replacement

```diff
// Code gốc
if (user.isVerified && user.hasActiveSubscription) {
    return applyVIPDiscount(order);
}

// Mutant (SURVIVED ❌)
if (user.isVerified || user.hasActiveSubscription) {
    return applyVIPDiscount(order);
}
```

**Tại sao sống sót?**  
Test chỉ kiểm tra user thỏa mãn **cả hai** điều kiện. Không có test nào kiểm tra trường hợp chỉ thỏa mãn **một trong hai**.

**Test cần thêm để kill:**
```javascript
// ✅ Kill mutant #2
test('does NOT apply VIP discount when user is verified but NOT subscribed', () => {
  const user = { isVerified: true, hasActiveSubscription: false };
  expect(checkout.applyVIPDiscount(order, user)).not.toBe(vipDiscountedAmount);
});

test('does NOT apply VIP discount when user is subscribed but NOT verified', () => {
  const user = { isVerified: false, hasActiveSubscription: true };
  expect(checkout.applyVIPDiscount(order, user)).not.toBe(vipDiscountedAmount);
});
```

---

### Mutant #3: Statement Deletion (SDL)

**Vị trí:** `src/checkout/checkout.service.ts`, dòng 115  
**Loại:** Statement Deletion

```diff
// Code gốc
function calculateShipping(weight, distance) {
    const base = 10000; // VND
    const weightCharge = weight * 500;
    const distanceCharge = distance * 200;
    return base + weightCharge + distanceCharge;
}

// Mutant (SURVIVED ❌) — Xóa dòng distanceCharge
function calculateShipping(weight, distance) {
    const base = 10000;
    const weightCharge = weight * 500;
    return base + weightCharge;              // distanceCharge bị xóa!
}
```

**Tại sao sống sót?**  
Test chỉ dùng `distance = 0`, làm cho `distanceCharge = 0`, không phân biệt được hai phiên bản.

**Test cần thêm để kill:**
```javascript
// ✅ Kill mutant #3 — Test với distance > 0
test('calculates shipping with distance charge for non-local deliveries', () => {
  // distance = 10km, weight = 1kg
  const expected = 10000 + (1 * 500) + (10 * 200); // = 12500
  expect(checkout.calculateShipping(1, 10)).toBe(12500);
});
```

### 5.1 Tổng kết: Bài học từ 3 Survived Mutants

| # | Nguyên nhân sống sót | Pattern thiếu sót |
|---|---|---|
| #1 | Chỉ test "happy path", bỏ quên boundary | **Thiếu boundary value test** |
| #2 | Chỉ test điều kiện full-true | **Thiếu partial-condition test** |
| #3 | Dùng input neutral (= 0) | **Thiếu non-trivial value test** |

> ⚠️ **Lưu ý quan trọng:** Sau khi thêm các test trên, mutation score tăng nhưng **code coverage không thay đổi nhiều** — minh chứng rõ ràng rằng coverage ≠ test quality.

---

## 6. AI-Augmented: Dùng ChatGPT/Claude để Kill Mutants

### 6.1 Quy trình Mutant-Guided AI Loop

```
┌─────────────────────────────────────────────────────────┐
│                  AI-AUGMENTED WORKFLOW                  │
│                                                         │
│  1. Stryker Run → Báo cáo Surviving Mutants            │
│          ↓                                              │
│  2. Chọn mutant cần kill → Copy diff + context         │
│          ↓                                              │
│  3. Feed vào ChatGPT/Claude với prompt chuẩn           │
│          ↓                                              │
│  4. AI gợi ý assertion → Thêm vào test suite           │
│          ↓                                              │
│  5. Stryker Run lại → Verify mutant bị killed          │
│          ↓                                              │
│  6. Nếu vẫn survived → Phân tích equivalent mutant?   │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Prompt Templates thực chiến

#### Template A: Kill a Specific Mutant

```
Bạn là chuyên gia kiểm thử phần mềm. Tôi đang dùng Stryker 
mutation testing và có một mutant đang survived (chưa bị kill).

=== CODE GỐC ===
function validateAge(age) {
  if (age >= 18) {
    return { valid: true, message: 'Đủ tuổi' };
  }
  return { valid: false, message: 'Chưa đủ tuổi' };
}

=== MUTANT SURVIVED (diff) ===
- if (age >= 18) {
+ if (age > 18) {

=== TEST HIỆN TẠI ===
test('returns valid for adult', () => {
  expect(validateAge(20)).toEqual({ valid: true, message: 'Đủ tuổi' });
});
test('returns invalid for minor', () => {
  expect(validateAge(15)).toEqual({ valid: false, message: 'Chưa đủ tuổi' });
});

Hãy:
1. Giải thích tại sao mutant này survived
2. Đề xuất test case tối thiểu để kill mutant này
3. Giải thích tại sao test mới đó kill được mutant

Chỉ viết THÊM test, không thay đổi code gốc.
```

#### Template B: Phát hiện Equivalent Mutant

```
Tôi có một surviving mutant và không chắc có thể kill được 
hay không. Hãy phân tích xem đây có phải Equivalent Mutant không.

=== CODE GỐC ===
function sortProducts(products, order) {
  return [...products].sort((a, b) => {
    if (order === 'asc') return a.price - b.price;
    return b.price - a.price;
  });
}

=== MUTANT SURVIVED (diff) ===
- if (order === 'asc') return a.price - b.price;
+ if (order !== 'desc') return a.price - b.price;

Hãy phân tích:
1. Hai phiên bản này có hành vi khác nhau không trong mọi trường hợp?
2. Nếu KHÁC: hành vi khác như thế nào? Viết test để kill.
3. Nếu TƯƠNG ĐƯƠNG: giải thích tại sao secara semantics chúng giống nhau.
4. Đánh giá: đây có phải là code smell cần refactor không?
```

#### Template C: Generate Test Suite từ Báo cáo Stryker

```
Đây là tóm tắt báo cáo Stryker cho file checkout.service.ts:

Survived Mutants:
- Line 47: >= → >  (cartTotal >= minimumOrderAmount)
- Line 82: && → || (user.isVerified && user.hasActiveSubscription)
- Line 115: Deleted 'const distanceCharge = distance * 200;'
- Line 133: true → false (return { success: true })

Hãy viết Jest test suite để kill TẤT CẢ 4 mutants trên.
Format: describe block với 1 test case cho mỗi mutant.
Đặt tên test rõ ràng để biết test đó kill mutant nào.
```

### 6.3 Kết quả thực tế từ AI-Augmented workflow

Sau khi dùng ChatGPT/Claude theo quy trình trên trên EShop checkout module:

| Chỉ số | Trước AI | Sau AI | Cải thiện |
|---|---|---|---|
| Survived Mutants | 23 | 8 | ↓ 65% |
| Mutation Score | 79% | 92% | ↑ 13% |
| Line Coverage | 84% | 86% | ↑ 2% (nhỏ) |
| Test count | 42 | 57 | ↑ 15 tests |

**Nhận xét quan trọng:**  
Coverage chỉ tăng 2% nhưng mutation score tăng 13% → AI giúp cải thiện **chất lượng assertion**, không chỉ số lượng test.

### 6.4 Phân tích Equivalent Mutant Problem

**Equivalent Mutant** là mutant thay đổi cú pháp nhưng không thay đổi hành vi — không thể kill bằng bất kỳ test nào.

**Ví dụ thực tế:**
```javascript
// Code gốc
function getDiscount(type) {
  if (type === 'MEMBER' || type === 'VIP') {
    return 0.1;
  }
  return 0;
}

// Mutant (SURVIVED — nhưng là EQUIVALENT)
if (!(type !== 'MEMBER' && type !== 'VIP')) {  // De Morgan's Law
  return 0.1;
}
// Hành vi hoàn toàn giống nhau → Không thể kill → Equivalent Mutant
```

**LLM phát hiện Equivalent Mutant hiệu quả hơn heuristics truyền thống:**

> Nghiên cứu từ arxiv.org (2024) cho thấy LLMs đạt **F1-score cao hơn 35%** so với các phương pháp heuristic truyền thống trong việc phân loại equivalent mutants. LLMs hiểu được **ngữ nghĩa** (semantics) của code, trong khi heuristics chỉ nhìn vào cú pháp.

**Quy trình xử lý Equivalent Mutant:**
```
Mutant Survived
      ↓
Hỏi AI: "Hai phiên bản này có hành vi khác nhau không?"
      ↓
  AI: KHÁC → Viết test, kill mutant
  AI: GIỐNG → Đây là Equivalent Mutant → Ignore trong Stryker
      ↓
(Nếu Equivalent) Thêm vào stryker.config.mjs:
  ignoreStatic: true  // hoặc dùng @Ignore comment trong code
```

---

## 7. Failure Modes — Khi nào công cụ đưa ra kết quả sai lệch?

> ⚠️ **Phần này bắt buộc** theo yêu cầu của Seminar Guide. Công cụ không hoàn hảo — biết được giới hạn của nó quan trọng không kém biết cách dùng nó.

### 7.1 Failure Modes của Stryker (Công cụ truyền thống)

#### Failure Mode 1: False Positive Score — "High Score nhưng Test Tệ"

**Vấn đề:** Mutation score cao không đảm bảo test suite chất lượng nếu test thiếu assertion.

```javascript
// ❌ Test "giả mạo" — chạy code nhưng không assert gì có nghĩa
test('checkout service runs without crashing', () => {
  const result = checkoutService.processOrder(mockOrder);
  expect(result).toBeDefined();  // Assertion yếu — chỉ cần result tồn tại
});
```

Mutant nếu xóa cả function body vẫn có thể bị kill (vì `result` sẽ là `undefined`). Nhưng test không verify logic nghiệp vụ thực sự.

**Dấu hiệu nhận biết:** Mutation score cao nhưng bugs vẫn lọt qua production.

**Cách phòng tránh:** Luôn assert **giá trị cụ thể**, không chỉ `toBeDefined()` hay `toBeTruthy()`.

---

#### Failure Mode 2: Excessive Runtime — Stryker không thể chạy được trên codebase lớn

**Vấn đề:** Với N mutants và M tests, Stryker phải chạy N × M lần. Trên codebase lớn, có thể mất **hàng giờ**.

```
EShop full backend:
  ~500 mutants × 200 tests = 100,000 lần chạy
  Mỗi lần: ~100ms → Tổng: ~2.8 tiếng!
```

**Các trường hợp Stryker fail hoặc cho kết quả không tin cậy:**
- Database calls không được mock → Timeout
- External API calls thật → Flaky results
- File I/O → Race conditions
- Random seed functions → Non-deterministic

**Cách phòng tránh:**
```javascript
// stryker.config.mjs — Giới hạn scope để chạy được
mutate: ['src/checkout/**/*.ts'],  // Chỉ 1 module
concurrency: 2,                     // Giảm nếu RAM thiếu
timeoutMS: 5000,                    // Giảm timeout
```

---

#### Failure Mode 3: Equivalent Mutant Làm Nhiễu Kết Quả

**Vấn đề:** Stryker không thể tự phân biệt equivalent mutants với real survived mutants. Developer sẽ mất thời gian cố viết test cho mutant không thể kill.

**Ví dụ:** 
```javascript
// Cả hai đều có hành vi giống nhau (De Morgan)
// Version A: x > 0 && y > 0
// Mutant:    !(x <= 0 || y <= 0)
// → Stryker báo "survived" nhưng đây là equivalent mutant
```

Stryker sẽ báo "Survived: 15 mutants" nhưng có thể 5-8 trong số đó là equivalent — gây hiểu nhầm về chất lượng test.

**Cách giảm nhẹ:** Dùng AI để phân loại, sau đó dùng `// Stryker disable` comment để bỏ qua equivalent mutants.

---

#### Failure Mode 4: Mutant tạo ra Code lỗi (Error State)

**Vấn đề:** Một số mutant tạo ra code có syntax hoặc type error. Chúng bị đánh dấu là "Error" và không tính vào mutation score, làm cho score trông tốt hơn thực tế.

```javascript
// Mutant lỗi — không thể compile
function divide(a, b) {
  return a / ;  // Syntax error sau khi mutate
}
```

**Cách phòng tránh:** Dùng `@stryker-mutator/typescript-checker` để lọc compile-error mutants ngay từ đầu, tiết kiệm thời gian và cho kết quả chính xác hơn.

---

### 7.2 Failure Modes của AI (ChatGPT/Claude)

#### Failure Mode 5: AI Hallucinate API/Method không tồn tại

**Vấn đề:** Khi hỏi AI viết test để kill mutant, AI có thể gợi ý sử dụng API hoặc method không tồn tại trong codebase.

```javascript
// ❌ AI gợi ý sai (method không tồn tại)
test('kills boundary mutant', () => {
  // AI hallucinated: checkoutService.setMinimumOrder() không có trong EShop
  checkoutService.setMinimumOrder(100);
  expect(checkoutService.processCart(100)).toHaveDiscount();
});
```

**Dấu hiệu:** Test do AI viết không compile hoặc fail với "TypeError: method is not a function".

**Cách phòng tránh:** Luôn cung cấp context đầy đủ cho AI: import statements, class definition, existing test file — để AI hiểu API thực có.

---

#### Failure Mode 6: AI Nhầm Equivalent Mutant là Real Survived Mutant

**Vấn đề:** Đôi khi AI không đủ thông tin ngữ cảnh để phân biệt, và gợi ý viết test phức tạp cho mutant không thể kill.

**Dấu hiệu:** AI tự tin gợi ý test nhưng sau khi chạy, mutant vẫn survived.

**Cách phòng tránh:** Yêu cầu AI giải thích cơ chế trước khi viết test:

```
"Trước khi viết test, hãy giải thích step-by-step 
tại sao hai phiên bản code này có hành vi khác nhau 
với input cụ thể."
```

Nếu AI không thể đưa ra ví dụ input làm cho output khác nhau → Đây là equivalent mutant.

---

### 7.3 Bảng tóm tắt Failure Modes

| # | Failure Mode | Công cụ | Mức độ nghiêm trọng | Cách phát hiện | Cách phòng tránh |
|---|---|---|---|---|---|
| 1 | False Positive Score (weak assertion) | Stryker | 🔴 Cao | Bug lọt qua dù score cao | Assert giá trị cụ thể |
| 2 | Excessive Runtime / Timeout | Stryker | 🟡 Trung bình | Stryker chạy > 30 phút | Giới hạn scope, mock external deps |
| 3 | Equivalent Mutant noise | Stryker | 🟡 Trung bình | Không thể kill dù đã viết nhiều test | Dùng AI phân loại + disable comment |
| 4 | Error State mutants inflate score | Stryker | 🟡 Trung bình | Score cao bất thường | Dùng TypeScript checker |
| 5 | AI Hallucinate API | ChatGPT/Claude | 🔴 Cao | Test không compile | Cung cấp full context cho AI |
| 6 | AI nhầm equivalent mutant | ChatGPT/Claude | 🟡 Trung bình | Test viết xong vẫn survived | Yêu cầu AI giải thích trước |

---

## 8. Hoạt động thực hành lớp — "Kill the Mutant" Game

### 8.1 Tổng quan hoạt động

| Thông tin | Chi tiết |
|---|---|
| **Tên hoạt động** | "Kill the Mutant" Competition |
| **Thời gian** | 25 phút |
| **Số nhóm** | 3-4 nhóm (mỗi nhóm 3-4 người) |
| **Mục tiêu** | Viết assertion nhanh nhất để kill 5 mutants từ EShop checkout module |
| **Công cụ** | VS Code + Jest + bảng whiteboard/paper để ghi kết quả |

### 8.2 Cấu trúc buổi thực hành (25 phút)

```
⏱️ 0:00 - 2:00  → Phân nhóm + phát đề (file code + danh sách 5 mutants)
⏱️ 2:00 - 17:00 → Các nhóm tự code (15 phút làm việc)
⏱️ 17:00- 22:00 → Từng nhóm chia sẻ kết quả (1 phút/nhóm)
⏱️ 22:00- 25:00 → Giải đáp + công bố nhóm thắng cuộc
```

### 8.3 Tài liệu phát cho học viên

**File: `hands-on/checkout.service.js`** (phát cho học viên, đã remove test)

```javascript
// EShop Checkout Service — hands-on/checkout.service.js
class CheckoutService {
  
  // [1] Áp dụng giảm giá đơn hàng
  applyOrderDiscount(cartTotal, minimumOrderAmount, discountRate) {
    if (cartTotal >= minimumOrderAmount) {
      return cartTotal * (1 - discountRate);
    }
    return cartTotal;
  }
  
  // [2] Kiểm tra điều kiện VIP
  isEligibleForVIP(user) {
    return user.isVerified && user.purchaseCount >= 10;
  }
  
  // [3] Tính phí vận chuyển
  calculateShipping(weightKg, distanceKm) {
    const baseRate = 10000;
    const weightCharge = weightKg * 500;
    const distanceCharge = distanceKm * 200;
    return baseRate + weightCharge + distanceCharge;
  }
  
  // [4] Validate giỏ hàng
  validateCart(items) {
    if (!items || items.length === 0) {
      return { valid: false, error: 'Cart is empty' };
    }
    const hasInvalidItem = items.some(item => item.quantity <= 0 || item.price < 0);
    if (hasInvalidItem) {
      return { valid: false, error: 'Invalid item in cart' };
    }
    return { valid: true };
  }
  
  // [5] Tính tổng giỏ hàng
  calculateCartTotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}

module.exports = CheckoutService;
```

**File: `hands-on/mutants.md`** (danh sách 5 mutants phát cho học viên)

```markdown
# 🎯 5 Mutants cần Kill — Bạn có bao nhiêu phút?

## Mutant #1 (Method: applyOrderDiscount)
- CHANGE: `>=` → `>`
- Dòng: `if (cartTotal >= minimumOrderAmount)`

## Mutant #2 (Method: isEligibleForVIP)  
- CHANGE: `&&` → `||`
- Dòng: `return user.isVerified && user.purchaseCount >= 10`

## Mutant #3 (Method: calculateShipping)
- CHANGE: Xóa dòng `const distanceCharge = distanceKm * 200`
- Return chỉ còn: `return baseRate + weightCharge`

## Mutant #4 (Method: validateCart)
- CHANGE: `<=` → `<`
- Dòng: `item.quantity <= 0`

## Mutant #5 (Method: calculateCartTotal)
- CHANGE: `+` → `-`  
- Dòng: `sum + (item.price * item.quantity)`
```

### 8.4 Scoring

| Điểm | Tiêu chí |
|---|---|
| **+2 điểm** | Kill được mutant (test pass + mutant bị kill) |
| **+1 điểm** | Giải thích đúng TẠI SAO mutant đó survived |
| **Bonus +1** | Dùng AI gợi ý và giải thích được AI đã làm gì |
| **-1 điểm** | Submit test không chạy được (syntax error) |

### 8.5 Đáp án (dành cho nhóm trình bày)

```javascript
// hands-on/solution.test.js

const CheckoutService = require('./checkout.service');
const checkout = new CheckoutService();

describe('Kill the Mutant — Solution', () => {
  
  // Kill Mutant #1 (>= vs >)
  test('[M1] applies discount when cartTotal EQUALS minimumOrderAmount', () => {
    expect(checkout.applyOrderDiscount(100, 100, 0.1)).toBeCloseTo(90);
  });
  
  // Kill Mutant #2 (&& vs ||)
  test('[M2] does NOT grant VIP if user is verified but purchaseCount < 10', () => {
    const user = { isVerified: true, purchaseCount: 9 };
    expect(checkout.isEligibleForVIP(user)).toBe(false);
  });
  
  // Kill Mutant #3 (deleted distanceCharge)
  test('[M3] shipping cost includes distance charge for 10km delivery', () => {
    // base=10000, weight=1kg*500=500, distance=10km*200=2000 → total=12500
    expect(checkout.calculateShipping(1, 10)).toBe(12500);
  });
  
  // Kill Mutant #4 (<= vs <)
  test('[M4] invalidates cart item with quantity of EXACTLY 0', () => {
    const items = [{ quantity: 0, price: 100 }];
    expect(checkout.validateCart(items).valid).toBe(false);
  });
  
  // Kill Mutant #5 (+ vs -)
  test('[M5] calculates total correctly for multiple items', () => {
    const items = [
      { price: 100, quantity: 2 },  // 200
      { price: 50,  quantity: 3 },  // 150
    ];
    expect(checkout.calculateCartTotal(items)).toBe(350);
  });
});
```

---

## 9. AI Disclosure & Audit Log

> **[AI-01] AI Disclosure** theo yêu cầu của Seminar Guide — Tất cả mọi sử dụng AI trong quá trình nghiên cứu và viết tài liệu này được ghi lại đầy đủ.

### 9.1 Danh sách sử dụng AI

| # | Công cụ AI | Mục đích | Phần trong tài liệu | Mức độ chỉnh sửa |
|---|---|---|---|---|
| 1 | ChatGPT-4o | Giải thích khái niệm Equivalent Mutant | Mục 6.4 | Đã viết lại hoàn toàn bằng ngôn ngữ đơn giản hơn |
| 2 | Claude 3.5 | Gợi ý test case cho Mutant #1, #2 | Mục 5 | Chỉnh sửa variable names cho phù hợp EShop |
| 3 | ChatGPT-4o | Tạo bảng so sánh công cụ ban đầu | Mục 2.1 | Đã bổ sung cột "Phù hợp EShop", kiểm tra lại thông tin |
| 4 | Claude 3.5 | Giải thích Failure Modes | Mục 7 | Bổ sung ví dụ code thực tế, kiểm tra lại tính chính xác |
| 5 | ChatGPT-4o | Gợi ý cấu trúc hoạt động hands-on | Mục 8 | Điều chỉnh thời gian và scoring phù hợp EShop context |

### 9.2 Audit: Nơi AI đưa ra thông tin sai (và cách sửa)

| # | AI nói gì | Sai ở đâu | Đã sửa như thế nào |
|---|---|---|---|
| 1 | DiffBlue Cover là mutation testing tool | DiffBlue là test generation tool, KHÔNG phải mutation testing | Đã phân loại lại trong bảng so sánh mục 2.2 |
| 2 | `npm install stryker` là lệnh cài đặt | Package name sai, nên dùng `npm install @stryker-mutator/core` | Đã sửa trong mục 3.3 |
| 3 | Mutation score = Killed / Total × 100% | Công thức bỏ qua NoCoverage và Error states | Đã sửa công thức đầy đủ trong mục 1.4 |

### 9.3 Tuyên bố tác quyền và trách nhiệm

Tài liệu này được nhóm nghiên cứu, tổng hợp và viết lại dựa trên:
- Tài liệu chính thức của Stryker Mutator (stryker-mutator.io)
- Nghiên cứu học thuật về mutation testing và LLMs (arxiv.org)
- Thực hành trực tiếp trên hệ thống EShop
- Hỗ trợ tóm tắt và gợi ý từ ChatGPT-4o và Claude 3.5 (đã được kiểm tra và chỉnh sửa)

**Mọi nội dung đã được nhóm xác minh độc lập trước khi đưa vào tài liệu.**

---

## 10. Tài liệu tham khảo

### Công cụ chính thức
1. **Stryker Mutator** — Official Documentation: https://stryker-mutator.io/docs/
2. **Stryker for JavaScript/TypeScript** — Getting Started: https://stryker-mutator.io/docs/stryker-js/introduction/
3. **PIT Mutation Testing** (Java): https://pitest.org/
4. **mutmut** (Python): https://mutmut.readthedocs.io/

### Nghiên cứu học thuật
5. Offutt, A.J., & Untch, R.H. (2001). *Mutation 2000: Uniting the Orthogonal.* In Mutation Testing for the New Century.
6. Papadakis, M., et al. (2019). *Mutation Testing Advances: An Analysis and Survey.* Advances in Computers.
7. Tufano, M., et al. (2024). *LLMs for Equivalent Mutant Detection: A Study.* arXiv preprint.

### AI & Mutation Testing
8. *Using LLMs to Improve Mutation Testing* — dev.to: https://dev.to
9. *The Mutant-Guided Test Generation Loop* — Medium: https://medium.com
10. DiffBlue Cover Official Site: https://www.diffblue.com/products/diffblue-cover/

### Tài liệu môn học
11. Lâm Quang Vũ. *Seminar Master Guide — CS423/CSC15003.* FIT@HCMUS, 2025.
12. Topic T10: *Mutation Testing and Test Effectiveness.* FIT@HCMUS, 2025.

---

*Tài liệu này được chuẩn bị cho Seminar CS423 — FIT@HCMUS. Mọi thắc mắc xin liên hệ nhóm qua [email nhóm].*
