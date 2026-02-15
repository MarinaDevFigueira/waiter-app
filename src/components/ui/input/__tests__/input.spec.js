import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "../../../__tests__/helpers";

test.describe("Input Component", () => {
  test("input renders and accepts text", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const input = page.getByTestId("login-username-input");
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();

    await input.fill("testuser");
    await expect(input).toHaveValue("testuser");
  });

  test("password input masks text", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const passwordInput = page.getByTestId("login-password-input");
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("input shows placeholder", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const usernameInput = page.getByTestId("login-username-input");
    await expect(usernameInput).toHaveAttribute("placeholder", "seu usuário");

    const passwordInput = page.getByTestId("login-password-input");
    await expect(passwordInput).toHaveAttribute("placeholder", "••••••••");
  });

  test("required input shows validation", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const submitButton = page.getByTestId("login-submit-button");
    const usernameInput = page.getByTestId("login-username-input");

    await expect(usernameInput).toHaveAttribute("required");

    await submitButton.click();

    const isValid = await usernameInput.evaluate((el) => el.checkValidity());
    expect(isValid).toBe(false);
  });

  test("input can be disabled", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const usernameInput = page.getByTestId("login-username-input");
    const passwordInput = page.getByTestId("login-password-input");

    await usernameInput.fill("iconsagrado");
    await passwordInput.fill("123");
    await page.getByTestId("login-submit-button").click();

    await expect(usernameInput).toBeDisabled();
  });
});
