import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type HttpCredentials = { username: string; password: string };

type CliConfig = {
  browser?: {
    contextOptions?: {
      httpCredentials?: Partial<HttpCredentials>;
    };
  };
};

function readEnvHttpCredentials(): HttpCredentials | undefined {
  const username = process.env.QAUTO_HTTP_USER?.trim();
  const password = process.env.QAUTO_HTTP_PASSWORD?.trim();
  return username && password ? { username, password } : undefined;
}

function readLocalHttpCredentials(): HttpCredentials | undefined {
  const configPath = resolve(__dirname, '.playwright', 'cli.config.json');
  if (!existsSync(configPath)) return undefined;

  const config = JSON.parse(readFileSync(configPath, 'utf8')) as CliConfig;
  const credentials = config.browser?.contextOptions?.httpCredentials;
  const username = credentials?.username?.trim();
  const password = credentials?.password?.trim();

  if (!username && !password) return undefined;
  if (!username || !password) {
    throw new Error('Both username and password must be set in .playwright/cli.config.json');
  }

  return { username, password };
}

const httpCredentials = readEnvHttpCredentials() ?? readLocalHttpCredentials();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list'], ['./scripts/add-car-audi-tt-evidence-reporter.cjs']],
  use: {
    baseURL: process.env.QAUTO_BASE_URL ?? 'https://qauto.forstudy.space',
    httpCredentials,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
