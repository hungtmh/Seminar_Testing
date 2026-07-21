// Jest config dành riêng cho auth mutation testing.
//
// QUAN TRỌNG: Dùng __dirname (không phải CWD) để anchor rootDir,
// vì Stryker chạy test từ .stryker-tmp/ sandbox → relative path sẽ sai.
// Pattern này đã được chứng minh hoạt động ở jest.order.config.cjs.
//
// roots + testMatch kết hợp để đảm bảo:
//   1. Chỉ quét thư mục __tests__/ (bỏ qua tests/)
//   2. Chỉ chạy đúng 1 file auth.api.test.js
module.exports = {
  rootDir: __dirname,
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/auth.api.test.js"],
  testEnvironment: "node",
};
