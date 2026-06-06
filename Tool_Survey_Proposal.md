# 📋 Tool Survey Proposal — Stage S1
## Seminar CS423 / CSC15003 — FIT@HCMUS

---

| Thông tin | Chi tiết |
|---|---|
| **Tên nhóm** | Nhóm 8 |
| **Thành viên** | Trần Mạnh Hùng · Ninh Văn Khải · Nguyễn Tấn Thắng |
| **MSSV** | 23127195 · [MSSV 2] · [MSSV 3] |
| **Chủ đề** | **T10 — Mutation Testing & Test Effectiveness** |
| **Ngày nộp** | 06/06/2026 |
| **Giảng viên** | ThS. Lâm Quang Vũ |

---

## 1. Mô tả vấn đề

**Vấn đề cốt lõi:**  
Code coverage cao (80–100%) không đảm bảo bộ test thực sự chất lượng. Một test suite có thể chạy qua mọi dòng code nhưng vẫn bỏ sót các lỗi logic tinh vi — ví dụ: đổi `>=` thành `>` trong điều kiện boundary, hay đảo `&&` thành `||` trong điều kiện phức tạp.

**Mutation Testing** giải quyết vấn đề này bằng cách tự động tạo ra các phiên bản lỗi nhỏ của source code (gọi là *mutants*) và kiểm tra xem bộ test có phát hiện ra không. Nếu test vẫn PASS khi code đã bị sai → test đó không đủ tin cậy.

**Độ liên quan với EShop:** Backend Node.js/TypeScript của EShop chứa nhiều business logic nhạy cảm (tính giá, áp dụng discount, validate đơn hàng) — đây là nơi mutation testing mang lại giá trị cao nhất.

---

## 2. Công cụ đề xuất

### 🔧 Công cụ truyền thống: **Stryker Mutator**

| Thuộc tính | Chi tiết |
|---|---|
| **Website** | https://stryker-mutator.io |
| **Ngôn ngữ** | JavaScript, TypeScript, C#, Scala |
| **License** | Apache 2.0 (Miễn phí) |
| **Phiên bản** | Stryker v8.x (2024) |
| **Test runner** | Jest, Mocha, Jasmine, Vitest |

**Lý do chọn Stryker:**
- ✅ Hỗ trợ trực tiếp Node.js/TypeScript — phù hợp 100% với EShop backend
- ✅ Báo cáo HTML tương tác, trực quan — dễ demo trong buổi seminar
- ✅ Hỗ trợ incremental mode — chỉ test lại phần code thay đổi, tiết kiệm thời gian
- ✅ Cộng đồng lớn, tài liệu phong phú, được dùng rộng rãi trong industry
- ✅ Tích hợp sẵn với GitHub Actions / CI-CD pipelines

**Các tính năng sẽ demo:**
1. Cài đặt và cấu hình Stryker trên EShop backend
2. Phân tích báo cáo HTML (killed / survived / timeout / noCoverage)
3. Phân tích 3 surviving mutants thực tế từ module checkout
4. Viết test bổ sung để kill các mutants đó

---

### 🤖 Công cụ AI-Augmented: **ChatGPT / Claude (Prompt-based LLM workflow)**

| Thuộc tính | Chi tiết |
|---|---|
| **Công cụ** | ChatGPT-5.5 (OpenAI) và/hoặc Claude 4.6 Sonnet (Anthropic) |
| **Mô hình tích hợp** | Prompt-based — không cần cài đặt plugin |
| **Chi phí** | Free tier / $20/tháng (subscription) |
| **Cách dùng** | Phân tích surviving mutants, gợi ý assertion, phát hiện equivalent mutants |

**Lý do chọn ChatGPT/Claude thay vì DiffBlue Cover:**
- ✅ DiffBlue Cover chỉ hỗ trợ Java — không phù hợp với EShop (Node.js)
- ✅ LLM hiểu ngữ nghĩa code → có khả năng phân biệt **equivalent mutant** (mutant không thể kill)
- ✅ Dễ demo và tương tác trong buổi học — không cần setup phức tạp
- ✅ Nghiên cứu học thuật (arxiv 2024) xác nhận LLMs đạt F1-score cao hơn 35% so với heuristics trong phát hiện equivalent mutants

**Workflow AI-Augmented sẽ demo:**
1. Feed surviving mutant diff vào ChatGPT → AI gợi ý assertion cụ thể
2. Hỏi Claude phân tích xem mutant có phải equivalent không
3. Dùng AI tạo test suite từ báo cáo Stryker → verify kết quả

---

## 3. Kế hoạch thực hiện sơ bộ

| Giai đoạn | Nội dung | Thời gian dự kiến |
|---|---|---|
| **Tuần 1** | Cài đặt Stryker, chạy thử trên EShop, ghi nhận kết quả ban đầu | [Ngày] — [Ngày] |
| **Tuần 2** | Phân tích surviving mutants, thực hành AI-augmented workflow | [Ngày] — [Ngày] |
| **Tuần 3** | Viết User_Guide.md, thiết kế hands-on activity, quay video demo | [Ngày] — [Ngày] |
| **Tuần 4** | Hoàn thiện tài liệu, chuẩn bị buổi seminar, viết AI Audit report | [Ngày] — [Ngày] |

---

## 4. Kết quả mong đợi

Sau buổi seminar, học viên tham gia có thể:

1. **Giải thích** được sự khác biệt giữa code coverage và mutation score
2. **Cài đặt và chạy** Stryker trên một project Node.js/TypeScript thực tế
3. **Phân tích** báo cáo HTML của Stryker để xác định điểm yếu trong test suite
4. **Sử dụng** ChatGPT/Claude để gợi ý assertion nhằm kill surviving mutants
5. **Phân biệt** được equivalent mutant (không thể kill) với real survived mutant
6. **Hiểu** được giới hạn và failure modes của cả hai loại công cụ

---

## 5. Tài liệu tham khảo sơ bộ

- Stryker Mutator Official Docs: https://stryker-mutator.io/docs/
- Offutt & Untch (2001). *Mutation 2000: Uniting the Orthogonal.* In Mutation Testing for the New Century.
- Papadakis et al. (2019). *Mutation Testing Advances: An Analysis and Survey.* Advances in Computers.
- Topic T10 description: *Mutation Testing and Test Effectiveness* — CS423, FIT@HCMUS (2025)

---

*Đề xuất này được nộp cho giai đoạn S1 — Seminar CS423/CSC15003, FIT@HCMUS.*  
*Nhóm cam kết thực hiện đúng tiến độ và tuân thủ hướng dẫn AI Disclosure của môn học.*
