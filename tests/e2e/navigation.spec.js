// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('about page loads with correct heading', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByText(/About Us/i)).toBeVisible();
  });

  test('footer About link navigates to about page', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByText('About').click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('footer GitHub link has correct href', async ({ page }) => {
    await page.goto('/');
    const githubLink = page.locator('footer').getByText('Github');
    await expect(githubLink).toHaveAttribute('href', /github\.com\/EspacoGeek-Teams/);
  });

  test('footer GitHub link opens in new tab', async ({ page }) => {
    await page.goto('/');
    const githubLink = page.locator('footer').getByText('Github');
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('Home button navigates to home page from about', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/about');
    const homeBtn = page.getByRole('button', { name: /^home$/i }).first();
    await homeBtn.click();
    await expect(page).toHaveURL('/');
  });

  test('Search button shows search component', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    const searchBtn = page.getByRole('button', { name: /^search$/i }).first();
    await searchBtn.click();
    // SearchBar renders an overlay/dialog element
    await expect(page.locator('.p-dialog, [role="dialog"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('footer logo link navigates back to home', async ({ page }) => {
    await page.goto('/about');
    const logoLink = page.locator('footer').getByRole('link').first();
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });

  test('verify/request-password-reset page loads', async ({ page }) => {
    await page.goto('/verify/request-password-reset');
    await expect(page).toHaveURL(/verify\/request-password-reset/);
  });

  test('page does not have 404 on home route', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('page does not have 404 on about route', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(200);
  });

  test('footer API link has correct href', async ({ page }) => {
    await page.goto('/');
    const apiLink = page.locator('footer').getByText('API');
    await expect(apiLink).toHaveAttribute('href', /graphiql/);
  });

  test('topbar logo image links to home on click', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/about');
    // Click the logo image inside the topbar
    await page.locator('.p-toolbar img[alt="Logo"]').click();
    // Home button click triggers router.push('/') - wait for URL
    await page.waitForTimeout(500);
    await expect(page).toHaveURL('/');
  });
});
