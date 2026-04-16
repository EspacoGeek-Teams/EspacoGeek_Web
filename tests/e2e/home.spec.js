// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/EspacoGeek/i);
  });

  test('displays TopBar navigation on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('.p-toolbar')).toBeVisible();
  });

  test('displays Home navigation button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const homeBtn = page.getByRole('button', { name: /^home$/i }).first();
    await expect(homeBtn).toBeVisible();
  });

  test('displays Search navigation button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const searchBtn = page.getByRole('button', { name: /^search$/i }).first();
    await expect(searchBtn).toBeVisible();
  });

  test('displays Login button when not authenticated', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    const loginBtn = page.getByRole('button', { name: /^login$/i });
    await expect(loginBtn).toBeVisible();
  });

  test('displays Register button when not authenticated', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    const registerBtn = page.getByRole('button', { name: /^register$/i });
    await expect(registerBtn).toBeVisible();
  });

  test('displays hero badge text', async ({ page }) => {
    await expect(page.getByText('Mission Control for Your Hobbies')).toBeVisible();
  });

  test('displays hero title prefix', async ({ page }) => {
    await expect(page.getByText('Your Universe of')).toBeVisible();
  });

  test('displays hero title highlight', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText('Media');
  });

  test('displays hero description', async ({ page }) => {
    await expect(page.getByText(/One hub to track every anime/)).toBeVisible();
  });

  test('displays all six media category cards', async ({ page }) => {
    const categories = ['Anime', 'Series', 'Movies', 'Visual Novels', 'Books', 'Games'];
    for (const cat of categories) {
      await expect(page.getByText(cat).first()).toBeVisible();
    }
  });

  test('displays media category card descriptions', async ({ page }) => {
    await expect(page.getByText('Track your watchlist and favorites')).toBeVisible();
    await expect(page.getByText('Cinema hits and hidden gems')).toBeVisible();
  });

  test('displays multiverse tagline', async ({ page }) => {
    await expect(page.getByText('[ TRACKING ACROSS THE MULTIVERSE ]')).toBeVisible();
  });

  test('displays footer with EG brand', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText('EG')).toBeVisible();
  });

  test('displays footer copyright notice', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByText(/EspaçoGeek/i)).toBeVisible();
    await expect(footer.getByText(/All Rights Reserved/i)).toBeVisible();
  });

  test('displays footer GitHub link', async ({ page }) => {
    const githubLink = page.locator('footer').getByText('Github');
    await expect(githubLink).toBeVisible();
  });

  test('displays footer About link', async ({ page }) => {
    const aboutLink = page.locator('footer').getByText('About');
    await expect(aboutLink).toBeVisible();
  });

  test('displays footer INFORMATION section', async ({ page }) => {
    await expect(page.locator('footer').getByText('INFORMATION')).toBeVisible();
  });

  test('logo image is visible in topbar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const logo = page.locator('.p-toolbar img[alt="Logo"]');
    await expect(logo).toBeVisible();
  });
});
