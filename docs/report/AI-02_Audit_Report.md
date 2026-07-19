# AI-02: AI Audit Report

**Seminar Topic:** T10 - Mutation Testing & Test Effectiveness  
**Auditor:** 23127060 - Ninh Văn Khải (Team 8)  
**Word Count:** ~650 words

## 1. Context and Artefact Description

As part of the T10 Seminar on Mutation Testing, our team utilized Stryker Mutator on the EShop backend project, specifically targeting the `orderService.js` module. During the baseline run, several mutants survived because the original Jest test suite only asserted HTTP 200 status codes without verifying the response payload. To improve our mutation score, I used a Large Language Model (ChatGPT/Claude) to generate specific Jest assertions aimed at killing these surviving mutants (e.g., Array initialization mutations and Coupon usage boundary mutations).

The artefact being audited in this report consists of the AI-generated explanations and the proposed Jest test assertions provided by the AI during our prompting sessions (documented in `ai_trace_nvk.md`). While the AI significantly accelerated the process of identifying why mutants survived, a critical audit reveals several flaws in its output, ranging from technical inaccuracies to silent environmental assumptions.

## 2. (a) Factual Errors in AI Output

The most prominent factual error occurred when the AI attempted to write an assertion for the shopping cart mutation. The original code `if (!userCarts[userId]) userCarts[userId] = [];` was mutated to initialize with a dummy string. The AI correctly identified that we needed to assert the cart was empty. However, it initially suggested the following JavaScript assertion:
`expect(res.body).toBe([]);`

This is a fundamental factual error in JavaScript testing. The `.toBe()` matcher in Jest uses `Object.is` for exact equality. Since arrays are reference types in JavaScript, comparing the response array to a newly instantiated empty array `[]` will always fail, causing a false positive test failure. The AI failed to recognize this language-specific nuance. A human auditor had to correct this factual error by replacing it with `expect(res.body).toEqual([])` (which checks deep equality) or `expect(res.body.length).toBe(0)`.

## 3. (b) Missing Edge Cases

When auditing the AI's solution for the coupon usage boundary mutant (`usage_count >= max_uses` mutated to `>`), the AI successfully provided a test case that hit the exact boundary value. It instructed us to set the usage count to the maximum allowed and attempt to apply the coupon again.

However, the AI completely missed critical concurrent edge cases (Race Conditions). In a real-world EShop environment, two API requests might attempt to apply the same coupon at the exact same millisecond. The AI's generated assertion assumes a perfectly synchronous, single-threaded execution context where tests run in absolute isolation. It did not suggest wrapping the test in a `Promise.all()` to simulate concurrent requests, which is a common vector for bugs in boundary conditions. By missing this edge case, the AI's test kills the simple mutant but leaves the system vulnerable to real-world race conditions.

## 4. (c) Silent Assumptions

The AI made a massive silent assumption regarding the testing environment state: it assumed that the in-memory database (`userCarts` and `orders`) is entirely stateless and automatically resets between test executions.

When generating the assertions for coupon validation, the AI provided standalone `it(...)` blocks and assumed they would pass perfectly. It silently omitted the crucial `beforeEach()` or `afterEach()` hooks required to clear the database. Because our Jest suite runs sequentially, the state pollution from previous coupon tests caused the AI's generated tests to fail unexpectedly. The AI assumed the developer would automatically know to manage the test state, which is a dangerous assumption for junior developers relying entirely on AI-generated code.

## 5. (d) Over-confident Statements

Throughout the interaction, the AI exhibited a high degree of over-confidence. After generating the boundary test for the coupon logic, the AI stated: _"By adding this boundary assertion, your test suite will 100% kill the mutant and guarantee that your coupon validation logic is completely bulletproof."_

This statement is dangerously over-confident and misleading. While the assertion successfully kills that one specific Stryker mutant, killing a mutant does not equal "bulletproof logic." Mutation testing only measures the sensitivity of the test suite against predefined syntactic changes. It does not prove the absence of logical architecture flaws, security vulnerabilities (like IDOR when applying coupons), or business logic gaps. The AI conflated "killing a mutant" with "achieving perfect software quality," which contradicts the core principle that coverage and mutation scores are simply metrics, not guarantees.
