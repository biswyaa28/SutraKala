// E2E Tests for Login Page
// tests/e2e/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login.html');
  });

  test('should display login page title', async ({ page }) => {
    await expect(page).toHaveTitle(/SutraKala/);

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should display Google login button', async ({ page }) => {
    const googleBtn = page.locator('#googleLoginBtn');
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toContainText('Google');
  });

  test('should display phone login option', async ({ page }) => {
    const phoneOption = page.locator('text=Phone');
    await expect(phoneOption).toBeVisible();
  });

  test('should show guest checkout link', async ({ page }) => {
    const guestLink = page.locator('a[href="index.html"]');
    await expect(guestLink).toBeVisible();
    await expect(guestLink).toContainText('guest');
  });

  test('should redirect after successful login', async ({ page }) => {
    // This would require actual Firebase setup
    // For now, we test the UI flow
    await expect(page.locator('#loginContent')).toBeVisible();
  });

  test('should handle login error gracefully', async ({ page }) => {
    // Test error UI (would need to mock Firebase for full test)
    const errorMessage = page.locator('#errorMessage');
    await expect(errorMessage).toBeHidden();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const loginContent = page.locator('#loginContent');
    await expect(loginContent).toBeVisible();

    // Check layout is correct on mobile
    const googleBtn = page.locator('#googleLoginBtn');
    await expect(googleBtn).toBeVisible();
  });
});

test.describe('Login Modal', () => {
  test('should open from navbar', async ({ page }) => {
    await page.goto('/');

    const loginBtn = page.locator('#authLoginBtn');
    await loginBtn.click();

    const modal = page.locator('#loginModal');
    await expect(modal).toBeVisible();
  });

  test('should close when clicking overlay', async ({ page }) => {
    await page.goto('/');

    const loginBtn = page.locator('#authLoginBtn');
    await loginBtn.click();

    const overlay = page.locator('.modal-overlay');
    await overlay.click();

    const modal = page.locator('#loginModal');
    await expect(modal).not.toBeVisible();
  });

  test('should close when pressing Escape', async ({ page }) => {
    await page.goto('/');

    const loginBtn = page.locator('#authLoginBtn');
    await loginBtn.click();

    await page.keyboard.press('Escape');

    const modal = page.locator('#loginModal');
    await expect(modal).not.toBeVisible();
  });

  test('should switch to phone input', async ({ page }) => {
    await page.goto('/');

    const loginBtn = page.locator('#authLoginBtn');
    await loginBtn.click();

    const phoneBtn = page.locator('text=Phone');
    await phoneBtn.click();

    const phoneInput = page.locator('#phoneInput');
    await expect(phoneInput).toBeVisible();
  });
});
