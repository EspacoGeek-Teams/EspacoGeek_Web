// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Authentication Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 720 });
    // Wait for auth context to settle (not loading)
    await page.waitForTimeout(1000);
  });

  test('opens login modal when Login button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal).toBeVisible();
  });

  test('login modal contains EspaçoGeek branding', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal.getByText('Espaço')).toBeVisible();
    await expect(modal.getByText('Geek')).toBeVisible();
  });

  test('login modal shows subtitle', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal.getByText('Access your account in the geek universe')).toBeVisible();
  });

  test('login modal has email input field', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    await expect(page.locator('#auth-email')).toBeVisible();
  });

  test('login modal has password input field', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    await expect(page.locator('#auth-password')).toBeVisible();
  });

  test('login modal has Sign in submit button', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('login modal has Forgot Password link', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal.getByText(/Forgot your password/i)).toBeVisible();
  });

  test('login modal has switch to register prompt', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal.getByText("Don't have an account?")).toBeVisible();
  });

  test('clicking Sign up switches modal to register mode', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await modal.getByRole('button', { name: /sign up/i }).click();
    await expect(modal.getByText('Create your account and start the journey')).toBeVisible();
  });

  test('register mode shows Create Account button', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await modal.getByRole('button', { name: /sign up/i }).click();
    await expect(modal.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('register mode shows switch back to login prompt', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await modal.getByRole('button', { name: /sign up/i }).click();
    await expect(modal.getByText('Already have an account?')).toBeVisible();
  });

  test('register mode can switch back to login', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await modal.getByRole('button', { name: /sign up/i }).click();
    await modal.getByRole('button', { name: /log in/i }).click();
    await expect(modal.getByText('Access your account in the geek universe')).toBeVisible();
  });

  test('opens register modal directly when Register button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /^register$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Create your account and start the journey')).toBeVisible();
  });

  test('modal closes when close button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal).toBeVisible();
    await page.getByRole('button', { name: /close authentication/i }).click();
    await expect(modal).not.toBeVisible();
  });

  test('Forgot Password button redirects to reset page', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await modal.getByText(/Forgot your password/i).click();
    await expect(page).toHaveURL(/verify\/request-password-reset/);
  });

  test('can type in email field', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const emailInput = page.locator('#auth-email');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('modal dismisses on background mask click', async ({ page }) => {
    await page.getByRole('button', { name: /^login$/i }).click();
    const modal = page.locator('.p-dialog');
    await expect(modal).toBeVisible();
    // Click on the mask outside the modal
    await page.locator('.auth-modal-mask').click({ position: { x: 10, y: 10 }, force: true });
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });
});
