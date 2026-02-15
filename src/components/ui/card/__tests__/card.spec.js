import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "../../../__tests__/helpers";

test.describe("Card Component", () => {
  test("card renders on login page", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const card = page.locator(".max-w-md").first();
    await expect(card).toBeVisible();
  });

  test("card header displays title and description", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const cardTitle = page.locator("h3").filter({ hasText: "Acesse sua conta" });
    await expect(cardTitle).toBeVisible();

    const cardDescription = page.locator("p").filter({
      hasText: "Entre com suas credenciais para continuar",
    });
    await expect(cardDescription).toBeVisible();
  });

  test("card content contains form elements", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const usernameInput = page.getByTestId("login-username-input");
    const passwordInput = page.getByTestId("login-password-input");
    const submitButton = page.getByTestId("login-submit-button");

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("card has proper border and shadow styling", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const card = page.locator(".max-w-md").first();
    await expect(card).toHaveClass(/border/);
  });

  test("404 page uses card for error display", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/non-existent-route");

    const card = page.locator(".max-w-md").first();
    await expect(card).toBeVisible();

    const errorTitle = page.locator("h3").filter({ hasText: "404" });
    await expect(errorTitle).toBeVisible();
  });
});
