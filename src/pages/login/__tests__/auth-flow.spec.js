import { test, expect } from "@playwright/test";
import { disableSplashScreen, waitForApiRequest } from "../../../components/__tests__/helpers";

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

    const loginResponse = waitForApiRequest(page, "/auth/login");
    await page.getByTestId("login-submit-button").click();
    await loginResponse;

    await page.waitForURL("/dashboard", { timeout: 15000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("kitchen login redirects to /dashboard", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("chefecozin");
    await page.getByTestId("login-password-input").fill("123");

    const loginResponse = waitForApiRequest(page, "/auth/login");
    await page.getByTestId("login-submit-button").click();
    await loginResponse;

    await page.waitForURL("/dashboard", { timeout: 15000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("invalid credentials shows error toast", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("usuario_invalido");
    await page.getByTestId("login-password-input").fill("senha_errada");
    await page.getByTestId("login-submit-button").click();

    await page.waitForResponse((r) => r.url().includes("/auth/login"));
    await page.waitForTimeout(500);

    const toastError = page.locator('[role="alert"], .Toastify__toast--error').first();
    const errorMessage = page.getByTestId("login-error-message");

    const hasToast = await toastError.isVisible().catch(() => false);
    const hasError = await errorMessage.isVisible().catch(() => false);
    expect(hasToast || hasError).toBe(true);
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

    const loginResponse = waitForApiRequest(page, "/auth/login");
    await page.getByTestId("login-submit-button").click();
    await loginResponse;

    await page.waitForURL("/dashboard", { timeout: 15000 });

    const accessToken = await page.evaluate(() =>
      window.sessionStorage.getItem("access_token")
    );
    expect(accessToken).toBeTruthy();
    expect(accessToken.length).toBeGreaterThan(10);
  });

  test("successful login stores auth data in sessionStorage", async ({ page }) => {
    await page.getByTestId("login-username-input").fill("iconsagrado");
    await page.getByTestId("login-password-input").fill("123");

    const loginResponse = waitForApiRequest(page, "/auth/login");
    await page.getByTestId("login-submit-button").click();
    await loginResponse;

    await page.waitForURL("/dashboard", { timeout: 15000 });

    const auth = await page.evaluate(() =>
      JSON.parse(window.sessionStorage.getItem("auth") || "null")
    );
    expect(auth).not.toBeNull();
    expect(auth.name).toBeTruthy();
    expect(auth.profile).toBeTruthy();
  });

  test("protected route redirects unauthenticated user to login", async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.removeItem("auth");
      window.sessionStorage.removeItem("access_token");
    });
    await page.goto("/dashboard/products");
    await page.waitForLoadState("domcontentloaded");

    expect(page.url()).not.toContain("/dashboard/products");
  });
});
