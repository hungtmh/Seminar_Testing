# Báo cáo Seminar T10 — Mutation Testing & Test Effectiveness

> **Nhóm 08 · CS423 / CSC15003 — FIT@HCMUS**
> **GVHD (thực hành):** ThS. Hồ Tuấn Thanh
> **Thành viên:** 23127195 Trần Mạnh Hùng · 23127060 Ninh Văn Khải · 23127259 Nguyễn Tấn Thắng
>
> 🎥 **Video demo (YouTube, Unlisted):** `<<DÁN_YOUTUBE_UNLISTED_LINK_TẠI_ĐÂY>>`

---

## Mục lục

1. [Tổng quan seminar](#1-tổng-quan-seminar)
2. [Vấn đề & lý do chọn công cụ](#2-vấn-đề--lý-do-chọn-công-cụ)
3. [Mutation Testing — nền tảng lý thuyết](#3-mutation-testing--nền-tảng-lý-thuyết)
4. [Cài đặt & cấu hình Stryker trên EShop](#4-cài-đặt--cấu-hình-stryker-trên-eshop)
5. [Chạy mutation & hành trình cải thiện điểm](#5-chạy-mutation--hành-trình-cải-thiện-điểm)
6. [Phân tích surviving mutants](#6-phân-tích-surviving-mutants)
7. [Quy trình AI-Augmented](#7-quy-trình-ai-augmented)
8. [Failure modes của công cụ](#8-failure-modes-của-công-cụ)
9. [Hoạt động lớp "Kill the Mutant"](#9-hoạt-động-lớp-kill-the-mutant)
10. [AI Report (tóm tắt)](#10-ai-report-tóm-tắt)
11. [Phân công công việc](#11-phân-công-công-việc)
12. [Tài liệu tham khảo](#12-tài-liệu-tham-khảo)

> **Quy ước:** Mỗi mục ghi rõ **người phụ trách** theo yêu cầu Individual Accountability của thầy. Nội dung chi tiết đầy đủ nằm ở các file trong `appendix/`.

---

## 1. Tổng quan seminar

*Người phụ trách: 23127060 - Ninh Văn Khải*

Seminar T10 trình bày **Mutation Testing** — kỹ thuật đánh giá *chất lượng thật* của bộ test, thứ mà code coverage không đo được. Nhóm áp dụng **Stryker Mutator** lên backend **EShop** (Node.js/Express + SQLite), kết hợp **workflow AI-Augmented (ChatGPT/Claude)** để phân tích và tiêu diệt surviving mutants, đồng thời chỉ ra **failure modes** của cả hai loại công cụ.

**Sản phẩm nộp:** báo cáo (MD+PDF), slide, 1 video demo (YouTube unlisted), phân công, và AI Report.

---

## 2. Vấn đề & lý do chọn công cụ

*Người phụ trách: cả nhóm — chi tiết: `appendix/Tool_Survey_Proposal.md`*

- **Vấn đề cốt lõi:** coverage 80–100% **không** đảm bảo test tốt; test có thể chạy qua mọi dòng nhưng vẫn bỏ sót lỗi logic (ví dụ đổi `>=` thành `>`).
- **Công cụ truyền thống:** **Stryker Mutator** — hỗ trợ trực tiếp Node.js/JS, report HTML trực quan, tích hợp Jest.
- **Công cụ AI-Augmented:** **ChatGPT / Claude** dùng theo prompt để phân tích surviving mutant và gợi ý assertion.

---

## 3. Mutation Testing — nền tảng lý thuyết

*Người phụ trách: 23127259 - Nguyễn Tấn Thắng — chi tiết: `appendix/User_Guide.md` §1–2*

- **Mutant:** một thay đổi nhỏ, có chủ đích vào source (đổi toán tử, xóa câu lệnh, đổi hằng...).
- **Killed:** có ít nhất 1 test fail khi code bị mutate → test bắt được lỗi.
- **Survived:** mọi test vẫn pass → test thiếu assertion/case.
- **NoCoverage:** không test nào chạy qua vùng code chứa mutant.
- **Mutation score** = (Killed + Timeout) / (tổng mutant hợp lệ).
- **Equivalent mutant:** mutant không thể kill vì tương đương ngữ nghĩa với code gốc — không tính là lỗi test.

---

## 4. Cài đặt & cấu hình Stryker trên EShop

*Người phụ trách: 23127195 - Trần Mạnh Hùng — chi tiết: `appendix/User_Guide.md` §3 và `appendix/Stryker_Setup_Guide.md`*

Môi trường: Node v22, `@stryker-mutator/core@9.6.1` + `@stryker-mutator/jest-runner@9.6.1`, Jest 30.

Giai đoạn tuần 7 (baseline sớm) thử trên một module pricing tách riêng `business/orderLogic.js` để có dữ liệu mutant rõ ràng, đạt **74.19%**. Sau đó nhóm chuyển sang mutation **trực tiếp trên logic API thật** `services/orderService.js` (Cart/Order/Coupon) để phản ánh đúng nghiệp vụ EShop.

**Bài học cấu hình quan trọng (mỗi module 1 config scoped riêng):**

```javascript
// stryker.order.config.mjs
mutate: ["services/orderService.js"],
testFiles: ["tests/orders.api.test.js"],
jest: { projectType: "custom", configFile: "jest.order.config.cjs" },
coverageAnalysis: "perTest",
```

Thiếu `jest.configFile`/`testFiles` → Stryker nạp test của **mọi** module → nhiều tiến trình giành 1 file SQLite → crash. (Xem chi tiết ở `AI_Report.md`, sự cố #1 và #6.)

---

## 5. Chạy mutation & hành trình cải thiện điểm

*Người phụ trách: 23127060 - Ninh Văn Khải — bằng chứng: `appendix/evidence/report_nvk.md`*

Mục tiêu môn học 70–80%. Hành trình trên module **Order/Cart/Coupon** (`services/orderService.js`):

| Giai đoạn | Số test | Mutation score | Killed | Survived | NoCoverage | Ghi chú |
|---|---:|---:|---:|---:|---:|---|
| **Baseline** (chỉ assert HTTP 200) | 5 | **16.67%** | 14 | 6 | 69 | Test yếu, đa số mutant sống |
| **Improved** (thêm assertion nội dung + biên) | 21 | **84.21%** | 38 | 1 | 8 | Kill hầu hết surviving mutants |
| **Final** (sau khi fix scope config, chạy sạch) | 18 | **92.57%** | 154* | 6 | 7 | 162/175; hết crash SQLite |

\*Số Killed ở bản Final tính trên tổng 184 mutant của toàn module (154 killed + 8 timeout). `covered` = 96.43%.

**Diễn giải hành trình:** con số nhảy từ 16.67% → 84.21% nhờ **viết assertion đúng chỗ** (kiểm nội dung body, phân quyền user, giá trị biên coupon). Từ 84.21% → 92.57% là nhờ **sửa lỗi cấu hình Stryker** khiến các lần chạy trước bị nhiễu bởi mutant lỗi (errors) — sau khi scope đúng, con số đo được là số **thật và ổn định**. Thừa thắng xông lên, nhóm đã áp dụng quy trình tương tự cho module **Auth (đạt 87.16%)** và **Product (đạt 100%)** với môi trường SQLite `:memory:` cô lập tuyệt đối.

**6 survived + 7 no-coverage còn lại** đều ở nhánh `if (err) return res.status(500)...` (lỗi DB) — được ghi nhận ở mục [Failure modes](#8-failure-modes-của-công-cụ), có thể nâng lên ~96% nếu thêm test cho nhánh lỗi DB.

---

## 6. Phân tích surviving mutants

*Người phụ trách: 23127060 - Ninh Văn Khải — chi tiết: `appendix/User_Guide.md` §5*

Ví dụ tiêu biểu (module thật):

| Mutant | Vì sao sống | Assertion đã thêm để kill |
|---|---|---|
| `userCarts[userId] = []` → `["Stryker was here"]` | Test chỉ check status 200 | `expect(res.body).toEqual([])` |
| `filter(o => o.user_id === req.user.id)` → `!==` | Không kiểm chủ sở hữu đơn | Khẳng định mọi order trả về đúng `user_id` |
| `usage_count >= max` → `>` | Chưa test điểm biên | Test tại đúng ngưỡng `usage_count = max` → 400 |

---

## 7. Quy trình AI-Augmented

*Người phụ trách: 23127060 - Ninh Văn Khải — chi tiết: `appendix/User_Guide.md` §6 và `AI_Report.md`*

Vòng lặp **Mutant-Guided AI Loop**: chạy Stryker → lấy diff mutant sống → hỏi AI "vì sao sống + gợi ý assertion" → **tự chạy lại verify** → giữ nếu kill. Nguyên tắc bất biến: **AI gợi ý, người luôn chạy thật để kiểm chứng.**

---

## 8. Failure modes của công cụ

*Người phụ trách: 23127259 - Nguyễn Tấn Thắng — chi tiết: `appendix/User_Guide.md` §7*

- **Stryker:** equivalent mutant (không thể kill), timeout do vòng lặp/async, và **kết quả sai lệch khi cấu hình sai scope** (xem nhật ký lỗi thực tế trong `AI_Report.md`).
- **AI:** bịa API/assertion sai cú pháp (`toBe([])`), giả định môi trường (state reset), phát biểu quá tự tin ("bulletproof").
- **Nhánh chưa được bảo vệ trong dự án:** 6 survived + 7 no-coverage ở nhánh lỗi DB `res.status(500)` — ghi nhận trung thực thay vì che giấu.

---

## 9. Hoạt động lớp "Kill the Mutant"

*Người phụ trách: 23127060 - Ninh Văn Khải — đề bài + đáp án: `appendix/Activity_Worksheet.md`*

Hoạt động 25 phút: học viên đóng vai QA, viết assertion để kill **5 mutant** trích từ logic EShop; review chéo giữa các nhóm; nhóm 08 chạy thử trên hệ thống thật để chấm.

---

## 10. AI Report (tóm tắt)

*Người phụ trách: 23127060 - Ninh Văn Khải — bản đầy đủ: `AI_Report.md`*

AI Report gồm 4 phần: (1) Disclosure — liệt kê AI đã dùng; (2) Interaction Trace — log prompt/đáp thực tế; (3) **Nhật ký lỗi AI & cách fix** (6 sự cố, có kiểm chứng); (4) Audit — phân tích lỗi factual/edge case/giả định ngầm/quá tự tin của AI. Thể hiện việc dùng AI **có trách nhiệm, có kiểm soát**.

---

## 11. Phân công công việc

*Chi tiết & mức đóng góp: `Contribution_Statement.md`*

| MSSV | Họ tên | Mục phụ trách |
|---|---|---|
| 23127195 | Trần Mạnh Hùng | §4 (setup/cấu hình), module Auth/Product, baseline tuần 7 |
| 23127060 | Ninh Văn Khải | §1, §5–§7, §9–§10, kiểm thử Order/Cart/Coupon, AI Report |
| 23127259 | Nguyễn Tấn Thắng | §3, §8, User Guide, báo cáo tuần |

---

## 12. Tài liệu tham khảo

*Chi tiết: `appendix/User_Guide.md` §10*

- Stryker Mutator — https://stryker-mutator.io/docs/
- Papadakis et al. (2019). *Mutation Testing Advances: An Analysis and Survey.* Advances in Computers.
- Offutt & Untch (2001). *Mutation 2000: Uniting the Orthogonal.*
