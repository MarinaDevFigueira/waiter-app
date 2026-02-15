import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "../../../__tests__/helpers";

test.describe("Label Component", () => {
  test("label renders with correct text", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const usernameLabel = page.locator('label[for="username"]');
    await expect(usernameLabel).toBeVisible();
    await expect(usernameLabel).toHaveText("Usuário");

    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toBeVisible();
    await expect(passwordLabel).toHaveText("Senha");
  });

  test("label is associated with input via htmlFor", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const usernameLabel = page.locator('label[for="username"]');
    await expect(usernameLabel).toHaveAttribute("for", "username");

    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toHaveAttribute("for", "password");
  });

  test("clicking label focuses associated input", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const usernameLabel = page.locator('label[for="username"]');
    const usernameInput = page.getByTestId("login-username-input");

    await usernameLabel.click();

    const isFocused = await usernameInput.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test("label has proper spacing from input", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");

    const usernameLabel = page.locator('label[for="username"]');
    await expect(usernameLabel).toHaveClass(/mb-2/);
  });
});
