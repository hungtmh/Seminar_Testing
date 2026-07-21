# Báo Cáo Khắc Phục Sự Cố StrykerJS & SQLite

## Tổng Quan Vấn Đề
Dự án sử dụng SQLite làm cơ sở dữ liệu và StrykerJS để chạy mutation testing. Khi chạy StrykerJS cho module `auth`, xuất hiện hai sự cố chính:
1. **Lỗi Crash Cơ Sở Dữ Liệu (`0xC0000005` access violation & `SQLITE_BUSY`)**: Mặc dù đã dùng `process.env.JEST_WORKER_ID` để chuyển sang SQLite `:memory:`, các worker của Stryker thỉnh thoảng vẫn crash.
2. **Lỗi Không Tìm Thấy Test (`No tests were found`)**: Stryker tìm thấy file cấu hình nhưng Jest báo không tìm thấy test nào để chạy.

---

## Phân Tích Nguyên Nhân & Giải Pháp

### 1. Khắc Phục Lỗi Crash SQLite (`database.js`)
**Nguyên nhân:** 
Ban đầu `database.js` kiểm tra `process.env.JEST_WORKER_ID` để chọn in-memory DB. Tuy nhiên, ở giai đoạn Dry Run ban đầu của Stryker (Initial test run), Stryker chạy Jest in-band, do đó biến `JEST_WORKER_ID` **không tồn tại**. Hệ quả là nhiều sandbox chạy song song cùng truy cập và thực hiện thao tác DROP/CREATE trên cùng một file vật lý `database.sqlite` (do Stryker đôi khi dùng symlink trên Windows). Điều này dẫn đến conflict `SQLITE_BUSY` và gây segfault ở C++ SQLite driver (`0xC0000005`).

**Giải pháp:** 
Bổ sung thêm kiểm tra thư mục sandbox của Stryker (`.stryker-tmp`). 
```javascript
const isStryker = __dirname.includes('.stryker-tmp') || process.env.JEST_WORKER_ID;
const dbPath = isStryker ? ':memory:' : path.resolve(__dirname, 'database.sqlite');
```
Điều này đảm bảo rằng bất kể là Jest tự chạy qua worker hay Stryker chạy dry-run, hễ mã nguồn được thực thi trong sandbox của Stryker, nó luôn sử dụng cơ sở dữ liệu in-memory độc lập.

### 2. Khắc Phục Lỗi "No tests were found"
**Nguyên nhân:** 
Khi dùng thuộc tính `testFiles` trong file cấu hình `stryker.auth.config.mjs` kết hợp với `jest: { enableFindRelatedTests: false }`, Stryker truyền trực tiếp đường dẫn tuyệt đối của file test (bên trong sandbox) cho Jest. Tuy nhiên, `jest.auth.config.cjs` lại sử dụng `rootDir` và `roots`, khiến Jest không match được file theo cơ chế glob.

**Giải pháp:**
Đồng bộ cấu hình của cả 3 module (`auth`, `order`, `product`) theo một chuẩn chung hoạt động ổn định trong Stryker:
1. **Trong `jest.auth.config.cjs` và `jest.product.config.cjs`**: Loại bỏ sự phụ thuộc vào đường dẫn tuyệt đối, chỉ định đúng `testMatch` theo tên file.
   ```javascript
   module.exports = {
     rootDir: __dirname,
     roots: ["<rootDir>/__tests__"], // hoặc "tests" tùy thư mục
     testMatch: ["**/auth.api.test.js"],
     testEnvironment: "node",
   };
   ```
2. **Trong `stryker.auth.config.mjs` và `stryker.product.config.mjs`**: Loại bỏ thuộc tính `testFiles` và sử dụng hoàn toàn `enableFindRelatedTests: false`. Điều này yêu cầu Jest tự tìm test dựa trên `testMatch` thay vì bị Stryker chèn ép truyền danh sách file tuyệt đối.
   ```javascript
   jest: {
     configFile: "jest.auth.config.cjs",
     enableFindRelatedTests: false,
   }
   ```

---

## Kết Quả Đạt Được
- `npm run mutation:order`: Hoạt động ổn định (Score ~92.57%).
- `npm run mutation:auth`: Khắc phục hoàn toàn lỗi crash SQLite. Kết quả (Killed 80, Survived 11) với mutation score xuất sắc ~87.16%.
- `npm run mutation:product`: Fix thành công lỗi "No tests were found" và test chạy ổn định.
- Production behavior (chạy `node server.js` ngoài môi trường test) được bảo toàn nguyên vẹn, ứng dụng vẫn sử dụng file `database.sqlite` thật.
