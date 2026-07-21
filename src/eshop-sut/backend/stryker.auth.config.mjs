/**
 * Mutation baseline for the real EShop authentication/user APIs.
 *
 * This config mutates the real Auth/User service used by server.js routes.
 *
 * Fixes applied:
 *  - testFiles: scope Stryker to ONLY auth test (was loading all 73 tests).
 *  - jest.configFile: use dedicated jest.auth.config.cjs to avoid picking up
 *    product/order tests whose workers race on database.sqlite.
 *  - jest.enableFindRelatedTests: false → prevent Stryker from auto-expanding
 *    the test set via --findRelatedTests.
 *  - ignoreStatic: true → drop 37 static mutants (top-level SECRET_KEY, etc.)
 *    that cannot be tracked per-test and caused worker crashes.
 *  - htmlReporter.fileName: dedicated output, does not overwrite other reports.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation-auth/mutation.html",
  },
  mutate: ["services/authService.js"],
  jest: {
    projectType: "custom",
    configFile: "jest.auth.config.cjs",
    enableFindRelatedTests: false,
  },
  // Drop top-level static mutants that cannot be mapped per-test
  ignoreStatic: true,
  coverageAnalysis: "perTest",
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
  timeoutMS: 10000,
};
