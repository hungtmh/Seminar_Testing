export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  mutate: ["services/orderService.js"],
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
