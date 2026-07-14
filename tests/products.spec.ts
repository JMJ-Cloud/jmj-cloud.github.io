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
