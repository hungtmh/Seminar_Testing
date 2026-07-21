# AI Report — Seminar T10 (Nhóm 08)

> **Người biên soạn:** 23127060 - Ninh Văn Khải
> **Mục đích:** Thể hiện việc sử dụng AI **có trách nhiệm, có kiểm soát** trong quá trình làm seminar, và lưu lại kinh nghiệm. Nguyên tắc xuyên suốt: **AI gợi ý — người luôn chạy thật để kiểm chứng.**
>
> Gồm 4 phần: (1) AI Disclosure · (2) AI Interaction Trace · (3) Nhật ký lỗi AI & cách fix · (4) AI Audit (AI-02).

---

## Phần 1 — AI Disclosure

| Công cụ AI | Dùng để làm gì | Mức độ dùng |
|---|---|---|
| ChatGPT / Claude | Giải thích vì sao mutant sống, gợi ý assertion, gợi ý cấu hình Stryker/Jest | Hỗ trợ, mọi output đều được chạy lại kiểm chứng |
| — | Không dùng AI để tự sinh toàn bộ code nộp mà không đọc/kiểm | — |

Mọi đoạn code, con số, kết quả test trong báo cáo đều do nhóm **tự chạy thật** trên máy và lấy số từ report của Stryker/Jest.

---

## Phần 2 — AI Interaction Trace (Order/Cart/Coupon)

### 2.1 Phân tích codebase & thiết kế
- AI + người cùng đọc `server.js`, tách handler Cart/Coupon/Order ra `services/orderService.js` để test độc lập qua Supertest (truyền `db` vào service).

### 2.2 Thiết lập mutation testing
- Tạo `stryker.order.config.mjs` (scope chỉ `orderService.js`, runner Jest); thêm script `mutation:order` vào `package.json`.

### 2.3 Baseline (lần 1)
- Viết `order.api.test.js` chỉ check HTTP 200 → score **16.67%**, 6 survived, 69 no-coverage. Lưu `reports/mutation-order-baseline/`.

### 2.4 Improved
- Xử lý **state pollution** giữa các test coupon (tách tài khoản, cô lập dữ liệu).
- Phát hiện **bug thật** ở logic tính coupon phần trăm của dự án gốc → quyết định **giữ nguyên logic thật** và viết assertion kiểm chứng đúng hành vi hiện tại (không tự ý sửa code người khác).
- Thêm case ngoại lệ: coupon không tồn tại/hết hạn, đơn không đủ min, hủy đơn user khác (404), lỗi DB callback (500).
- Kết quả: 21 test, score **84.21%** (1 survived, 8 no-coverage).

### 2.5 Phụ lục — Log prompt thực tế (bằng chứng)

**Prompt 1 — Mutant làm bẩn giỏ hàng**
- **Khải:** "Code gốc `userCarts[userId] = []` bị Stryker đổi thành `[\"Stryker was here\"]` nhưng test vẫn pass. Vì sao và gợi ý assertion?"
- **AI:** "Vì test chỉ assert status 200, không kiểm nội dung cart. Gợi ý: `expect(res.body).toEqual([])` hoặc `expect(res.body.length).toBe(0)`."
- **Kiểm chứng:** đúng — sau khi thêm assertion, mutant **Killed**.

**Prompt 2 — Mutant điều kiện giới hạn coupon**
- **Khải:** "`if (usage_count >= max) 400`, Stryker đổi `>=`→`>`, mutant sống. Cho test case kill nó."
- **AI:** "Thiếu test biên. Set `usage_count = max`, gọi apply-coupon, expect 400."
- **Kiểm chứng:** đúng theo Boundary Value Analysis — mutant **Killed**.

---

## Phần 3 — Nhật ký lỗi AI & cách fix (6 sự cố)

> Trích từ trang theo dõi nội bộ của nhóm; mỗi sự cố đều đã được **chạy thật kiểm chứng**.

| # | AI làm gì | Triệu chứng / Fail | Nguyên nhân gốc | Cách fix | Trạng thái |
|---|---|---|---|---|---|
| 1 | Sinh `stryker.order.config.mjs` | `mutation:order` crash hàng loạt: `SQLITE_BUSY`, `table already exists`, `UNIQUE constraint`; 111/184 mutant error | Config thiếu `jest.configFile` → Stryker chạy **tất cả** test (auth/product dùng SQLite thật) | Thêm `testFiles` + `jest.configFile: "jest.order.config.cjs"` để scope đúng | ✅ Đã fix |
| 2 | Báo score **93.15%** | Số bị thổi phồng | 111 mutant lỗi bị loại khỏi mẫu số → chỉ đo 73/184 | Chạy lại bản scoped sạch (errors 111→9), đo số thật | ✅ Đã fix |
| 3 | Gợi ý assertion kill mutant | Rủi ro assertion sai / gọi API không tồn tại | AI không chạy code thật | Luôn chạy lại Stryker/Jest verify từng gợi ý | ⏳ Quy trình thường trực |
| 4 | Sinh `jest.order.config.cjs` với `testMatch: ["<rootDir>/tests/..."]` | `No tests were found` → thoát sớm | `<rootDir>` bị resolve sai khi Jest chạy qua Stryker | Đổi `rootDir: __dirname` + `roots` + `testMatch: ["**/orders.api.test.js"]` + `projectType: "custom"` | ✅ Đã fix |
| 5 | AI ước lượng score ~84% | Số ước lượng lệch số đo thật | AI đoán từ báo cáo cũ, không chạy lại | Chạy thật ra **92.57%** (162/175); luôn lấy số từ report | ✅ Đã fix |
| 6 | Sinh `stryker.auth.config.mjs` thiếu scope, test auth chạy SQLite thật | `mutation:auth` crash: `exit code 3221225477`, `no such table: products`, `SQLITE_BUSY`; "Ran 73 tests"; 20 error; score 55.24% | (a) thiếu scope → chạy 73 test mọi module; (b) 15 worker cùng mở 1 file DB → crash native do Dry-Run chạy in-band không có `JEST_WORKER_ID`; (c) 47 no-cov vì thiếu test | (a) bỏ `testFiles`, dùng `enableFindRelatedTests: false` + `testMatch`; (b) `database.js` check thêm `__dirname.includes('.stryker-tmp')` để fallback `:memory:`; (c) viết thêm 9 test | ✅ Đã fix (Score Auth đạt 87.16%, Product 100%) |

### Kết quả sạch cuối cùng (Order)
184 mutant → Killed 154, Timeout 8, Survived 6, NoCoverage 7, Errors 9 → **Mutation score 92.57%** (162/175); covered 96.43% (162/168).

### Bài học rút ra
1. Không tin số liệu AI nếu chưa tự chạy.
2. Kiểm tra config trước khi tin kết quả — một dòng thiếu (`jest.configFile`) làm sai toàn bộ.
3. Score cao chưa chắc tốt — phải xem có bao nhiêu mutant bị loại (errors/timeout).
4. AI hay bịa nguồn & số liệu — phải đối chiếu trước khi đưa vào báo cáo.
5. Ghi lại cả lần AI sai — để học và làm bằng chứng trung thực (AI-03).

---

## Phần 4 — AI Audit Report (AI-02)

**Auditor:** 23127060 - Ninh Văn Khải · **Word count:** ~650 words

### 1. Context and Artefact Description
As part of the T10 Seminar on Mutation Testing, our team used Stryker Mutator on the EShop backend, targeting `orderService.js`. During baseline, several mutants survived because the Jest suite only asserted HTTP 200 without verifying the payload. I used an LLM (ChatGPT/Claude) to generate Jest assertions to kill surviving mutants. The audited artefact is the AI-generated explanations and proposed assertions (documented in Part 2). A critical audit reveals several flaws.

### 2. (a) Factual Errors in AI Output
For the cart mutation, the AI initially suggested `expect(res.body).toBe([]);`. This is a factual error: Jest's `.toBe()` uses `Object.is`, so comparing to a new array reference always fails. A human corrected it to `expect(res.body).toEqual([])` or `expect(res.body.length).toBe(0)`.

### 3. (b) Missing Edge Cases
For the coupon boundary mutant (`>=`→`>`), the AI gave a correct boundary test but missed **concurrent/race-condition** cases (two requests applying the same coupon simultaneously). It never suggested `Promise.all()` to simulate concurrency.

### 4. (c) Silent Assumptions
The AI silently assumed the in-memory state resets between tests, omitting `beforeEach()/afterEach()` cleanup. Because our Jest suite runs sequentially, state pollution from earlier coupon tests made the AI-generated tests fail unexpectedly.
Hơn nữa, khi xử lý lỗi Database Crash, AI từng đưa ra **giả định ngầm sai lầm** rằng biến môi trường `process.env.JEST_WORKER_ID` luôn tồn tại khi chạy test. Thực tế ở vòng Dry-Run, Stryker chạy Jest in-band (đơn luồng), biến này bị khuyết dẫn đến toàn bộ 15 sandbox cùng ghi đè lên một file vật lý `database.sqlite` gây lỗi `0xC0000005`. Phải có sự can thiệp của người dùng để check thêm cờ `.stryker-tmp` trong `__dirname`.

### 5. (d) Over-confident Statements
The AI claimed the assertion would "100% kill the mutant and guarantee bulletproof logic." Killing a mutant does not equal bulletproof logic — mutation testing only measures test sensitivity to syntactic changes, not absence of architectural/security flaws (e.g., IDOR on coupons). The AI conflated "killing a mutant" with "perfect quality."
