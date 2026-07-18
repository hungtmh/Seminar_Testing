/**
 * Baseline mutation configuration for Cart + Coupon + Checkout/Order APIs.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation-order-baseline/mutation.html",
  },
  mutate: ["services/orderService.js"],
  testFiles: ["tests/orders.api.baseline.test.js"],
  jest: {
    configFile: "jest.order.baseline.config.cjs",
  },
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
