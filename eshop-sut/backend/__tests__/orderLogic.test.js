const {
  calculateOrderSummary,
  calculateDiscount,
  calculateShippingFee,
} = require("../business/orderLogic");

describe("order checkout business logic", () => {
  test("calculates subtotal, tax, shipping and total for a normal order", () => {
    const summary = calculateOrderSummary([
      { price: 100000, quantity: 2 },
      { price: 50000, quantity: 1 },
    ]);

    expect(summary).toEqual({
      subtotal: 250000,
      discount: 0,
      shippingFee: 30000,
      tax: 20000,
      total: 300000,
    });
  });

  test("applies SAVE10 coupon before tax", () => {
    const summary = calculateOrderSummary(
      [{ price: 200000, quantity: 2 }],
      { couponCode: "SAVE10" },
    );

    expect(summary.discount).toBe(40000);
    expect(summary.total).toBe(418800);
  });

  test("uses free standard shipping for high-value orders", () => {
    expect(calculateShippingFee(500000, "standard")).toBe(0);
  });

  test("rejects empty carts", () => {
    expect(() => calculateOrderSummary([])).toThrow(
      "Cart must contain at least one item",
    );
  });

  test("rejects invalid quantity", () => {
    expect(() => calculateOrderSummary([{ price: 100000, quantity: 0 }])).toThrow(
      "Item quantity must be greater than zero",
    );
  });

  test("returns zero discount for unknown coupon", () => {
    expect(calculateDiscount(300000, "WELCOME")).toBe(0);
  });
});
