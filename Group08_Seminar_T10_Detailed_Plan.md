# Nhóm 8 - Kế hoạch chi tiết Seminar T10

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Mã nhóm | Nhóm 8 |
| Chủ đề | T10 - Mutation Testing & Test Effectiveness |
| Môn học | CS423 / CSC15003 - Kiểm thử phần mềm |
| Công cụ truyền thống chính | Stryker Mutator cho JavaScript/TypeScript |
| Hướng AI-Augmented | Quy trình dùng ChatGPT/Claude bằng prompt để gợi ý assertion và phân tích equivalent mutant |
| Tuần thuyết trình dự kiến | Tuần 10 |
| Thời lượng seminar | 45 phút |
| Số thành viên | 3 |

## 2. Thành viên và vai trò chính

| MSSV | Họ tên | Vai trò chính |
|---|---|---|
| 23127195 | Trần Mạnh Hùng | Nhóm trưởng, phụ trách setup Stryker, demo live, tích hợp kết quả cuối |
| 23127060 | Ninh Văn Khải | Phụ trách AI workflow, phân tích mutant, thiết kế hoạt động lớp, chuẩn bị bằng chứng AI Audit |
| 23127259 | Nguyễn Tấn Thắng | Phụ trách User Guide, slide, screencast, đóng gói báo cáo hằng tuần |

## 3. Các sản phẩm cần nộp

| Sản phẩm | Giai đoạn | Người phụ trách | Hỗ trợ | Kết quả cần có |
|---|---|---|---|---|
| Tool_Survey_Proposal.md | S1 | Hùng | Khải, Thắng | Đề xuất 1 trang, có so sánh công cụ, lựa chọn chính, AI disclosure |
| Báo cáo hằng tuần | Mỗi tuần | Thắng | Hùng, Khải | File Group08_YY.zip gồm Group08.md, Group08.pdf và bằng chứng |
| Cài đặt Stryker chạy được | S3 | Hùng | Thắng | Stryker cài được và chạy được trên backend EShop hoặc module demo |
| Báo cáo mutation baseline | S3 | Hùng | Khải | HTML report và bảng số liệu killed, survived, timeout, noCoverage |
| Phân tích surviving mutants | S3-S4 | Khải | Hùng | Ít nhất 3 surviving mutants thật, giải thích vì sao sống sót |
| Quy trình AI hỗ trợ viết assertion | S4 | Khải | Hùng | Prompt, phản hồi AI, test đã kiểm chứng, mutation score trước/sau |
| User_Guide.md | S4 | Thắng | Hùng, Khải | Tối thiểu 6 mục: cài đặt, first test, nâng cao, troubleshooting, failure modes, references |
| Demo_Screencast.mp4 | S4 | Thắng | Hùng | Video 5-8 phút, thuyết minh tiếng Anh, dung lượng <= 100 MB |
| Activity_Worksheet.md | S5 | Khải | Thắng | Worksheet 25 phút cho hoạt động Kill the Mutant, kèm đáp án |
| Seminar_Slides.pptx | S6 | Thắng | Hùng, Khải | Tối đa 15 slide, tập trung vào pitch, demo, activity và kết quả |
| Buổi seminar trực tiếp | S6 | Cả nhóm | Cả nhóm | 10 phút pitch, 10 phút demo, 20 phút activity, 5 phút Q&A |
| Bộ AI Audit: AI-02, AI-03, AI-04 | S8 | Khải | Hùng, Thắng | Báo cáo audit, disclosure có chữ ký, reflection 300 từ |
| Final_Reflection.md | S8 | Hùng | Khải, Thắng | Reflection 300 từ bằng tiếng Anh |

## 4. Timeline tổng thể

| Tuần | Khoảng ngày | Mục tiêu chính | Milestone đầu ra |
|---|---|---|---|
| Tuần 6 | 2026-06-29 - 2026-07-04 | Lên kế hoạch và chốt hướng làm | Kế hoạch chi tiết, weekly report, phân công nhiệm vụ |
| Tuần 7 | 2026-07-06 - 2026-07-11 | Cài Stryker và chạy baseline | Config Stryker, mutation report đầu tiên, ghi chú setup |
| Tuần 8 | 2026-07-13 - 2026-07-18 | Phân tích mutant và thử AI workflow | 3-5 mutants được phân tích, prompt AI, mutation score cải thiện |
| Tuần 9 | 2026-07-20 - 2026-07-25 | Hoàn thiện guide, screencast, activity, slide | User guide, worksheet, video demo, slide nháp |
| Tuần 10 | 2026-07-27 - 2026-08-01 | Rehearsal và thuyết trình | Slide cuối, demo backup, seminar trực tiếp, feedback |
| Tuần 11 | 2026-08-03 - 2026-08-08 | Nộp AI Audit và reflection | AI-02, AI-03, AI-04, Final_Reflection.md |

## 5. Kế hoạch tuần 6 - Tuần lên kế hoạch

### Mục tiêu

Chuẩn bị kế hoạch thực hiện chi tiết cho các tuần tiếp theo, đồng thời đảm bảo mỗi thành viên có phần việc rõ ràng.

### Milestone

- Chốt chủ đề: T10 - Mutation Testing & Test Effectiveness.
- Chốt công cụ: Stryker Mutator kết hợp ChatGPT/Claude.
- Chốt vai trò và trách nhiệm của từng thành viên.
- Chuẩn bị báo cáo tuần hiện tại để nộp Moodle.
- Rà soát Tool_Survey_Proposal.md và User_Guide.md để phát hiện placeholder hoặc claim cần kiểm chứng.

### Phân công

| Thành viên | Nhiệm vụ | Kết quả/bằng chứng |
|---|---|---|
| 23127195 - Trần Mạnh Hùng | Đọc Seminar Guide và T10 brief; xác định mục tiêu seminar; phân công vai trò; lên kế hoạch setup Stryker cho tuần 7 | File kế hoạch chi tiết; danh sách deliverables |
| 23127060 - Ninh Văn Khải | Đọc yêu cầu AI-Augmented; định nghĩa quy trình ChatGPT/Claude; chuẩn bị format ghi log prompt và kết quả AI | Phần AI workflow; checklist bằng chứng AI |
| 23127259 - Nguyễn Tấn Thắng | Đọc yêu cầu weekly report; chuẩn bị cấu trúc Markdown; liệt kê nội dung cần có trong ZIP nộp Moodle | Weekly report và checklist đóng gói |

### Đầu ra cuối tuần

- Group08_Seminar_T10_Detailed_Plan.md
- Group08_06.md
- Group08_06.pdf
- Group08_06.zip

## 6. Kế hoạch tuần 7 - Cài Stryker và chạy baseline

### Mục tiêu

Cài Stryker trên backend EShop hoặc module demo tương đương, chạy mutation testing với scope nhỏ và tạo báo cáo baseline đầu tiên.

### Milestone

- Cài Stryker thành công.
- Xác nhận Jest hoặc test runner hiện có chạy được.
- Tạo file stryker.config.mjs.
- Sinh được mutation report cho một module nhỏ, ưu tiên checkout/order/business logic.
- Lưu lại ít nhất 5 surviving mutants để phân tích.

### Phân công

| Thành viên | Nhiệm vụ | Kết quả/bằng chứng |
|---|---|---|
| 23127195 - Trần Mạnh Hùng | Setup backend EShop; cài package Stryker; tạo stryker.config.mjs; chạy baseline mutation test | Lệnh đã chạy, file config, thư mục report |
| 23127060 - Ninh Văn Khải | Đọc HTML report; phân loại mutant theo killed, survived, timeout, noCoverage; chọn 5 surviving mutants phù hợp | Bảng phân tích mutant gồm file, dòng, operator, trạng thái |
| 23127259 - Nguyễn Tấn Thắng | Ghi lại các bước cài đặt và lỗi gặp phải; cập nhật User_Guide.md mục 3 và 4; chuẩn bị report tuần 7 | Guide cập nhật, ảnh chụp màn hình, weekly report |

### Đầu ra cuối tuần

- Stryker chạy được.
- Có mutation score baseline.
- Có ảnh chụp hoặc HTML report làm bằng chứng.
- File nộp tuần 7: Group08_07.zip.

### Tiêu chí hoàn thành

- Ít nhất 2 thành viên có thể chạy lại Stryker.
- Baseline report có dữ liệu thật từ EShop hoặc module demo đã chọn.
- Nhóm giải thích được ý nghĩa killed, survived, timeout và noCoverage.

## 7. Kế hoạch tuần 8 - Phân tích mutant và thử AI workflow

### Mục tiêu

Dùng surviving mutants để cải thiện test bằng cách viết thủ công và dùng AI gợi ý, sau đó kiểm chứng lại bằng Stryker.

### Milestone

- Chọn 3 surviving mutants chính cho buổi seminar.
- Viết test thủ công để kill ít nhất 2 mutants.
- Dùng ChatGPT/Claude gợi ý assertion cho cùng mutant hoặc mutant tương tự.
- So sánh test thủ công với test do AI gợi ý.
- Tìm hoặc phân tích ít nhất 1 trường hợp có khả năng là equivalent mutant.

### Phân công

| Thành viên | Nhiệm vụ | Kết quả/bằng chứng |
|---|---|---|
| 23127195 - Trần Mạnh Hùng | Viết thêm Jest tests cho mutants đã chọn; chạy lại Stryker; ghi mutation score trước/sau | File test, report trước/sau |
| 23127060 - Ninh Văn Khải | Thiết kế prompt cho ChatGPT/Claude; yêu cầu AI giải thích mutant và gợi ý assertion; audit kết quả AI | Prompt log, bảng phản hồi AI, kết quả đúng/sai sau khi chạy |
| 23127259 - Nguyễn Tấn Thắng | Cập nhật User_Guide.md mục 5, 6, 7; viết failure modes và giải thích equivalent mutant | Guide cập nhật, bảng failure modes, report tuần 8 |

### Đầu ra cuối tuần

- 3 surviving mutants được phân tích rõ.
- Ít nhất 3 test hoặc assertion mới.
- Bảng mutation score trước/sau.
- Prompt log và ghi chú audit AI.
- File nộp tuần 8: Group08_08.zip.

### Tiêu chí hoàn thành

- Mọi test do AI gợi ý đều phải được chạy thật.
- Nhóm ghi nhận cả gợi ý AI sai, không chỉ ghi kết quả tốt.
- Demo có câu chuyện rõ: coverage không đủ, mutation score cho thấy assertion yếu.

## 8. Kế hoạch tuần 9 - Hoàn thiện tài liệu, video, activity và slide

### Mục tiêu

Chuẩn bị đầy đủ tài liệu trước seminar và chia sẻ cho lớp ít nhất 3 ngày làm việc trước buổi thuyết trình.

### Milestone

- Hoàn thiện bản nháp cuối của User_Guide.md.
- Quay Demo_Screencast.mp4 bằng tiếng Anh, 5-8 phút.
- Hoàn thiện Activity_Worksheet.md và đáp án.
- Hoàn thiện slide nháp, tối đa 15 slide.
- Chuẩn bị video backup nếu demo live gặp lỗi.

### Phân công

| Thành viên | Nhiệm vụ | Kết quả/bằng chứng |
|---|---|---|
| 23127195 - Trần Mạnh Hùng | Chuẩn bị demo script; tạo môi trường backup; kiểm tra toàn bộ lệnh demo | Demo script, checklist command, backup recording |
| 23127060 - Ninh Văn Khải | Viết Activity_Worksheet.md cho trò Kill the Mutant; chuẩn bị 5 mutants và đáp án; thiết kế bảng điểm | Worksheet, solution file, scoring table |
| 23127259 - Nguyễn Tấn Thắng | Hoàn thiện User_Guide.md; làm Seminar_Slides.pptx; quay và nén screencast | Guide cuối, slide nháp, Demo_Screencast.mp4 |

### Đầu ra cuối tuần

- User_Guide.md
- Demo_Screencast.mp4
- Activity_Worksheet.md
- Seminar_Slides.pptx bản nháp
- File nộp tuần 9: Group08_09.zip

### Tiêu chí hoàn thành

- Screencast dài 5-8 phút và dung lượng <= 100 MB.
- Worksheet hoàn thành trong <= 25 phút mà không cần nhóm hỗ trợ quá nhiều.
- Slide tối đa 15 trang và không thay thế phần activity.
- Tài liệu được upload lên Moodle ít nhất 3 ngày làm việc trước seminar.

## 9. Kế hoạch tuần 10 - Rehearsal và thuyết trình

### Mục tiêu

Thực hiện seminar 45 phút trơn tru, có demo thật trên EShop/module demo, có hoạt động lớp và trả lời Q&A rõ ràng.

### Milestone

- Rehearsal ít nhất 2 lần.
- Kiểm tra slide cuối.
- Kiểm tra demo trên máy dùng để thuyết trình.
- In hoặc chia sẻ worksheet cho audience.
- Thu feedback/minute paper từ audience.

### Cấu trúc buổi seminar

| Thời gian | Phần | Người phụ trách | Nội dung |
|---|---|---|---|
| 0:00-0:10 | Pitch | Thắng | Vì sao coverage có thể đánh lừa; mutation testing đo gì; vì sao chọn Stryker + AI |
| 0:10-0:20 | Live demo | Hùng | Chạy test, mở Stryker report, giải thích surviving mutant, thêm assertion và kiểm chứng |
| 0:20-0:40 | Audience activity | Khải | Điều phối trò Kill the Mutant, hỗ trợ nhóm khác, chấm điểm |
| 0:40-0:45 | Debrief và Q&A | Cả nhóm | Tóm tắt bài học, trả lời câu hỏi, nhấn mạnh failure modes và giới hạn của AI |

### Phân công

| Thành viên | Nhiệm vụ | Kết quả/bằng chứng |
|---|---|---|
| 23127195 - Trần Mạnh Hùng | Lead live demo; chuẩn bị lệnh backup; trả lời câu hỏi kỹ thuật về Stryker; lưu report cuối | Demo script cuối, ảnh report, ghi chú demo |
| 23127060 - Ninh Văn Khải | Điều phối activity; quản lý điểm; trả lời câu hỏi về AI workflow và equivalent mutant | Worksheet đã làm, bảng điểm, ghi chú Q&A |
| 23127259 - Nguyễn Tấn Thắng | Trình bày intro/pitch; điều khiển slide; quản lý thời gian; thu minute paper | Slide cuối, bằng chứng attendance/activity, feedback |

### Đầu ra cuối tuần

- Seminar_Slides.pptx bản cuối.
- Hoàn thành live demo.
- Hoàn thành audience activity.
- Thu feedback/minute paper.
- File nộp tuần 10: Group08_10.zip.

### Tiêu chí hoàn thành

- Demo có ít nhất 1 tính năng truyền thống của Stryker và 1 phần AI hỗ trợ.
- Activity hoàn thành trong 20-25 phút.
- Cả 3 thành viên đều có phần trình bày hoặc điều phối rõ ràng.
- Nhóm giải thích được vì sao gợi ý của AI phải được kiểm chứng bằng Jest/Stryker.

## 10. Kế hoạch tuần 11 - AI Audit và Reflection

### Mục tiêu

Nộp đầy đủ AI Audit, disclosure, reflection và các tài liệu sau seminar.

### Milestone

- Hoàn thành AI-02 Audit Report, tối thiểu 5 mục và >= 600 từ.
- Hoàn thành AI-03 Disclosure có chữ ký từng thành viên.
- Hoàn thành AI-04 Reflective Statement, 300 từ.
- Hoàn thành Final_Reflection.md.
- Theo dõi peer review nếu được phân công.

### Phân công

| Thành viên | Nhiệm vụ | Kết quả/bằng chứng |
|---|---|---|
| 23127195 - Trần Mạnh Hùng | Viết final reflection; tổng kết kết quả demo và bài học; rà soát toàn bộ hồ sơ nộp | Final_Reflection.md, checklist nộp bài |
| 23127060 - Ninh Văn Khải | Hoàn thành AI-02 và bảng bằng chứng AI; chuẩn bị nội dung AI-03 để ký | AI-02, prompt logs, AI-03 signed PDFs |
| 23127259 - Nguyễn Tấn Thắng | Hoàn thành AI-04; đóng gói file cuối; chuẩn bị weekly report tuần 11 | AI-04, file ZIP cuối, weekly report |

### Đầu ra cuối tuần

- AI-02 Audit Report.
- AI-03 signed disclosure PDFs.
- AI-04 Reflective Statement.
- Final_Reflection.md.
- File nộp tuần 11: Group08_11.zip.

## 11. Checklist báo cáo hằng tuần

Mỗi tuần nộp một file ZIP lên Moodle theo tên:

```text
Group08_YY.zip
```

Trong ZIP nên có ít nhất:

```text
Group08.md
Group08.pdf
Evidence/
```

Các bằng chứng nên đính kèm:

- Ảnh chụp Stryker report.
- File stryker.config.mjs.
- File test đã thêm trong tuần.
- Prompt log và tóm tắt phản hồi AI.
- Slide, worksheet hoặc bản nháp guide.
- Meeting notes hoặc ảnh task board.

## 12. Quản lý rủi ro

| Rủi ro | Ảnh hưởng | Người theo dõi | Cách xử lý |
|---|---|---|---|
| Stryker chạy quá lâu trên toàn bộ backend | Demo không kịp thời gian | Hùng | Giới hạn scope vào 1 module, chuẩn bị sẵn HTML report |
| AI gợi ý test sai hoặc dùng API không tồn tại | Guide/demo sai | Khải | Cung cấp context thật, chạy mọi gợi ý, ghi cả output sai |
| Screencast vượt 100 MB | Khó nộp Moodle | Thắng | Quay 5-8 phút, nén video, tránh bitrate quá cao |
| Demo live lỗi vì môi trường hoặc mạng | Giảm chất lượng seminar | Hùng | Có backup recording, report local, command transcript |
| Activity quá khó với audience | Không hoàn thành trong 25 phút | Khải | Dùng 5 mutants nhỏ, hàm đơn giản, có answer key |
| Slide quá dài | Vi phạm yêu cầu seminar | Thắng | Giữ tối đa 15 slide, ưu tiên demo và activity |

## 13. Definition of Done trước tuần 10

- Tool_Survey_Proposal.md đã cập nhật và được duyệt.
- User_Guide.md đủ mục, không còn placeholder.
- Stryker chạy được trên module đã chọn.
- Có baseline report và improved report.
- Có ít nhất 3 surviving mutants được giải thích rõ.
- Có AI prompt logs và kết quả đã kiểm chứng.
- Activity worksheet và answer key sẵn sàng.
- Screencast dài 5-8 phút và <= 100 MB.
- Slide tối đa 15 trang.
- Cả 3 thành viên đã rehearsal phần của mình.
- Demo backup đã sẵn sàng.
