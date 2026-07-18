/**
 * Mutation configuration for Cart + Coupon + Checkout/Order APIs.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation-order/mutation.html",
  },
  mutate: ["services/orderService.js"],
  jest: {
    enableFindRelatedTests: false,
  },
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
