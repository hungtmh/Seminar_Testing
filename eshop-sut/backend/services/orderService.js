/**
 * Service placeholder for Cart + Coupon + Checkout/Order.
 *
 * Owner: 23127060 - Ninh Van Khai
 *
 * Move the real logic from server.js into this file step by step, then update
 * the matching routes to call these handlers. Keep tests focused on the real
 * EShop API flow with Jest + Supertest.
 */

function getCart(_db, _userCarts) {
  throw new Error("TODO: move GET /api/cart logic from server.js");
}

function addToCart(_db, _userCarts) {
  throw new Error("TODO: move POST /api/cart logic from server.js");
}

function checkout(_db, _userCarts) {
  throw new Error("TODO: move POST /api/checkout logic from server.js");
}

function getMyOrders(_db) {
  throw new Error("TODO: move GET /api/orders/my-orders logic from server.js");
}

function cancelOrder(_db) {
  throw new Error("TODO: move PUT /api/orders/:id/cancel logic from server.js");
}

function getOrderById(_db) {
  throw new Error("TODO: move GET /api/orders/:id logic from server.js");
}

function applyCoupon(_db) {
  throw new Error("TODO: move POST /api/apply-coupon logic from server.js");
}

function saveCouponUsage(_db) {
  throw new Error("TODO: move POST /api/coupon-usage logic from server.js");
}

module.exports = {
  getCart,
  addToCart,
  checkout,
  getMyOrders,
  cancelOrder,
  getOrderById,
  applyCoupon,
  saveCouponUsage,
};
