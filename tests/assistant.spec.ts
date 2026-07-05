import { test, expect, Page } from '@playwright/test';

const API = '**/ords/jmjweb/chat';
const json = (body: object, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(body),
});

async function mockHappyBackend(page: Page, overrides: Record<string, object | null> = {}) {
  await page.route(`${API}/status`, (r) => r.fulfill(json(overrides.status ?? { enabled: 'Y' })));
  await page.route(`${API}/otp`, (r) => r.fulfill(json(overrides.otp ?? { status: 'ok', detail: 'sent' }, 201)));
  await page.route(`${API}/sessions`, (r) =>
    r.fulfill(json(overrides.sessions ?? {
      status: 'ok', detail: 'created', token: 'a'.repeat(64),
      greeting: 'Hi, I am the test greeting. Who am I speaking with?', remaining: 20,
    }, 201)));
  await page.route(`${API}/messages`, (r) =>
    r.fulfill(json(overrides.messages ?? {
      status: 'ok', detail: 'created', reply: 'Thanks. What company are you with?', remaining: 19,
    }, 201)));
  await page.route(`${API}/complete`, (r) =>
    r.fulfill(json(overrides.complete ?? {
      status: 'ok', detail: 'created',
      brief: JSON.stringify({ summary_text: 'Test Corp needs an APEX app.' }),
    }, 201)));
}

async function reachChat(page: Page) {
  await page.goto('/assistant');
  await page.getByTestId('aw-email-input').fill('test@example.com');
  await page.getByTestId('aw-email-submit').click();
  await page.getByTestId('aw-code-input').fill('123456');
  await page.getByTestId('aw-code-submit').click();
  await expect(page.getByTestId('aw-log')).toContainText('test greeting');
}

test('offline state when status says disabled', async ({ page }) => {
  await mockHappyBackend(page, { status: { enabled: 'N' } });
  await page.goto('/assistant');
  await expect(page.getByTestId('aw-offline')).toBeVisible();
});

test('happy path: email, code, chat turn, wrap-up summary', async ({ page }) => {
  await mockHappyBackend(page);
  await reachChat(page);
  await page.getByTestId('aw-input').fill('I am Pat from Test Corp.');
  await page.getByTestId('aw-send').click();
  await expect(page.getByTestId('aw-log')).toContainText('What company are you with?');
  await page.getByTestId('aw-wrapup').click();
  await expect(page.getByTestId('aw-done')).toBeVisible();
  await expect(page.getByTestId('aw-done')).toContainText('Test Corp needs an APEX app.');
});

test('invalid code shows friendly message and stays on code panel', async ({ page }) => {
  await mockHappyBackend(page, {
    sessions: { status: 'error', detail: 'invalid_code' },
  });
  await page.route(`${API}/sessions`, (r) =>
    r.fulfill(json({ status: 'error', detail: 'invalid_code' }, 401)));
  await page.goto('/assistant');
  await page.getByTestId('aw-email-input').fill('test@example.com');
  await page.getByTestId('aw-email-submit').click();
  await page.getByTestId('aw-code-input').fill('000000');
  await page.getByTestId('aw-code-submit').click();
  await expect(page.getByTestId('aw-code-status')).toContainText('not right');
});

test('message cap: remaining 0 prompts wrap-up', async ({ page }) => {
  await mockHappyBackend(page, {
    messages: { status: 'ok', detail: 'created', reply: 'Noted.', remaining: 0 },
  });
  await reachChat(page);
  await page.getByTestId('aw-input').fill('hello');
  await page.getByTestId('aw-send').click();
  await expect(page.getByTestId('aw-chat-status')).toContainText('Send summary');
  await expect(page.getByTestId('aw-remaining')).toContainText('0 messages left');
});

test('at capacity shows contact-form guidance', async ({ page }) => {
  await mockHappyBackend(page);
  await page.route(`${API}/messages`, (r) =>
    r.fulfill(json({ status: 'error', detail: 'at_capacity' }, 503)));
  await reachChat(page);
  await page.getByTestId('aw-input').fill('hello');
  await page.getByTestId('aw-send').click();
  await expect(page.getByTestId('aw-chat-status')).toContainText('at capacity');
});

test('session restore after reload', async ({ page }) => {
  await mockHappyBackend(page);
  await reachChat(page);
  await page.getByTestId('aw-input').fill('I am Pat.');
  await page.getByTestId('aw-send').click();
  await expect(page.getByTestId('aw-log')).toContainText('What company');
  await page.reload();
  await expect(page.getByTestId('aw-log')).toContainText('What company');
});
