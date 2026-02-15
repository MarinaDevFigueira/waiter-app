/**
 * Test helpers for Playwright E2E tests
 */

/**
 * Disables the splash screen for testing
 * Call this before navigating to any page to prevent splash screen interference
 */
export async function disableSplashScreen(page) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("showWelcomeSplash", "false");
  });
}

/**
 * Helper to login as a specific user
 * Automatically handles splash screen
 */
export async function loginAs(page, username, password, waitForUrl = "/") {
  await disableSplashScreen(page);
  await page.goto("/");

  await page.getByTestId("login-username-input").fill(username);
  await page.getByTestId("login-password-input").fill(password);
  await page.getByTestId("login-submit-button").click();

  await page.waitForURL(waitForUrl);
}

/**
 * Login as admin user (redirects to /dashboard)
 */
export async function loginAsAdmin(page) {
  await loginAs(page, "iconsagrado", "123", "/dashboard");
}

/**
 * Login as attendant user (redirects to /dashboard)
 */
export async function loginAsAttendant(page) {
  await loginAs(page, "atendente", "123", "/dashboard");
}

/**
 * Login as mesa user (sees FoodsPage)
 */
export async function loginAsMesa(page) {
  await loginAs(page, "mesa01", "123", "/");
}

/**
 * Login as delivery user (sees FoodsPage)
 */
export async function loginAsDelivery(page) {
  await loginAs(page, "usuarioonline", "123", "/");
}

/**
 * Login as kitchen user (sees KitchenPage)
 */
export async function loginAsKitchen(page) {
  await loginAs(page, "chefecozin", "123", "/");
}
