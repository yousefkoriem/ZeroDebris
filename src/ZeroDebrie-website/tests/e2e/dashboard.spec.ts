import { test, expect } from '@playwright/test';

test('login and view dashboard', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[type="text"]', 'operator');
  await page.fill('input[type="password"]', 'operator');
  await page.click('button[type="submit"]');

  await page.waitForURL('/dashboard');
  
  await expect(page.locator('h1')).toHaveText('Mission Dashboard');
  await expect(page.locator('text=Active Fleet')).toBeVisible();
});
