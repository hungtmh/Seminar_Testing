export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation-order/mutation.html",
  },
  mutate: ["services/orderService.js"],
  jest: {
    configFile: "jest.order.config.cjs",
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
