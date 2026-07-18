# Order mutation testing comparison

## Commands

```powershell
npm test
npm run mutation:order:baseline
npm run mutation:order
```

## Baseline versus improved

| Metric | Baseline tests | Improved tests |
|---|---:|---:|
| Jest tests | 7 | 18 |
| Mutation score | 57.24% | 100.00% |
| Covered mutation score | 79.09% | 100.00% |
| Killed | 87 | 143 |
| Timeout | 0 | 9 |
| Survived | 23 | 0 |
| No coverage | 42 | 0 |
| Errors | 9 | 9 |

- Baseline report: `../mutation-order-baseline/mutation.html`
- Improved report: `mutation.html`

## Test improvements guided by surviving mutants

- Asserted cart persistence, duplicate rows, and isolation between users.
- Added checkout error handling, order ownership, ordering, and detail cases.
- Covered pending, confirmed, shipping, delivered, and canceled order behavior.
- Added coupon threshold, expiry, fixed/percent, user/no-user, and usage-limit cases.
- Asserted exact response bodies and database-error responses.
- Verified that coupon usage is not queried when `user_id` is absent.

## Current SUT behaviors captured by passing tests

The refactor intentionally preserves the existing behavior from `server.js` for
mutation-testing comparison. The tests document that the current SUT:

- stores duplicate cart rows instead of increasing quantity;
- lets a user cancel an order in `shipping` state;
- rejects a coupon when the total equals its minimum threshold;
- calculates percentage discounts with the existing incorrect formula.
