// Jest config cho module Order (bản improved).
// Ep rootDir ve dung thu muc chua file config (backend/) va dung glob theo
// ten file -> chac chan Stryker/Jest tim thay test du chay o moi truong nao.
module.exports = {
  rootDir: __dirname,
  roots: ["<rootDir>/tests"],
  testMatch: ["**/orders.api.test.js"],
  testEnvironment: "node",
};
