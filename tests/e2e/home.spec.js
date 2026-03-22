// E2E Tests for Home Page
// tests/e2e/home.spec.js
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/SutraKala/);
  });

  test('should display navigation menu', async ({ page }) => {
    const navMenu = page.locator('.nav-menu');
    await expect(navMenu).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();
  });

  test('should display featured products', async ({ page }) => {
    const productsSection = page.locator('.featured-products');
    await expect(productsSection).toBeVisible();
  });

  test('should navigate to shop page', async ({ page }) => {
    await page.click('a[href="shop.html"]');
    await expect(page).toHaveURL(/shop.html/);
  });

  test('should open login modal when clicking login button', async ({ page }) => {
    const loginButton = page.locator('#authLoginBtn');
    await loginButton.click();

    const loginModal = page.locator('#loginModal');
    await expect(loginModal).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    const addToCartButton = page.locator('.add-to-cart-btn').first();
    await addToCartButton.click();

    // Wait for cart update
    await page.waitForTimeout(1000);

    const cartCount = page.locator('.cart-count');
    await expect(cartCount).toHaveText('1');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const navMenu = page.locator('.nav-menu');
    const mobileMenuToggle = page.locator('.mobile-menu-toggle');

    await expect(mobileMenuToggle).toBeVisible();
    await expect(navMenu).not.toBeVisible();

    await mobileMenuToggle.click();
    await expect(navMenu).toBeVisible();
  });
});
