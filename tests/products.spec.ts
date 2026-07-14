import { test, expect } from '@playwright/test';

test('solution page renders content and consulting CTA', async ({ page }) => {
  await page.goto('/products/apex-integration-monitoring');
  await expect(
    page.getByRole('heading', { level: 1, name: 'APEX Integration Monitoring' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'We implement this in your tenancy' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Talk to Us' })).toBeVisible();
});

test('qyrena page renders with embedded demo and beta link', async ({ page }) => {
  await page.goto('/products/qyrena');
  await expect(page.getByRole('heading', { level: 1, name: 'JMJ Qyrena' })).toBeVisible();
  await expect(page.locator('iframe[src="/demos/qyrena/index.html"]')).toBeAttached();
  await expect(page.getByRole('link', { name: 'Join the Beta' })).toBeVisible();
});

test('relay page renders with embedded demo', async ({ page }) => {
  await page.goto('/products/relay');
  await expect(page.getByRole('heading', { level: 1, name: 'JMJ Relay' })).toBeVisible();
  await expect(page.locator('iframe[src="/demos/relay/index.html"]')).toBeAttached();
  await expect(page.getByRole('link', { name: 'Talk to Us' })).toBeVisible();
});

test('products hub lists both tiers', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: 'JMJ Qyrena' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'JMJ Relay' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Solutions & Accelerators' })).toBeVisible();
  await expect(page.getByRole('link', { name: /APEX Integration Monitoring/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /OIC Backup to OCI Storage/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /OIC OAuth Service Account/ })).toBeVisible();
});
