'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');

const evidencePath = path.resolve(__dirname, '..', 'evidence', 'add-car-audi-tt-run-evidence.md');
const targetSuffix = path.normalize(path.join('tests', 'add-car-audi-tt.spec.ts'));
const command = 'npx.cmd playwright test tests/add-car-audi-tt.spec.ts --project=chromium --reporter=list';

function safeErrorMessage(error) {
  return String(error && error.message ? error.message : error || 'No error message provided')
    .replace(/https?:\/\/[^\s/@:]+:[^\s/@]+@/g, 'https://[credentials-redacted]@')
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 1000);
}

class AddCarAudiTtEvidenceReporter {
  constructor() {
    this.startedAt = 0;
    this.results = new Map();
  }

  onBegin() {
    this.startedAt = Date.now();
  }

  onTestEnd(test, result) {
    if (path.normalize(test.location.file).endsWith(targetSuffix)) {
      this.results.set(test.id, {
        status: result.status,
        duration: result.duration,
        errors: result.errors || []
      });
    }
  }

  async onEnd(runResult) {
    if (this.results.size === 0) return;

    const counts = { passed: 0, failed: 0, timedOut: 0, skipped: 0, interrupted: 0 };
    const results = Array.from(this.results.values());
    for (const item of results) {
      if (Object.prototype.hasOwnProperty.call(counts, item.status)) counts[item.status] += 1;
      else counts.failed += 1;
    }

    const totalSeconds = ((Date.now() - this.startedAt) / 1000).toFixed(1);
    const testSeconds = (results.reduce((sum, item) => sum + item.duration, 0) / 1000).toFixed(1);
    const summary = runResult.status + '; ' + counts.passed + ' passed, ' + counts.failed +
      ' failed, ' + counts.timedOut + ' timed out, ' + counts.skipped +
      ' skipped, ' + counts.interrupted + ' interrupted (' + totalSeconds + 's total).';
    const failures = results
      .filter((item) => item.status !== 'passed' && item.status !== 'skipped')
      .flatMap((item) => item.errors.map(safeErrorMessage));
    const lines = [
      '# Run evidence: Add Audi TT to Garage',
      '',
      '- Updated automatically by the Playwright reporter after this test runs.',
      '- Tool: Playwright Test, Chromium project',
      '- Command: ' + command,
      '- Timestamp: ' + new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().replace('Z', '+02:00') + ' (EET, UTC+2)',
      '- Environment: ' + process.platform + ' ' + process.arch + ', Node.js ' + process.version + '; Chromium. Base URL and credentials are omitted.',
      '- Actual: ' + summary,
      '',
      '| Element | Source / observed evidence |',
      '|---|---|',
      '| setup | Navigate to /, click Guest log in, then assert the URL matches panel/garage. |',
      '| locator/action | Open Add car; select Audi and TT using the Brand and Model labels; fill Mileage with 12000; click Add. |',
      '| assertions | Check the dialog heading, dialog closure, visible Audi TT list item, and mileage value 12000. |',
      '',
      '- FACTS: ' + results.length + ' matching test result(s); summed test duration ' + testSeconds + 's.',
      '- ASSUMPTIONS: None.',
      '- RISKS: Guest-session changes may be temporary; persistence after the guest session ends is not checked.',
      '- HUMAN CORRECTION: None recorded.',
      '- DECISION: ' + (runResult.status === 'passed' ? 'ACCEPT — the test run passed.' : 'STOP — the test run did not pass; see failure details.')
    ];
    if (failures.length) lines.push('', '## Failure details', '', ...failures.map((message) => '- ' + message));

    await fs.mkdir(path.dirname(evidencePath), { recursive: true });
    await fs.writeFile(evidencePath, lines.join('\n') + '\n', 'utf8');
  }
}

module.exports = AddCarAudiTtEvidenceReporter;
