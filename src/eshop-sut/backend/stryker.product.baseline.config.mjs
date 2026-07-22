/**
 * Baseline mutation configuration for Products + Admin APIs + Import/Order Status.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation-product-baseline/mutation.html",
  },
  mutate: ["services/productService.js"],
  jest: {
    configFile: "jest.product.baseline.config.cjs",
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
