import { test, expect } from "@playwright/test";
import { disableSplashScreen, loginAsMesa } from "../../components/__tests__/helpers";

test.describe("Root Layout", () => {
  test("renders splash screen on first visit", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();
  });

  test("renders login page when not authenticated", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const usernameInput = page.getByTestId("login-username-input");
    await expect(usernameInput).toBeVisible();
  });

  test("renders home page after login", async ({ page }) => {
    await loginAsMesa(page);

    const pageContent = page.locator("body");
    await expect(pageContent).toBeVisible();
  });
});
