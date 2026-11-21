# Run evidence: Add Audi TT to Garage

- Updated automatically by the Playwright reporter after this test runs.
- Tool: Playwright Test, Chromium project
- Command: npx.cmd playwright test tests/add-car-audi-tt.spec.ts --project=chromium --reporter=list
- Timestamp: 2026-11-21T16:43:48.063+02:00 (EET, UTC+2)
- Environment: win32 x64, Node.js v25.6.1; Chromium. Base URL and credentials are omitted.
- Actual: passed; 1 passed, 0 failed, 0 timed out, 0 skipped, 0 interrupted (9.6s total).

| Element | Source / observed evidence |
|---|---|
| setup | Navigate to /, click Guest log in, then assert the URL matches panel/garage. |
| locator/action | Open Add car; select Audi and TT using the Brand and Model labels; fill Mileage with 12000; click Add. |
| assertions | Check the dialog heading, dialog closure, visible Audi TT list item, and mileage value 12000. |

- FACTS: 1 matching test result(s); summed test duration 7.4s.
- ASSUMPTIONS: None.
- RISKS: Guest-session changes may be temporary; persistence after the guest session ends is not checked.
- HUMAN CORRECTION: None recorded.
- DECISION: ACCEPT — the test run passed.
