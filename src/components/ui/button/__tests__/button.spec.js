import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "../../../__tests__/helpers";

test.describe("Button Component", () => {
  test("login button renders and is clickable", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const button = page.getByTestId("login-submit-button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await expect(button).toContainText("Entrar");
  });

  test("button shows loading state", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const button = page.getByTestId("login-submit-button");

    await page.getByTestId("login-username-input").fill("admin");
    await page.getByTestId("login-password-input").fill("admin123");

    await button.click();

    await expect(button).toContainText("Entrando...");
  });

  test("button has hover cursor pointer", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const button = page.getByTestId("login-submit-button");
    await button.hover();

    const cursor = await button.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue("cursor")
    );
    expect(cursor).toBe("pointer");
  });

  test("disabled button is not clickable", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const button = page.getByTestId("login-submit-button");
    await page.getByTestId("login-username-input").fill("admin");
    await page.getByTestId("login-password-input").fill("admin123");
    await button.click();

    await expect(button).toBeDisabled();
  });
});
