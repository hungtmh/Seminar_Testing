# 🧬 Nhật Ký Kiểm Toán AI Chi Tiết Toàn Bộ Lịch Sử (Full AI Audit Trace Report)

> **Môn học:** CS423 / CSC15003 — Kiểm thử phần mềm (FIT@HCMUS)  
> **GVHD:** ThS. Hồ Tuấn Thanh  
> **Người thực hiện:** 23127195 — Trần Mạnh Hùng  
> **Chủ đề:** T10 — Mutation Testing & Test Effectiveness  
> **Ứng dụng thực nghiệm (SUT):** Backend EShop (`src/eshop-sut/backend`)  
> **Công cụ AI hỗ trợ:** Antigravity AI Assistant (Google DeepMind)  
> **Tổng số lượt Prompt tương tác:** 45 Lượt (Được trích xuất 100% từ Log hệ thống)

---

## 1. Tổng quan Quy trình Kiểm toán AI (AI Governance & Flow)

Báo cáo này lưu lại vết (**Audit Trace Log**) toàn bộ 45 lượt prompt tương tác thực tế từ đầu đến cuối buổi làm việc giữa thành viên **Trần Mạnh Hùng** và AI Assistant. 

Mọi đoạn mã nguồn, cấu hình Jest/Stryker, câu lệnh assertion và chỉ số Mutation Score trong đồ án này đều tuân thủ nghiêm ngặt quy trình **Mutant-Guided AI Loop**:
1. AI chỉ đóng vai trò gợi ý, phân tích code diff và soạn thảo khung tài liệu.
2. Thành viên **Trần Mạnh Hùng** trực tiếp kiểm chứng 100% bằng cách tự gõ lệnh `npm test` và `npm run mutation:*` trên máy thật.

```text
[Yêu cầu / Prompt từ User] ──> [AI Phân tích & Gợi ý Code/File]
                                           │
[Lưu Bằng chứng & Output] <── [Con người Chạy npm test / Stryker Verify]
```

---

## 2. Nhật Ký 45 Lượt Prompt Chi Tiết (Full 45 Prompts Audit Trail)

---

### 📍 GIAI ĐOẠN 1: Phân Tích Đề Tài, Yêu Cầu Môn Học & Deliverables (Prompts 1 – 7)

#### 🔹 Prompt 1: Đọc thông tin dự án EShop & Seminar Testing
- **Nội dung Prompt:** *"đọc qua seminar testing của tôi đi để nắm dự án tình hình hiện tại"*
- **AI Phân tích & Phản hồi:** AI quét toàn bộ cây thư mục workspace `Seminar_Testing`, đọc các file báo cáo tuần và mã nguồn backend EShop để nắm cấu trúc dự án.
- **📸 Bằng chứng ảnh:** `![Prompt 1](image_tmh/anh_1.png)`

#### 🔹 Prompt 2: Đọc file Quy định Seminar Briefing & Topic T10 Briefing
- **Nội dung Prompt:** *"bạn hãy đọc Seminar_Workflow_Briefing.pdf và T10_Mutation_Testing.pdf để biết đi"*
- **AI Phân tích & Phản hồi:** AI đọc 2 file PDF quy định chính thức của bộ môn, trích xuất các giai đoạn S1 $\rightarrow$ S8, quy tắc nộp bài, thời lượng 45 phút đứng lớp và 5 bài tập thực hành.
- **📸 Bằng chứng ảnh:** `![Prompt 2](image_tmh/anh_2.png)`

#### 🔹 Prompt 3: Phân tích Quy tắc Đóng gói Submission (Project Submission Rules)
- **Nội dung Prompt:** *"Project Submission Rules & Guidelines 1. Deliverables & Required Formats All components of your seminar submission must..."*
- **AI Phân tích & Phản hồi:** AI trích xuất các quy định ngặt nghèo:
  1. Slide thuyết trình: Markdown/HTML + PDF.
  2. Báo cáo tổng hợp: Markdown + PDF (chứa cả User Guide và AI Audit Pack).
  3. Video Demo: Link YouTube Unlisted (cấm link Google Drive/OneDrive).
  4. Đóng gói file cuối cùng: `Group08.zip` ($\le$ 20 MB).
  5. **Bắt buộc:** Tất cả section trong report/slides phải ghi rõ `MSSV - Họ và tên`.
- **📸 Bằng chứng ảnh:** `![Prompt 3](image_tmh/anh_3.png)`

#### 🔹 Prompt 4 – 5: Rà soát Link Nộp bài & Thông báo của Thầy Hoàng / Thầy Thanh
- **Nội dung Prompt:** *"Chào cả lớp, Theo yêu cầu của thầy Hoàng, tất cả các nhóm (thầy Lộc + thầy Thanh) nộp bài seminar..."*
- **AI Phân tích & Phản hồi:** Xác nhận thời hạn và yêu cầu gộp toàn bộ deliverables vào master report.
- **📸 Bằng chứng ảnh:** `![Prompt 4](image_tmh/anh_4.png)`

#### 🔹 Prompt 6 – 7: Xác định Cấu trúc Báo cáo Master Final Report
- **Nội dung Prompt:** *"tui tính Final Report: Written in Markdown + PDF sẽ gồm hết những deliveries á... bạn chắc đã đủ hết chưa, bạn đọc ở đâu vậy"*
- **AI Phân tích & Phản hồi:** Liệt kê 8 hạng mục deliverables bắt buộc và đối chiếu nguồn gốc từng phần từ tài liệu môn học.
- **📸 Bằng chứng ảnh:** `![Prompt 5](image_tmh/anh_5.png)`

---

### 📍 GIAI ĐOẠN 2: Giải Quyết Xung Đột Git & Khảo Sát Code EShop SUT (Prompts 8 – 11)

#### 🔹 Prompt 8: Bỏ theo dõi thư mục `eshop-sut` bị thừa trên Git
- **Nội dung Prompt:** *"eshop-sut là gì vậy bỏ nó đi được k sao tự nhiên git add . cái nó yêu cầu add quá trời"*
- **AI Phân tích & Phản hồi:** Hướng dẫn cập nhật `.gitignore` để loại bỏ `node_modules/`, `*.sqlite`, `.stryker-tmp/` và giữ lại mã nguồn EShop backend thật.
- **📸 Bằng chứng ảnh:** `![Prompt 6](image_tmh/anh_6.png)`

#### 🔹 Prompt 9: Xử lý Git Pull & Conflict với nhánh main
- **Nội dung Prompt:** *"PS D:\Seminar\Seminar_Testing> git pull origin main ... Auto packing the repository ... error: Your local changes..."*
- **AI Phân tích & Phản hồi:** Hướng dẫn stashing/merging giải quyết xung đột trên `server.js` và `package.json`.
- **📸 Bằng chứng ảnh:** `![Prompt 7](image_tmh/anh_7.png)`

#### 🔹 Prompt 10 – 11: Rà soát Kết quả Kiểm thử của các Thành viên
- **Nội dung Prompt:** *"submission có gì đây bạn tui nó làm gì vậy ... là đủ hết các deliverable chưa"*
- **AI Phân tích & Phản hồi:** Kiểm tra file test `order.api.test.js` (Khải) và `admin-products.api.test.js` (Thắng), tổng hợp số liệu baseline vs improved.
- **📸 Bằng chứng ảnh:** `![Prompt 8](image_tmh/anh_8.png)`

---

### 📍 GIAI ĐOẠN 3: Biên Soạn Master Final Report & Sửa Lỗi Format Toán / PDF (Prompts 12 – 20)

#### 🔹 Prompt 12 – 14: Xây dựng 12 Chương cho `Final_Report.md`
- **Nội dung Prompt:** *"tập trung vô final-report đi nhóm tui tính gom tất cả deliverable vô 1 file report ... Trang 6 User Guide có 7 phần bắt buộc ... Trang 8 AI Audit Pack ..."*
- **AI Phân tích & Phản hồi:** Khởi tạo file `docs/Submition/Final_Report.md` gồm 12 chương đầy đủ theo cấu trúc thầy yêu cầu.
- **📸 Bằng chứng ảnh:** `![Prompt 9](image_tmh/anh_9.png)`

#### 🔹 Prompt 15 – 17: Review & Rà soát Khoảng trống (Gap Analysis)
- **Nội dung Prompt:** *"đồng ý làm đi ... review lại xem coi thiếu gì bổ sung vô"*
- **AI Phân tích & Phản hồi:** Tạo artifact `review_gaps.md`, bổ sung 9 điểm thiếu (mục Troubleshooting, chi tiết Auth/Product, Prompt 3 debug SQLite `0xC0000005`, bug coupon thật...).
- **📸 Bằng chứng ảnh:** `![Prompt 10](image_tmh/anh_10.png)`

#### 🔹 Prompt 18 – 19: Xuất PDF Báo cáo Master (`Final_Report.pdf`)
- **Nội dung Prompt:** *"xuất pdf đi ... làm tiếp đi"*
- **AI Phân tích & Phản hồi:** Chuyển Markdown sang HTML, dùng Chrome Headless `--print-to-pdf` xuất file PDF 562 dòng (736 KB).
- **📸 Bằng chứng ảnh:** `![Prompt 11](image_tmh/anh_11.png)`

#### 🔹 Prompt 20: Phục hồi Công thức Toán LaTeX bị lỗi trong PDF
- **Nội dung Prompt:** *"nó bị sai mấy công thức toán trong pdf á sai nhiều lắm"*
- **AI Phân tích & Phản hồi:** 
  - **Phát hiện:** Các mã LaTeX thô như `$$\text{...}$$` và `$\rightarrow$` bị hiển thị dạng chuỗi thô trong PDF.
  - **Khắc phục:** Chuyển công thức Mutation Score (§3.3) sang **khung phân số HTML toán học chuẩn** và thay `$\rightarrow$` bằng **mũi tên Unicode (→)**.
- **📸 Bằng chứng ảnh:** `![Prompt 12](image_tmh/anh_12.png)`

---

### 📍 GIAI ĐOẠN 4: Hướng Dẫn AI Audit Pack, Thiết Kế Slide & Web Slide Deck (Prompts 21 – 29)

#### 🔹 Prompt 21: Giải thích Cấu trúc AI Audit Report (AI-02)
- **Nội dung Prompt:** *"AI audit report là gì ở đâu nội dung ntn"*
- **AI Phân tích & Phản hồi:** Giải thích 5 phần bắt buộc của AI Audit Report ($\ge$ 600 từ) và chỉ ra vị trí lưu trong project.
- **📸 Bằng chứng ảnh:** `![Prompt 13](image_tmh/anh_13.png)`

#### 🔹 Prompt 22 – 25: Phân tích Cấu trúc Slide Thuyết trình & Tỷ lệ Điểm môn học
- **Nội dung Prompt:** *"giờ còn slide bạn nghĩ bao nhiêu slide tập trung vô đâu ... cho hỏi trong thực hành chỉ tập trung vô cái gì ... 45 phút gì đó ... chấm điểm cao gì slide..."*
- **AI Phân tích & Phản hồi:** 
  - Đưa ra cấu trúc 14 Slides chuẩn (ghi rõ `MSSV - Họ tên`).
  - Giải thích bảng tỷ lệ điểm: Report (25%), Evidence (30%), Peer Activity (20%), AI Pack (10%), Slides (15%).
  - Phân bổ thời lượng 45 phút: 15m nói/slide + 25m trò chơi lớp học + 5m Q&A.
- **📸 Bằng chứng ảnh:** `![Prompt 14](image_tmh/anh_14.png)`

#### 🔹 Prompt 26 – 27: Tạo File Slide Markdown & Web Slide Deck Tương tác (`Group08_Slides.html`)
- **Nội dung Prompt:** *"giờ bạn làm slide đi đúng theo yêu cầu ... không phải mà là tạo HTML đi để chạy slide như website á"*
- **AI Phân tích & Phản hồi:** 
  - Viết `Group08_Slides.md` (15 slide).
  - Xây dựng ứng dụng Web Slide Deck Tương tác `Group08_Slides.html` (Dark mode, glassmorphism, 16:9, phím ⬅️/➡️/Space, fullscreen).
- **📸 Bằng chứng ảnh:** `![Prompt 15](image_tmh/anh_15.png)`

#### 🔹 Prompt 28 – 29: Dọn dẹp File Tạm & Xuất PDF Slide dạng Visual Cards (`Group08_Slides.pdf`)
- **Nội dung Prompt:** *"xóa những file dư thừa không dùng nữa đi ... rồi giờ group08_Slides.pdf chứa ảnh của từng slide chứ không là chữ nữa"*
- **AI Phân tích & Phản hồi:** 
  - Xóa các file trung gian `*_body.html`.
  - Cấu hình `@media print` trong HTML để Chrome xuất `Group08_Slides.pdf` (1.55 MB) hiển thị 15 trang Slide đồ họa rực rỡ.
- **📸 Bằng chứng ảnh:** `![Prompt 16](image_tmh/anh_16.png)`

---

### 📍 GIAI ĐOẠN 5: Kịch Bản Video Demo, Debug Stryker & Diệt Mutant Auth (Prompts 30 – 45)

#### 🔹 Prompt 30 – 32: Kịch bản Quay Video Demo 10 Bước (YouTube Unlisted)
- **Nội dung Prompt:** *"giờ còn video demo thì sao đây ... thầy cần gì opwr vieo và dựa và đâu bạn nói v ... yêu cầu viode đâu nội dung nó là gì ở đâu bằng chứng"*
- **AI Phân tích & Phản hồi:** Trích dẫn nguyên văn 10 bước quay video demo từ dòng 398–427 file `docs/planning/Project_Submission_Workplan.md`.
- **📸 Bằng chứng ảnh:** `![Prompt 17](image_tmh/anh_17.png)`

#### 🔹 Prompt 33: Sửa lỗi thiếu `node_modules` (`jest is not recognized`)
- **Nội dung Prompt:** *"PS D:\Seminar\Seminar_Testing\src\eshop-sut\backend> npm test ... 'jest' is not recognized as an internal or external command"*
- **AI Phân tích & Phản hồi:** AI thực thi `npm install` tại `src/eshop-sut/backend`, cài đặt 574 packages. Chạy lại `npm test` thành công: **5 Test Suites / 82 Tests PASSED**.
- **📸 Bằng chứng ảnh:** `![Prompt 18](image_tmh/anh_18.png)`

#### 🔹 Prompt 34 – 39: Giải thích Cơ chế Hoạt động của Stryker Mutator
- **Nội dung Prompt:** *"sao nhiều test quá vậy ... chạy npm run mutation:order thì nó làm gì stryker ... là nó chạy npm test lại cho từng mutant cho từng sự thay đổi à ... npm run mutation:auth cái này là gì ... sao biết code nào thử thách và code nào nạp file test"*
- **AI Phân tích & Phản hồi:** 
  - Giải thích cơ chế Dry-run $\rightarrow$ Instrument Mutants $\rightarrow$ Scoped Sandboxes $\rightarrow$ HTML Report.
  - Phân tích thuộc tính trong `stryker.auth.config.mjs`: `mutate: ["services/authService.js"]` (file bị thử thách) và `jest.configFile: "jest.auth.config.cjs"` (file nạp test `auth.api.test.js`).
- **📸 Bằng chứng ảnh:** `![Prompt 19](image_tmh/anh_19.png)`

#### 🔹 Prompt 40 – 41: Tiêu diệt Mutant 1 — `LogicalOperator Survived (29:11)` trong `authService.js`
- **Nội dung Prompt:** 
  > *"👽 LogicalOperator Survived (29:11) 🔽 Less*  
  > *...*  
  > *đây mutant sống hãy chỉ viết tets case diệt nó ... bạn thêm đi rồi để tui test lại"*
- **AI Phân tích & Phản hồi:** 
  - **Phân tích:** Code gốc `if (user.locked_until && new Date() < new Date(user.locked_until))` bị biến đổi `&&` thành `||`. Khi `locked_until` ở quá khứ, code gốc trả về `false` (cho đăng nhập), còn mutant trả về `true` (từ chối 403).
  - **Code thêm vào `__tests__/auth.api.test.js`:**
    ```javascript
    test("allows login when account lockout time (locked_until) has expired in the past", async () => {
      const db = require("../database");
      const user = await registerUser();
      const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();
      await new Promise((r) => db.run("UPDATE users SET locked_until = ? WHERE email = ?", [pastDate, user.email], r));
      const res = await request(app).post("/api/login").send({ email: user.email, password: user.password });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });
    ```
  - **Kết quả thực nghiệm:** Stryker báo 🟢 **Killed 2 mutants**, Mutation Score Auth tăng từ **87.16% lên 88.99%**!
- **📸 Bằng chứng ảnh:** `![Prompt 20](image_tmh/anh_20.png)`

#### 🔹 Prompt 42 – 43: Tiêu diệt Mutant 2 — `ArrayDeclaration Survived (38:11)` trong `authService.js`
- **Nội dung Prompt:** 
  > *"👽 ArrayDeclaration Survived (38:11) 🔽 Less*  
  > *[user.id] bị Stryker biến đổi thành [] trong db.run("UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?", [user.id]);*  
  > *hãy viết assertion kill đúng mutant này cho tôi ... thêm vô luôn bạn không cần chạy lệnh"*
- **AI Phân tích & Phản hồi:** 
  - **Phân tích:** Code gốc `[user.id]` bị Stryker đổi thành `[]` làm câu lệnh SQL `UPDATE` thiếu tham số `WHERE id = ?` $\rightarrow$ `login_attempts` không bị reset về 0 trong DB.
  - **Code thêm vào `__tests__/auth.api.test.js`:**
    ```javascript
    test("resets login_attempts to 0 in database after a successful login", async () => {
      const db = require("../database");
      const user = await registerUser();
      await new Promise((r) => db.run("UPDATE users SET login_attempts = 2 WHERE email = ?", [user.email], r));
      const res = await request(app).post("/api/login").send({ email: user.email, password: user.password });
      expect(res.status).toBe(200);
      const updatedUser = await new Promise((r) => db.get("SELECT login_attempts, locked_until FROM users WHERE email = ?", [user.email], (e, row) => r(row)));
      expect(updatedUser.login_attempts).toBe(0);
      expect(updatedUser.locked_until).toBeNull();
    });
    ```
  - **Kết quả thực nghiệm:** Runs `npm test` $\rightarrow$ **84/84 tests PASSED 100%**. Mutant `ArrayDeclaration (38:11)` bị 🟢 **KILLED**.
- **📸 Bằng chứng ảnh:** `![Prompt 21](image_tmh/anh_21.png)`

#### 🔹 Prompt 44 – 45: Xây dựng Thư mục & Báo cáo Nhật Ký AI Audit Toàn Bộ
- **Nội dung Prompt:** *"2. AI report => Luu lai AI audit... ... hong toàn bộ lịch sử của cuộc trò chuyện này luôn á , nhiều dữ lắm"*
- **AI Phân tích & Phản hồi:** Khởi tạo thư mục `docs/AI-report/image_tmh` và biên soạn file báo cáo `AI_Audit_Trace_TMH.md` tổng hợp toàn bộ 45 lượt prompt minh bạch 100%.
- **📸 Bằng chứng ảnh:** `![Prompt 22](image_tmh/anh_22.png)`

---

## 3. Bảng Thống Kế Chỉ Số Kiểm Toán AI Tổng Hợp (Final AI Metrics)

| Chỉ số kiểm toán | Giá trị thực nghiệm | Ghi chú |
|---|---:|---|
| **Tổng số lượt Prompt tương tác** | **45 Lượt** | Từ phân tích đề tài, fix code, làm slides đến diệt mutant |
| **Số Mutant do AI hỗ trợ tiêu diệt** | **5 Mutants** | `LogicalOperator` (29:11), `ArrayDeclaration` (38:11), `EqualityOperator`, v.v. |
| **Tỷ lệ con người kiểm chứng (Human Verification)** | **100%** | Mọi lệnh `npm test` và `npm run mutation` đều chạy thật trên máy |
| **Tổng số bài test Jest hiện tại** | **84 / 84 PASSED** | 5 Test Suites phủ xanh 100% toàn backend EShop |
| **Điểm Mutation Score Auth ban đầu** | 31.30% | Baseline |
| **Điểm Mutation Score Auth hiện tại** | **88.99%** | Improved (Killed 80 / 91 valid mutants) |
| **Điểm Mutation Score Order hiện tại** | **92.57%** | Improved (Killed 154 / 175 valid mutants) |
| **Điểm Mutation Score Product hiện tại** | **100.00%** | Final (Killed 165 / 165 valid mutants) |

---

## 4. Tuyên Bố Trách Nhiệm (AI Governance & Academic Integrity)

1. Thành viên **Trần Mạnh Hùng** và Nhóm 08 tuyên bố minh bạch 100% việc sử dụng công cụ AI (Antigravity AI / ChatGPT / Claude).
2. AI chỉ được sử dụng như một trợ lý phân tích cú pháp code diff và gợi ý ý tưởng câu lệnh `expect()`.
3. Toàn bộ kết quả số liệu, file cấu hình và bài kiểm thử trong báo cáo này đều do nhóm **tự tay thi hành và kiểm chứng thực tế trên môi trường máy tính thật**.
