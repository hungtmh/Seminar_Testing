# Báo cáo làm việc hằng tuần - Nhóm 08, Tuần 06

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Mã nhóm | Nhóm 08 |
| Tên nhóm | Nhóm 8 |
| Tên project | T10 - Mutation Testing & Test Effectiveness |
| Môn học | CS423 / CSC15003 - Kiểm thử phần mềm |
| Khoảng thời gian | 2026-06-29 - 2026-07-04 |
| Tuần thuyết trình dự kiến | Tuần 10 |

## 2. Công việc đã hoàn thành trong tuần

### 23127195 - Trần Mạnh Hùng

- Đọc Seminar Guide và topic brief của chủ đề T10 - Mutation Testing & Test Effectiveness.
- Chốt hướng kỹ thuật chính: dùng Stryker Mutator cho mutation testing trên JavaScript/TypeScript.
- Lên roadmap tổng thể từ tuần 6 đến tuần 10.
- Phân công vai trò chính cho từng thành viên trong nhóm.
- Chuẩn bị kế hoạch tuần 7 để setup và chạy Stryker trên backend EShop hoặc module demo tương đương.

Bằng chứng:

- `Group08_Seminar_T10_Detailed_Plan.md`
- `Tool_Survey_Proposal.md` hiện có
- `User_Guide.md` hiện có

### 23127060 - Ninh Văn Khải

- Đọc yêu cầu AI-Augmented của chủ đề seminar.
- Định nghĩa quy trình dùng ChatGPT/Claude bằng prompt:
  - dùng Stryker để tìm surviving mutants;
  - đưa code context và mutant diff cho AI;
  - yêu cầu AI gợi ý assertion/test case;
  - kiểm chứng mọi gợi ý bằng Jest/Stryker;
  - ghi lại prompt, phản hồi AI và phần chỉnh sửa của nhóm để phục vụ AI Audit.
- Lên kế hoạch cho phần phân tích mutant và kiểm chứng AI ở tuần 8.
- Chuẩn bị các nhóm bằng chứng cần lưu cho AI Audit pack.

Bằng chứng:

- Phần AI workflow trong `Group08_Seminar_T10_Detailed_Plan.md`
- Phần AI Usage Declaration trong báo cáo tuần này

### 23127259 - Nguyễn Tấn Thắng

- Đọc yêu cầu nộp weekly report trên Moodle.
- Chuẩn bị cấu trúc báo cáo hằng tuần cho Nhóm 08.
- Xác định các file bắt buộc trong mỗi lần nộp:
  - `Group08.md`
  - `Group08.pdf`
  - các file bằng chứng bổ sung nếu có
- Lên kế hoạch cho phần tài liệu, screencast, slide và đóng gói weekly report trong các tuần tiếp theo.

Bằng chứng:

- `Group08_06.md`
- Checklist đầu ra trong `Group08_Seminar_T10_Detailed_Plan.md`

## 3. Phụ lục - AI Usage Notes

Nhóm có sử dụng AI trong tuần này, vì vậy nhóm khai báo theo mục "AI Usage Notes" trong AI Usage Guidelines. AI chỉ được dùng để hỗ trợ đọc yêu cầu, tổ chức kế hoạch, gợi ý cấu trúc báo cáo và giải thích workflow. Nhóm không dùng AI để tạo kết quả thí nghiệm giả, không dùng AI để thay thế việc chạy Stryker/Jest, và không xem AI là nguồn học thuật chính thức.

### 23127195 - Trần Mạnh Hùng

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI, dùng trong ứng dụng Codex desktop |
| Thời gian truy cập | 2026-07-03, khoảng 20:05-20:45 |
| Prompt đã dùng | "hãy đọc nội dung của các file này thật kỹ đi"; "đọc luôn 2 file này đi"; "lên plan kế hoạch cần nộp những gì làm gì, phân công cho ai làm gì chi tiết nhất để tuần 10 nhóm tôi thực hiện thuyết trình" |
| Mục đích sử dụng | Đọc Seminar Guide, T10 brief, Tool_Survey_Proposal.md và User_Guide.md; lập kế hoạch tổng thể từ tuần 6 đến tuần 11; chia milestone và đầu ra từng tuần |
| Nội dung AI hỗ trợ tạo | Bản nháp kế hoạch chi tiết, bảng deliverables, timeline, risk management và checklist trước tuần 10 |
| Phần tự làm / kiểm chứng | Hùng kiểm tra lại nội dung dựa trên tài liệu seminar đã cung cấp, xác nhận thông tin nhóm, MSSV, chủ đề T10 và yêu cầu thuyết trình tuần 10; các kết quả kỹ thuật về Stryker sẽ được kiểm chứng bằng chạy thật trong tuần 7-8 |
| Bằng chứng | Lịch sử chat trong Codex; file `Group08_Seminar_T10_Detailed_Plan.md`; file báo cáo tuần này |

### 23127060 - Ninh Văn Khải

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI, dùng trong ứng dụng Codex desktop |
| Thời gian truy cập | 2026-07-03, khoảng 20:15-20:45 |
| Prompt đã dùng | "ChatGPT/Claude prompt-based workflow là gì"; "ví dụ đi chưa hiểu lắm"; yêu cầu lập kế hoạch cho phần AI-Augmented trong seminar |
| Mục đích sử dụng | Làm rõ cách dùng ChatGPT/Claude để phân tích surviving mutant, gợi ý assertion và kiểm chứng bằng Stryker/Jest |
| Nội dung AI hỗ trợ tạo | Giải thích workflow Stryker -> AI gợi ý test -> chạy lại Stryker; ví dụ boundary mutant `>=` thành `>`; kế hoạch lưu prompt log và audit kết quả AI |
| Phần tự làm / kiểm chứng | Khải sẽ tự chọn mutants thật từ report tuần 7, tự chạy hoặc phối hợp chạy Jest/Stryker để xác nhận gợi ý AI đúng hay sai; mọi prompt và phản hồi AI sẽ được lưu để dùng cho AI-02 |
| Bằng chứng | Lịch sử chat trong Codex; phần AI workflow trong kế hoạch chi tiết; prompt log sẽ bổ sung ở tuần 8 |

### 23127259 - Nguyễn Tấn Thắng

| Yêu cầu | Nội dung khai báo |
|---|---|
| Công cụ, phiên bản, nền tảng | Codex/ChatGPT, GPT-5, OpenAI, dùng trong ứng dụng Codex desktop |
| Thời gian truy cập | 2026-07-03, khoảng 20:25-20:50 |
| Prompt đã dùng | Yêu cầu tạo weekly report theo format Moodle; yêu cầu "viết tiếng Việt hết"; yêu cầu đọc AI Usage Guidelines và viết đúng phần khai báo AI |
| Mục đích sử dụng | Tạo cấu trúc báo cáo tuần, chuyển nội dung sang tiếng Việt, xuất PDF, đóng gói ZIP đúng yêu cầu Moodle |
| Nội dung AI hỗ trợ tạo | Bản nháp `Group08_06.md`, bản PDF `Group08.pdf`, file ZIP `Group08_06.zip`, và phần AI Usage Notes theo từng thành viên |
| Phần tự làm / kiểm chứng | Thắng sẽ kiểm tra lại format trước khi nộp Moodle, đối chiếu tên file ZIP, kiểm tra nội dung PDF và bổ sung ảnh chụp/chat history nếu giảng viên yêu cầu |
| Bằng chứng | File `Group08.md`, `Group08.pdf`, `Group08_06.zip`; lịch sử chat trong Codex |

Link biểu mẫu AI Disclosure:
https://drive.google.com/file/d/1l6bO6fog1eM6K4_10oMshg5GawmEkr_o/view?usp=sharing

## 4. Công việc dự kiến cho tuần sau

### 23127195 - Trần Mạnh Hùng

- Setup môi trường backend EShop hoặc module demo tương đương.
- Cài Stryker Mutator và các plugin cần thiết.
- Tạo hoặc chỉnh file `stryker.config.mjs`.
- Chạy baseline mutation test đầu tiên trên một module nhỏ.
- Lưu HTML report và command log làm bằng chứng.

### 23127060 - Ninh Văn Khải

- Đọc baseline mutation report.
- Xác định và phân loại ít nhất 5 surviving mutants.
- Chuẩn bị bảng gồm file, dòng, mutation operator, code gốc, code mutant và lý do mutant survived.
- Chọn 3 mutants phù hợp để dùng trong demo cuối.

### 23127259 - Nguyễn Tấn Thắng

- Ghi lại các bước cài đặt và lỗi gặp phải vào `User_Guide.md`.
- Chụp màn hình quá trình setup và Stryker report.
- Chuẩn bị weekly report tuần 7.
- Bắt đầu viết outline cho screencast.

## 5. Vấn đề phát sinh

| Vấn đề | Trạng thái | Cách xử lý / bước tiếp theo |
|---|---|---|
| Một số tài liệu hiện tại còn placeholder như MSSV, tên thành viên, ngày nộp | Chưa xử lý xong | Thay toàn bộ placeholder trước khi nộp chính thức |
| Một số claim về phiên bản AI/model và nghiên cứu cần kiểm chứng | Chưa xử lý xong | Đối chiếu nguồn chính thức hoặc bỏ claim quá cụ thể nếu không kiểm chứng được |
| Chưa chốt module EShop cụ thể để demo | Chưa xử lý xong | Tuần 7 chọn một module business logic nhỏ, ưu tiên checkout/order |
| Mutation testing có thể chạy lâu nếu áp dụng toàn backend | Đã có hướng xử lý | Giới hạn Stryker vào một module nhỏ và chuẩn bị report backup |

## 6. File bổ sung

- `Group08_Seminar_T10_Detailed_Plan.md`
- `Tool_Survey_Proposal.md`
- `User_Guide.md`
