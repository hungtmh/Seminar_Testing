function calculateOrderSummary(cartItems, options = {}) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Cart must contain at least one item");
  }

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item || item.quantity <= 0) {
      throw new Error("Item quantity must be greater than zero");
    }
    if (item.price < 0) {
      throw new Error("Item price cannot be negative");
    }
    return sum + item.price * item.quantity;
  }, 0);

  const discount = calculateDiscount(subtotal, options.couponCode);
  const shippingFee = calculateShippingFee(subtotal, options.shippingMethod);
  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = roundMoney(taxableAmount * 0.08);
  const total = roundMoney(taxableAmount + shippingFee + tax);

  return {
    subtotal: roundMoney(subtotal),
    discount,
    shippingFee,
    tax,
    total,
  };
}

function calculateDiscount(subtotal, couponCode) {
  if (couponCode === "SAVE10") {
    return roundMoney(subtotal * 0.1);
  }
  if (couponCode === "FREESHIP" || !couponCode) {
    return 0;
  }
  return 0;
}

function calculateShippingFee(subtotal, shippingMethod = "standard") {
  if (shippingMethod === "express") {
    return 45000;
  }
  if (subtotal >= 500000) {
    return 0;
  }
  return 30000;
}

function roundMoney(value) {
  return Math.round(value);
}

module.exports = {
  calculateOrderSummary,
  calculateDiscount,
  calculateShippingFee,
  roundMoney,
};
