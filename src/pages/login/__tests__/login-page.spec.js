import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "../../../components/__tests__/helpers";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");
  });

  test("renders login card with WAITERAPP branding", async ({ page }) => {
    const card = page.locator('div[class*="rounded-lg"]').first();
    const heading = card.getByRole("heading", { name: /waiterapp/i });
    await expect(heading).toBeVisible();
  });

  test("renders username input field", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toHaveAttribute("type", "text");
    await expect(usernameInput).toHaveAttribute("placeholder", "seu usuário");
  });

  test("renders password input field", async ({ page }) => {
    const passwordInput = page.getByTestId("login-password-input");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("renders submit button", async ({ page }) => {
    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText("Entrar");
  });

  test("renders card title and description", async ({ page }) => {
    const title = page.getByRole("heading", { name: /acesse sua conta/i });
    await expect(title).toBeVisible();

    const description = page.getByText(
      /entre com suas credenciais para continuar/i
    );
    await expect(description).toBeVisible();
  });

  test("allows user to type username", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    await usernameInput.fill("admin");
    await expect(usernameInput).toHaveValue("admin");
  });

  test("allows user to type password", async ({ page }) => {
    const passwordInput = page.getByTestId("login-password-input");
    await passwordInput.fill("password123");
    await expect(passwordInput).toHaveValue("password123");
  });

  test("submit button is enabled by default", async ({ page }) => {
    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeEnabled();
  });

  test("login page does not have header", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).not.toBeVisible();
  });

  test("login form has centered layout", async ({ page }) => {
    const card = page.locator('div[class*="rounded-lg"]').first();
    await expect(card).toBeVisible();
  });

  test("submit button contains user icon", async ({ page }) => {
    const submitButton = page.getByTestId("login-submit-button");
    const icon = submitButton.locator("svg");
    await expect(icon).toBeVisible();
  });
});
