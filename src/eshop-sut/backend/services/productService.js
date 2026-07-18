/**
 * Service placeholder for Products + Admin APIs + Import/Order Status.
 *
 * Owner: 23127259 - Nguyen Tan Thang
 *
 * Move the real logic from server.js into this file step by step, then update
 * the matching routes to call these handlers. Keep tests focused on the real
 * EShop API flow with Jest + Supertest.
 */

function listProducts(_db) {
  throw new Error("TODO: move GET /api/products logic from server.js");
}

function getProductById(_db) {
  throw new Error("TODO: move GET /api/products/:id logic from server.js");
}

function createProduct(_db) {
  throw new Error("TODO: move POST /api/products logic from server.js");
}

function updateProduct(_db) {
  throw new Error("TODO: move PUT /api/products/:id logic from server.js");
}

function deleteProduct(_db) {
  throw new Error("TODO: move DELETE /api/products/:id logic from server.js");
}

function importProducts(_db) {
  throw new Error("TODO: move POST /api/admin/import-products logic from server.js");
}

function listAdminOrders(_db) {
  throw new Error("TODO: move GET /api/admin/orders logic from server.js");
}

function updateAdminOrderStatus(_db) {
  throw new Error("TODO: move PUT /api/admin/orders/:id/status logic from server.js");
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  listAdminOrders,
  updateAdminOrderStatus,
};
