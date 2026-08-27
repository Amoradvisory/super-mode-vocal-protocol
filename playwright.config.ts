import { defineConfig, devices } from '@playwright/test';

function previewBaseUrl(): string {
  if (process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY) {
    const name = process.env.GITHUB_REPOSITORY.split('/')[1];
    if (name) return `http://127.0.0.1:4173/${name}/`;
  }
  return 'http://127.0.0.1:4173/';
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 1,
  reporter: 'line',
  use: { baseURL: previewBaseUrl(), trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'android', use: { ...devices['Pixel 5'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
