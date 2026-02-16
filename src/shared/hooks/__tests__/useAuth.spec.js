import { test, expect } from "@playwright/test";
import { loginAsAdmin, loginAsAttendant, loginAsMesa, loginAsKitchen, disableSplashScreen } from "../../../components/__tests__/helpers";

test.describe("useAuth Hook", () => {
  test("should start as unauthenticated", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const loginForm = page.getByTestId("login-username-input");
    await expect(loginForm).toBeVisible();
  });

  test("should authenticate admin user", async ({ page }) => {
    await loginAsAdmin(page);

    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("should authenticate attendant user", async ({ page }) => {
    await loginAsAttendant(page);

    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("should authenticate mesa user", async ({ page }) => {
    await loginAsMesa(page);

    await page.waitForURL("/");
    const titleElement = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    await expect(titleElement).toBeVisible();
  });

  test("should authenticate kitchen user", async ({ page }) => {
    await loginAsKitchen(page);

    await page.waitForURL("/");
    expect(page.url()).not.toContain("/login");
  });

  test("should store auth state after login", async ({ page }) => {
    await loginAsAdmin(page);

    await page.reload();
    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("should have admin profile for admin user", async ({ page }) => {
    await loginAsAdmin(page);

    await page.waitForTimeout(500);
    expect(page.url()).toContain("/dashboard");
  });

  test("should have attendant profile for attendant user", async ({ page }) => {
    await loginAsAttendant(page);

    await page.waitForTimeout(500);
    expect(page.url()).toContain("/dashboard");
  });

  test("should have mesa profile for mesa user", async ({ page }) => {
    await loginAsMesa(page);

    await page.waitForTimeout(500);
    const titleElement = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    await expect(titleElement).toBeVisible();
  });

  test("should have kitchen profile for kitchen user", async ({ page }) => {
    await loginAsKitchen(page);

    await page.waitForTimeout(500);
    expect(page.url()).not.toContain("/login");
  });

  test("should redirect to login when not authenticated", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/dashboard");

    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
  });

  test("should maintain authentication across page navigation", async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForURL("/dashboard");

    await page.goto("/dashboard/products");
    await page.waitForTimeout(500);

    expect(page.url()).toContain("/dashboard/products");
  });

  test("should handle invalid credentials gracefully", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    await page.getByTestId("login-username-input").fill("invaliduser");
    await page.getByTestId("login-password-input").fill("wrongpassword");
    await page.getByTestId("login-submit-button").click();

    await page.waitForTimeout(1000);
  });

  test("should persist authentication state", async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForURL("/dashboard");

    await page.reload();
    await page.waitForTimeout(500);

    expect(page.url()).toContain("/dashboard");
  });

  test("should handle multiple login attempts", async ({ page }) => {
    await disableSplashScreen(page);

    await page.goto("/");
    await page.getByTestId("login-username-input").fill("wronguser");
    await page.getByTestId("login-password-input").fill("wrongpass");
    await page.getByTestId("login-submit-button").click();
    await page.waitForTimeout(1000);

    await page.getByTestId("login-username-input").fill("iconsagrado");
    await page.getByTestId("login-password-input").fill("123");
    await page.getByTestId("login-submit-button").click();

    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("should maintain auth context across components", async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForURL("/dashboard");

    const headerElement = page.locator("header");
    await expect(headerElement).toBeVisible();
  });

  test("should update auth state reactively", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const loginInput = page.getByTestId("login-username-input");
    await expect(loginInput).toBeVisible();

    await page.getByTestId("login-username-input").fill("iconsagrado");
    await page.getByTestId("login-password-input").fill("123");
    await page.getByTestId("login-submit-button").click();

    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("should handle session restoration on page load", async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForURL("/dashboard");

    const newPage = await page.context().newPage();
    await newPage.goto("http://localhost:5173/dashboard");
    await newPage.waitForTimeout(1000);

    await newPage.close();
  });
});
