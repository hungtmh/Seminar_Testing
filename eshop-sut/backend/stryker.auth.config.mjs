/**
 * Mutation baseline for the real EShop authentication/user APIs.
 *
 * This config mutates the real Auth/User service used by server.js routes.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  mutate: ["services/authService.js"],
  coverageAnalysis: "perTest",
  maxConcurrentTestRunners: 1,
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
