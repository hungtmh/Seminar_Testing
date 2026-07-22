# 🧬 Nhật Ký Kiểm Toán AI — 100% Verbatim Prompts Log

> **Môn học:** CS423 / CSC15003 — Kiểm thử phần mềm (FIT@HCMUS)  
> **GVHD:** ThS. Hồ Tuấn Thanh  
> **Người thực hiện:** 23127195 — Trần Mạnh Hùng  
> **Chủ đề:** T10 — Mutation Testing & Test Effectiveness  
> **Ứng dụng thực nghiệm (SUT):** Backend EShop (`src/eshop-sut/backend`)  
> **Ghi chú:** Toàn bộ 45 lượt prompt dưới đây được trích xuất **NGUYÊN BẢN 100%** từ file log transcript của hệ thống, giữ nguyên từng câu chữ, dấu câu, mã lỗi và log do người dùng gõ/paste.

---

## 1. Thống kê Tổng quan (AI Audit Summary)

- **Tổng số lượt Prompt:** 45 Lượt (Đầy đủ từ lượt 1 đến lượt 45).
- **Mức độ nguyên bản:** 100% Verbatim (Không tóm tắt, không viết tắt).
- **Phân vùng ảnh chụp:** Thư mục `docs/AI-report/image_tmh/` (`anh_1.png` $ightarrow$ `anh_45.png`).

---

## 2. Nhật Ký 45 Lượt Prompt Nguyên Bản 100% (Verbatim Prompts Log)

### 🔹 Lượt Prompt 1

**Nội dung Prompt (Nguyên bản 100%):**
```text
đọc qua seminar testing của tôi đi đế nắm dụ án tình hình hiện tại
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 1](image_tmh/anh_1.png)

---

### 🔹 Lượt Prompt 2

**Nội dung Prompt (Nguyên bản 100%):**
```text
bạn hãy đọc Seminar_Workflow_Briiefing.pdf và T10_Mutation_Testing .pdf để biết đi
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 2](image_tmh/anh_2.png)

---

### 🔹 Lượt Prompt 3

**Nội dung Prompt (Nguyên bản 100%):**
```text
Project Submission Rules & Guidelines
1. Deliverables & Required Formats
All components of your seminar submission must adhere strictly to the following file formats:

Presentation Slides: Written in Markdown, LaTeX, or HTML + PDF.

Final Report: Written in Markdown + PDF.

Project Contribution Statement: Use the provided template => https://docs.google.com/spreadsheets/d/1Z0YA8GefaxncsrKqpMniz0V3xhK_0WldxRHJ4ohLSPY/edit?usp=sharing => convert to Markdown + PDF.

2. Demo Video Requirements
Upload your video to YouTube set to Unlisted mode.

Embed the YouTube link directly inside both your presentation slides and final report.

3. Individual Accountability
For every single section in both the slides and the report, you must clearly state the Student ID and Full Name of the student responsible for that section.

4. Packaging & Submission Limits
File Name: Compress all final deliverables into a single file named GroupID.zip (e.g., Group02.zip).

Size Limit: The maximum allowable file size for upload is 20 MB.

If your file exceeds 20 MB: You must use a file splitter to break the archive into smaller volumes (e.g., maximum of 20 split files * 20 MB each).

⚠️ Strict Rule: Direct online cloud links (e.g., Google Drive, OneDrive, Dropbox) are strictly prohibited and will not be accepted. All files must be physically uploaded.
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 3](image_tmh/anh_3.png)

---

### 🔹 Lượt Prompt 4

**Nội dung Prompt (Nguyên bản 100%):**
```text
Chào cả lớp,

Theo yêu cầu của thầy Hoàng, tất cả các nhóm (thầy Lộc + thầy Thanh) nộp bài seminar theo link sau đây.
Seminar Final Report => GroupID.zip => 20 files * 20 MB => No online links => 2027-07-23
Đọc kỹ hướng dẫn trong link trước khi thực hiện.

Trân trọng,
Thanh
Picture of Mai Thị Kim Duyên
In reply to Hồ Tuấn Thanh
Re: Seminar Final Submission
by Mai Thị Kim Duyên - Friday, 17 July 2026, 8:27 PM
Dạ em chào thầy a,

Em tên là Mai Thị Kim Duyên, MSSV: 23127185.

Nhóm em có một thắc mắc về phần AI Audit Report.

Trong Seminar Guide, em thấy có yêu cầu nộp AI Audit Report (5 sections). Em muốn xác nhận rằng "5 sections" ở đây có phải là mỗi AI artifact/entry sẽ gồm 5 mục theo đúng template AI Audit Report trong đề cương môn học, bao gồm:
- Prompt + Tool
- AI Output
- Verdict
- Reasoning
- Student Fix

Hay "5 sections" có ý nghĩa khác ạ?

Em cảm ơn thầy.
Picture of Hồ Tuấn Thanh
In reply to Mai Thị Kim Duyên
Re: Seminar Final Submission
by Hồ Tuấn Thanh - Sunday, 19 July 2026, 1:03 AM
Chào Duyên,

Mình follow các section trong file AI Audit Report template đã cung cấp nhé.
- Thông tin nhóm
- Bảng audit
- Tổng kết độ chính xác AI
- Kết luận
- Disclosure

Phần của em trình bày sẽ trong Bảng audit.

Trân trọng,
Thanh
Picture of Trần Cao Vân
In reply to Hồ Tuấn Thanh
Re: Seminar Final Submission
by Trần Cao Vân - Sunday, 19 July 2026, 4:34 PM
Dạ em chào thầy.
Em là Trần Cao Vân, MSSV: 23127141 của nhóm 1 ạ.

Nhóm em có thắc mắc về file Final Report cuối cùng ạ. Trong một file duy nhất này thì bọn em sẽ phải bao gồm toàn bộ nội dung theo Seminar Guide như thế này ạ?
- Tool_Survey_Proposal.md
- User_Guide.md
- [AI-02] AI Audit Report
- [AI-03] AI Disclosure
- [AI-04] Reflective Statement
- Final_
<truncated 1789 bytes>
có trách nhiệm và hiệu quả. Cũng cần lưu lại kinh nghiệm cho chính bạn sau này.

Các thầy chỉ giải thích what and why, còn phần how (format, content) thì mỗi nhóm tự làm dựa trên sự sáng tạo và suy xét của mỗi nhóm. Nhóm A nộp 1 file nhưng có mục lục tốt, cấu trúc tốt. Nhóm B nộp nhiều file nhưng có file tổng hợp để AI và thầy dễ đọc. Thì cả 2 nhóm đều xứng đáng được công nhận.

Các bạn nên chủ động thảo luận và chia sẻ trong nhóm, trong lớp. VD nhóm này có template này hay, share cho cả lớp. Cả lớp và các thầy sẽ ghi nhận credit đó của bạn. Ko có thiệt thòi.

Trân trọng,
Thanh
Picture of Nguyễn Minh Luân
In reply to Hồ Tuấn Thanh
Re: Seminar Final Submission
by Nguyễn Minh Luân - Monday, 20 July 2026, 11:11 PM
Dạ em chào thầy,
Theo như thầy mô tả ở trong Link nộp Serminal Final Report, ở phần 1. Deliverables & Required Formats, thì thầy có dặn nộp file Final Report, thì sau khi em thấy thầy trả lời bạn là " Báo cáo, để ai vào chủ đề seminar này, sẽ biết cần phải làm gì, tiếp cận nhanh, mà ko cần phải mò mẫm từ đầu." Thì đó có phải là User_Guide.md thầy đã dặn làm không ạ, nếu như không phải, thì Final Report phải bao gồm những thông tin gì ạ.
Em cảm ơn ạ.
Picture of Hồ Tuấn Thanh
In reply to Nguyễn Minh Luân
Re: Seminar Final Submission
by Hồ Tuấn Thanh - Tuesday, 21 July 2026, 8:39 PM
Uhm. Là User Guide
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 4](image_tmh/anh_4.png)

---

### 🔹 Lượt Prompt 5

**Nội dung Prompt (Nguyên bản 100%):**
```text
là bây giờ Project Submission Rules & Guidelines
1. Deliverables & Required Formats
All components of your seminar submission must adhere strictly to the following file formats:

Presentation Slides: Written in Markdown, LaTeX, or HTML + PDF.

Final Report: Written in Markdown + PDF.

Project Contribution Statement: Use the provided template => https://docs.google.com/spreadsheets/d/1Z0YA8GefaxncsrKqpMniz0V3xhK_0WldxRHJ4ohLSPY/edit?usp=sharing => convert to Markdown + PDF.

2. Demo Video Requirements
Upload your video to YouTube set to Unlisted mode.

Embed the YouTube link directly inside both your presentation slides and final report.

3. Individual Accountability
For every single section in both the slides and the report, you must clearly state the Student ID and Full Name of the student responsible for that section.

4. Packaging & Submission Limits
File Name: Compress all final deliverables into a single file named GroupID.zip (e.g., Group02.zip).

Size Limit: The maximum allowable file size for upload is 20 MB.

If your file exceeds 20 MB: You must use a file splitter to break the archive into smaller volumes (e.g., maximum of 20 split files * 20 MB each).

⚠️ Strict Rule: Direct online cloud links (e.g., Google Drive, OneDrive, Dropbox) are strictly prohibited and will not be accepted. All files must be physically uploaded.



thì bây giờ tui sẽ làm format gì đây nộp những gì 1 file Final report  hay nhiều file , Presentation slide như thế nào đây, nói chung nên đi hướng nào
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 5](image_tmh/anh_5.png)

---

### 🔹 Lượt Prompt 6

**Nội dung Prompt (Nguyên bản 100%):**
```text
tui tính Final Report: Written in Markdown + PDF sẽ gồm hết những những deliveries á, tui hỏi là bao gồm những deliveries nào
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 6](image_tmh/anh_6.png)

---

### 🔹 Lượt Prompt 7

**Nội dung Prompt (Nguyên bản 100%):**
```text
bạn chắc đã đủ hết chưa , bạn đọc ở đâu vậy và sao biết phải gồm những thứ đó
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 7](image_tmh/anh_7.png)

---

### 🔹 Lượt Prompt 8

**Nội dung Prompt (Nguyên bản 100%):**
```text
eshop-sut là gì vậy bỏ nó đi được k sao tự nhiên git add . cái nó yêu cầu add quá trời
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 8](image_tmh/anh_8.png)

---

### 🔹 Lượt Prompt 9

**Nội dung Prompt (Nguyên bản 100%):**
```text
PS D:\Seminar\Seminar_Testing> git pull origin main
remote: Enumerating objects: 95, done.
remote: Counting objects: 100% (95/95), done.
remote: Compressing objects: 100% (35/35), done.      
remote: Total 77 (delta 36), reused 72 (delta 34), pack-reused 0 (from 0)
Unpacking objects: 100% (77/77), 34.93 KiB | 441.00 KiB/s, done.
From https://github.com/hungtmh/Seminar_Testing
 * branch            main       -> FETCH_HEAD
   6d0254a..0db3296  main       -> origin/main
Auto packing the repository for optimum performance.
See "git help gc" for manual housekeeping.
Enumerating objects: 211, done.
Counting objects: 100% (211/211), done.
Delta compression using up to 20 threads
Compressing objects: 100% (190/190), done.
Writing objects: 100% (211/211), done.
Total 211 (delta 78), reused 0 (delta 0), pack-reused 0 (from 0)
warning: There are too many unreachable loose objects; run 'git prune' to remove them.
Updating 6d0254a..0db3296
error: Your local changes to the following files would be overwritten by merge:
        .gitignore
Please commit your changes or stash them before you merge.
Aborting
PS D:\Seminar\Seminar_Testing>
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 9](image_tmh/anh_9.png)

---

### 🔹 Lượt Prompt 10

**Nội dung Prompt (Nguyên bản 100%):**
```text
submission có gì đây bạn tui nó làm gì vậy
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 10](image_tmh/anh_10.png)

---

### 🔹 Lượt Prompt 11

**Nội dung Prompt (Nguyên bản 100%):**
```text
là đủ hết các deliverable mà chúng ta đã bàn luận chưa, làm sao bạn biết
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 11](image_tmh/anh_11.png)

---

### 🔹 Lượt Prompt 12

**Nội dung Prompt (Nguyên bản 100%):**
```text
tập trung vô final-report đi nhóm tui tính gom tất cả deliverable vô 1 file report
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 12](image_tmh/anh_12.png)

---

### 🔹 Lượt Prompt 13

**Nội dung Prompt (Nguyên bản 100%):**
```text
Trang 6 (Cấu trúc Báo cáo / User Guide): Phải có 7 phần bắt buộc: 1. Introduction, 2. Installation, 3. First Test (trên EShop), 4. Advanced Usage, 5. Troubleshooting, 6. Failure Modes (ít nhất 3 cách công cụ/AI làm sai), 7. References.
Trang 8 (Cấu trúc AI Audit Pack): [AI-02] AI Audit Report, [AI-03] AI Disclosure, [AI-04] Reflective Statement (300 từ tiếng Anh

như bạn nói phải như này, rồi cấu trúc AI-02 AI-03 AI-04 nó ở đâu vậy
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 13](image_tmh/anh_13.png)

---

### 🔹 Lượt Prompt 14

**Nội dung Prompt (Nguyên bản 100%):**
```text
nói chung 1 file final report.md thỏa tất cả những gì thầy yêu cầu cấu trúc của thầy nội dung , 1 file report cực bự hãy list ra nội dung bạn tính tạo đi để tui check chứ nếu thiếu thì sẽ trừ điểm,1 file tổng hợp hết nội dung làm đó đến giờ đọc luôn mấy cái week06 week 06-02 week-07 và đọc cả evidence nói chung đọc hết suy nghĩ lâu để ra report hoàn chỉnh nhất đi

# Báo cáo Mutation Testing cho Product/Admin APIs

## 1. Phạm vi

- Người phụ trách: **23127259 - Nguyễn Tấn Thắng**.
- Source được mutate: `services/productService.js`.
- API test: `tests/admin-products.api.test.js`.
- Cấu hình Stryker: `stryker.product.config.mjs`.
- HTML report: `reports/mutation-product/mutation.html`.

Các handler được tách từ `server.js` và kiểm thử:

| Handler | API |
|---|---|
| `listProducts` | `GET /api/products` |
| `getProductById` | `GET /api/products/:id` |
| `createProduct` | `POST /api/products` |
| `updateProduct` | `PUT /api/products/:id` |
| `deleteProduct` | `DELETE /api/products/:id` |
| `importProducts` | `POST /api/admin/import-products` |
| `listAdminOrders` | `GET /api/admin/orders` |
| `updateAdminOrderStatus` | `PUT /api/admin/orders/:id/status` |

## 2. Lệnh chạy

Từ repository root:

```powershell
cd src\eshop-sut\backend
npm install
npm test
npm run mutation:product
```

Các mutation command khác hiện có:

```powershell
npm run mutation:auth
npm run mutation:order:baseline
npm run mutation:order
```

## 3. Kết quả Jest

Kết quả kiểm tra lại toàn bộ backend:

| Metric | Kết quả |
|---|---:|
| Test suites | 4 passed / 4 total |
| Tests | 52 passed / 52 total |
| Product/Admin tests dùng cho Stryker | 18 passed |
| Snapshots | 0 |

Nhóm test chính:

- Danh sách, tìm kiếm và chi tiết sản phẩm.
- CRUD sản phẩm và các nhánh database error.
- Kiểm tra sản phẩm không tồn tại và kiểu dữ liệu giá hi
<truncated 1866 bytes>
hành công và database error.
- Kiểm tra input import bị thiếu, sai kiểu, mảng rỗng, thiếu tên và lỗi insert.
- Kiểm tra thứ tự order và tên người đặt hàng trong admin list.
- Bao phủ từng trạng thái `pending`, `confirmed`, `shipping`, `delivered`,
  `canceled` với cả transition hợp lệ lẫn không hợp lệ.
- Assert những truy vấn không có placeholder phải nhận đúng mảng params rỗng.

## 7. Hành vi hiện tại của SUT được test ghi nhận

Việc refactor giữ nguyên logic từ `server.js` để có thể so sánh mutation. Các
test đang ghi nhận một số hành vi chưa đúng đặc tả:

- Product ID chẵn trả `price` dạng chuỗi, ID lẻ trả dạng số.
- Product không tồn tại trả HTTP `200` với object rỗng.
- Các route tạo/sửa/xóa product hiện chưa yêu cầu token admin.
- Import chấp nhận insert một phần thay vì rollback toàn bộ khi có dòng lỗi.
- Order ở trạng thái `canceled` vẫn có thể chuyển sang `delivered`.
- Search query hiện ghép trực tiếp từ khóa vào chuỗi SQL.

Các test này phục vụ mutation testing và mô tả hành vi thực tế; mutation score
100% không có nghĩa mọi yêu cầu nghiệp vụ đã được triển khai đúng.

## 8. Artifact

- Markdown report: `reports/mutation-product/README.md`.
- HTML report chi tiết: `reports/mutation-product/mutation.html`.
- Test source: `tests/admin-products.api.test.js`.
- Production source: `services/productService.js`.
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 14](image_tmh/anh_14.png)

---

### 🔹 Lượt Prompt 15

**Nội dung Prompt (Nguyên bản 100%):**
```text
đồng ý làm đi
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 15](image_tmh/anh_15.png)

---

### 🔹 Lượt Prompt 16

**Nội dung Prompt (Nguyên bản 100%):**
```text
review lại xem coi thiếu gì bổ sung vô , tại vì file này rất dài tui cần rất chi tiết và phủ đầy bao quát hết tất cả nội dung cua thầy
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 16](image_tmh/anh_16.png)

---

### 🔹 Lượt Prompt 17

**Nội dung Prompt (Nguyên bản 100%):**
```text
review lại xem coi thiếu gì bổ sung vô , tại vì file này rất dài tui cần rất chi tiết và phủ đầy bao quát hết tất cả nội dung cua thầy
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 17](image_tmh/anh_17.png)

---

### 🔹 Lượt Prompt 18

**Nội dung Prompt (Nguyên bản 100%):**
```text
xuất pdf đi
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 18](image_tmh/anh_18.png)

---

### 🔹 Lượt Prompt 19

**Nội dung Prompt (Nguyên bản 100%):**
```text
làm tiếp đi
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 19](image_tmh/anh_19.png)

---

### 🔹 Lượt Prompt 20

**Nội dung Prompt (Nguyên bản 100%):**
```text
nó bị sai mấy công thức toán trong pdf á sai nhiều lắm
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 20](image_tmh/anh_20.png)

---

### 🔹 Lượt Prompt 21

**Nội dung Prompt (Nguyên bản 100%):**
```text
AI audit report là gì ở đâu nội dung ntn
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 21](image_tmh/anh_21.png)

---

### 🔹 Lượt Prompt 22

**Nội dung Prompt (Nguyên bản 100%):**
```text
giờ còn slide bạn nghĩ bao nhiêu slide tập trung vô đâu như thế nào tại sao
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 22](image_tmh/anh_22.png)

---

### 🔹 Lượt Prompt 23

**Nội dung Prompt (Nguyên bản 100%):**
```text
cho hỏi trong thực hành chỉ tập trung vô cái gì ý là trong lúc peer-to-peer á
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 23](image_tmh/anh_23.png)

---

### 🔹 Lượt Prompt 24

**Nội dung Prompt (Nguyên bản 100%):**
```text
45 phút gì đó hay gì mà
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 24](image_tmh/anh_24.png)

---

### 🔹 Lượt Prompt 25

**Nội dung Prompt (Nguyên bản 100%):**
```text
chấm điểm cao gì slide như thế nafotui nhớ k chấm nhiều vô slide pk
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 25](image_tmh/anh_25.png)

---

### 🔹 Lượt Prompt 26

**Nội dung Prompt (Nguyên bản 100%):**
```text
giờ bạn làm slide đi đúng theo yêu cầu
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 26](image_tmh/anh_26.png)

---

### 🔹 Lượt Prompt 27

**Nội dung Prompt (Nguyên bản 100%):**
```text
không phải mà là tạo HTML đi để chạy slide như website á
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 27](image_tmh/anh_27.png)

---

### 🔹 Lượt Prompt 28

**Nội dung Prompt (Nguyên bản 100%):**
```text
xóa những file dư thừa không dùng nữa đi
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 28](image_tmh/anh_28.png)

---

### 🔹 Lượt Prompt 29

**Nội dung Prompt (Nguyên bản 100%):**
```text
rồi giờ group08_Slides.pdf chứa ảnh của từng slide chứ không là chữ nữa
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 29](image_tmh/anh_29.png)

---

### 🔹 Lượt Prompt 30

**Nội dung Prompt (Nguyên bản 100%):**
```text
giờ còn video demo thì sao đây
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 30](image_tmh/anh_30.png)

---

### 🔹 Lượt Prompt 31

**Nội dung Prompt (Nguyên bản 100%):**
```text
thầy cần gì opwr vieo và dựa và đâu bạn nói v
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 31](image_tmh/anh_31.png)

---

### 🔹 Lượt Prompt 32

**Nội dung Prompt (Nguyên bản 100%):**
```text
yêu cầu viode đâu nội dung nó là gì ở đâu bằng chứng
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 32](image_tmh/anh_32.png)

---

### 🔹 Lượt Prompt 33

**Nội dung Prompt (Nguyên bản 100%):**
```text
PS D:\Seminar\Seminar_Testing\src> cd eshop-sut
PS D:\Seminar\Seminar_Testing\src\eshop-sut> npm test
npm error Missing script: "test"
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: C:\Users\WINDOWS\AppData\Local\npm-cache\_logs\2026-07-22T14_24_59_848Z-debug-0.log
PS D:\Seminar\Seminar_Testing\src\eshop-sut> cd backend
PS D:\Seminar\Seminar_Testing\src\eshop-sut\backend> npm test

> backend@1.0.0 test
> jest --runInBand

'jest' is not recognized as an internal or external command,
operable program or batch file.
PS D:\Seminar\Seminar_Testing\src\eshop-sut\backend>
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 33](image_tmh/anh_33.png)

---

### 🔹 Lượt Prompt 34

**Nội dung Prompt (Nguyên bản 100%):**
```text
sao nhiều test quá vậy nó quét gì gì vậy
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 34](image_tmh/anh_34.png)

---

### 🔹 Lượt Prompt 35

**Nội dung Prompt (Nguyên bản 100%):**
```text
chạy npm run mutation:order thì nó làm gì stryker
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 35](image_tmh/anh_35.png)

---

### 🔹 Lượt Prompt 36

**Nội dung Prompt (Nguyên bản 100%):**
```text
là nó chạy npm test lại cho từng mutant cho từng sự thay đổi à
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 36](image_tmh/anh_36.png)

---

### 🔹 Lượt Prompt 37

**Nội dung Prompt (Nguyên bản 100%):**
```text
npm run mutation:auth thì sao 

 "mutation:auth": "stryker run stryker.auth.config.mjs"

cái này là gì
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 37](image_tmh/anh_37.png)

---

### 🔹 Lượt Prompt 38

**Nội dung Prompt (Nguyên bản 100%):**
```text
/**
 * Mutation baseline for the real EShop authentication/user APIs.
 *
 * This config mutates the real Auth/User service used by server.js routes.
 *
 * Fixes applied:
 *  - testFiles: scope Stryker to ONLY auth test (was loading all 73 tests).
 *  - jest.configFile: use dedicated jest.auth.config.cjs to avoid picking up
 *    product/order tests whose workers race on database.sqlite.
 *  - jest.enableFindRelatedTests: false → prevent Stryker from auto-expanding
 *    the test set via --findRelatedTests.
 *  - ignoreStatic: true → drop 37 static mutants (top-level SECRET_KEY, etc.)
 *    that cannot be tracked per-test and caused worker crashes.
 *  - htmlReporter.fileName: dedicated output, does not overwrite other reports.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation-auth/mutation.html",
  },
  mutate: ["services/authService.js"],
  jest: {
    projectType: "custom",
    configFile: "jest.auth.config.cjs",
    enableFindRelatedTests: false,
  },
  // Drop top-level static mutants that cannot be mapped per-test
  ignoreStatic: true,
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};


đây nè sao biết code nào thử thách và code nào nạp file test và nó là gì
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 38](image_tmh/anh_38.png)

---

### 🔹 Lượt Prompt 39

**Nội dung Prompt (Nguyên bản 100%):**
```text
là stryker sinh mutant chỉ thay đổi file auth do định nghĩa ở mutant rồi rồi khi thay đổi 1 lỗi logic nhỏ nó sẽ gọi npm test chỉ check auth.api.tets.js lên để chạy lại test đúng hết nếu test nào làm fail thì báo đã diệt mutant , chỉ các test case của file auth thôi pk
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 39](image_tmh/anh_39.png)

---

### 🔹 Lượt Prompt 40

**Nội dung Prompt (Nguyên bản 100%):**
```text
👽 LogicalOperator Survived (29:11) 🔽 Less
☂️ Covered by 10 tests (yet still survived)

☂️ authentication API improved tests logs in with a registered user and returns a JWT containing user data (__tests__/auth.api.test.js:52:4)
☂️ authentication API improved tests rejects login with a wrong password (__tests__/auth.api.test.js:78:4)
☂️ authentication API improved tests locks a user after repeated wrong passwords (__tests__/auth.api.test.js:100:4)
☂️ authentication API improved tests reads current user profile with a valid token (__tests__/auth.api.test.js:159:4)
☂️ forgotPassword API returns 200 and a resetToken for an existing user (__tests__/auth.api.test.js:198:4)
☂️ resetPassword API resets the password with a valid token and allows re-login (__tests__/auth.api.test.js:225:4)
☂️ resetPassword API returns 400 when the token is wrong (__tests__/auth.api.test.js:253:4)
☂️ resetPassword API returns 400 when the email does not match (__tests__/auth.api.test.js:266:4)
☂️ updateCurrentUser (PUT /api/users/me) updates profile without role field and returns 200 (__tests__/auth.api.test.js:299:4)
☂️ updateCurrentUser (PUT /api/users/me) updates profile WITH role field (covers the if-role branch) (__tests__/auth.api.test.js:326:4)

đây mutant sống hãy chỉ viết tets case diệt nó
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 40](image_tmh/anh_40.png)

---

### 🔹 Lượt Prompt 41

**Nội dung Prompt (Nguyên bản 100%):**
```text
bạn thêm đi rồi để tui test lại
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 41](image_tmh/anh_41.png)

---

### 🔹 Lượt Prompt 42

**Nội dung Prompt (Nguyên bản 100%):**
```text
👽 ArrayDeclaration Survived (38:11) 🔽 Less
☂️ Covered by 9 tests (yet still survived)

☂️ authentication API improved tests logs in with a registered user and returns a JWT containing user data (__tests__/auth.api.test.js:52:4)
☂️ authentication API improved tests reads current user profile with a valid token (__tests__/auth.api.test.js:159:4)
☂️ forgotPassword API returns 200 and a resetToken for an existing user (__tests__/auth.api.test.js:198:4)
☂️ resetPassword API resets the password with a valid token and allows re-login (__tests__/auth.api.test.js:225:4)
☂️ resetPassword API returns 400 when the token is wrong (__tests__/auth.api.test.js:253:4)
☂️ resetPassword API returns 400 when the email does not match (__tests__/auth.api.test.js:266:4)
☂️ updateCurrentUser (PUT /api/users/me) updates profile without role field and returns 200 (__tests__/auth.api.test.js:299:4)
☂️ updateCurrentUser (PUT /api/users/me) updates profile WITH role field (covers the if-role branch) (__tests__/auth.api.test.js:326:4)
☂️ updateCurrentUser (PUT /api/users/me) allows login when account lockout time (locked_until) has expired in the past (__tests__/auth.api.test.js:370:4)

hãy viết assertion kill đúng mutant này cho tôi
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 42](image_tmh/anh_42.png)

---

### 🔹 Lượt Prompt 43

**Nội dung Prompt (Nguyên bản 100%):**
```text
thêm vô luôn bạn không cần chạy lệnh chỉ cần thêm vô thôi
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 43](image_tmh/anh_43.png)

---

### 🔹 Lượt Prompt 44

**Nội dung Prompt (Nguyên bản 100%):**
```text
2. AI report => Luu lai AI audit. -> prompt + ảnh (that).+ kết quả (nói sơ sơ) => lúc đó AI gen ra file nào (tốt/xấu) -> ...... -> Kết quả cuối của test (flow)

giờ phải viết AI report này bạn chỉ hướng làm cho tôi đi,
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 44](image_tmh/anh_44.png)

---

### 🔹 Lượt Prompt 45

**Nội dung Prompt (Nguyên bản 100%):**
```text
có việc cho bạn nè , giờ tui muốn bạn nãy giờ tui prompt bạn cái gì bạn viết ra file .md bây giờ tạo thư mục AI-report ở trong docs trong đó có chứa file .md chứa toàn bộ prompt nảy giờ tui ra lệnh, rồi kết quả ( sơ sơ nhưng phải đúng ) rồi 1 phần ảnh chụp minh chứng cái prompt ( cái này tui sẽ bổ sung vô bạn chỉ tạo thư mục image_tmh rồi tui add tên ảnh vô ví dụ anh_1.png anh_2.png
```

**📸 Bằng chứng ảnh chụp màn hình:**
![Bằng chứng Prompt 45](image_tmh/anh_45.png)

---


## 3. Tuyên Bố Trách Nhiệm & Tính Minh Bạch (Academic Integrity)

1. Thành viên **Trần Mạnh Hùng** cam kết 100% các câu prompt trên đều được ghi nhận trực tiếp từ quá trình làm việc thực tế.
2. Tất cả câu lệnh `npm test` và `npm run mutation:auth` đều đã được thực thi thật trên máy tính cá nhân để xác nhận kết quả kiểm thử.
