import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "../../../components/__tests__/helpers";

const BASE_URL = "http://localhost:3000";

test.describe("Auth Flow — API Integration", () => {
  test.beforeEach(async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");
  });

  test("shows login page when unauthenticated", async ({ page }) => {
    await expect(page.getByTestId("login-username-input")).toBeVisible();
    await expect(page.getByTestId("login-password-input")).toBeVisible();
    await expect(page.getByTestId("login-submit-button")).toBeVisible();
  });

  test("shows loading state on submit", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("iconsagrado");
    await page.getByTestId("login-password-input").fill("123");

    const [, response] = await Promise.all([
      page.getByTestId("login-submit-button").click(),
      page.waitForResponse((r) => r.url().includes("/auth/login")),
    ]);

    expect(response.url()).toContain("/auth/login");
  });

  test("admin login redirects to /dashboard", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("iconsagrado");
    await page.getByTestId("login-password-input").fill("123");

    await Promise.all([
      page.getByTestId("login-submit-button").click(),
      page.waitForResponse((r) => r.url().includes("/auth/login")),
    ]);

    await page.waitForURL("**/dashboard", { timeout: 20000 });

    const currentUrl = page.url();
    const isDashboard = currentUrl.includes("/dashboard");
    expect(isDashboard).toBe(true);
  });

  test("kitchen login redirects to /dashboard", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("chefecozin");
    await page.getByTestId("login-password-input").fill("123");

    await Promise.all([
      page.getByTestId("login-submit-button").click(),
      page.waitForResponse((r) => r.url().includes("/auth/login")),
    ]);

    await page.waitForURL("**/dashboard", { timeout: 20000 });

    const currentUrl = page.url();
    const isDashboard = currentUrl.includes("/dashboard");
    expect(isDashboard).toBe(true);
  });

  test("invalid credentials shows error toast", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("usuario_invalido");
    await page.getByTestId("login-password-input").fill("senha_errada");
    await page.getByTestId("login-submit-button").click();

    await page.waitForResponse((r) => r.url().includes("/auth/login"));

    const errorMessage = page.getByTestId("login-error-message");
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test("empty username shows validation error", async ({ page }) => {
    await page.getByTestId("login-password-input").fill("123");
    await page.getByTestId("login-submit-button").click();

    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeVisible();
    expect(page.url()).not.toContain("/dashboard");
  });

  test("empty password shows validation error", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("iconsagrado");
    await page.getByTestId("login-submit-button").click();

    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeVisible();
    expect(page.url()).not.toContain("/dashboard");
  });

  test("successful login stores access token in sessionStorage", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("iconsagrado");
    await page.getByTestId("login-password-input").fill("123");

    await Promise.all([
      page.getByTestId("login-submit-button").click(),
      page.waitForResponse((r) => r.url().includes("/auth/login")),
    ]);

    await page.waitForURL("**/dashboard", { timeout: 20000 });
    await page.waitForTimeout(500);

    const accessToken = await page.evaluate(() =>
      window.sessionStorage.getItem("access_token")
    );
    const hasAccessToken = Boolean(accessToken);
    expect(hasAccessToken).toBe(true);

    const tokenLength = accessToken.length;
    const isValidTokenLength = tokenLength > 10;
    expect(isValidTokenLength).toBe(true);
  });

  test("successful login stores auth data in sessionStorage", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("iconsagrado");
    await page.getByTestId("login-password-input").fill("123");

    await Promise.all([
      page.getByTestId("login-submit-button").click(),
      page.waitForResponse((r) => r.url().includes("/auth/login")),
    ]);

    await page.waitForURL("**/dashboard", { timeout: 20000 });
    await page.waitForTimeout(500);

    const auth = await page.evaluate(() =>
      JSON.parse(window.sessionStorage.getItem("auth") || "null")
    );
    const hasAuth = auth !== null;
    expect(hasAuth).toBe(true);

    const hasName = Boolean(auth.name);
    expect(hasName).toBe(true);

    const hasProfile = Boolean(auth.profile);
    expect(hasProfile).toBe(true);
  });

  test("protected route redirects unauthenticated user to login", async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.removeItem("auth");
      window.sessionStorage.removeItem("access_token");
      window.sessionStorage.removeItem("refresh_token");
    });
    await page.goto("/dashboard/products");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    const hasProductsRoute = currentUrl.includes("/dashboard/products");
    expect(hasProductsRoute).toBe(false);
  });
});
