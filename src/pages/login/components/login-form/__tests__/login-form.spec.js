import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "@/components/__tests__/helpers";

test.describe("LoginForm Component", () => {
  test.beforeEach(async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/login");
  });

  test("renders login form card with branding", async ({ page }) => {
    const card = page.locator('div[class*="rounded-lg"]').first();
    await expect(card).toBeVisible();

    const heading = card.getByRole("heading", { name: /waiterapp/i });
    await expect(heading).toBeVisible();
  });

  test("renders username input field with correct attributes", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toHaveAttribute("type", "text");
    await expect(usernameInput).toHaveAttribute("placeholder", "seu usuário");
    await expect(usernameInput).toHaveAttribute("required");
  });

  test("renders password input field with correct attributes", async ({ page }) => {
    const passwordInput = page.getByTestId("login-password-input");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(passwordInput).toHaveAttribute("placeholder", "••••••••");
    await expect(passwordInput).toHaveAttribute("required");
  });

  test("renders submit button with icon", async ({ page }) => {
    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Entrar");

    const icon = submitButton.locator("svg");
    await expect(icon).toBeVisible();
  });

  test("renders card title and description", async ({ page }) => {
    const title = page.getByRole("heading", { name: /acesse sua conta/i });
    await expect(title).toBeVisible();

    const description = page.getByText(/entre com suas credenciais para continuar/i);
    await expect(description).toBeVisible();
  });

  test("allows user to type in username field", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    await usernameInput.fill("testuser");
    await expect(usernameInput).toHaveValue("testuser");
  });

  test("allows user to type in password field", async ({ page }) => {
    const passwordInput = page.getByTestId("login-password-input");
    await passwordInput.fill("testpass123");
    await expect(passwordInput).toHaveValue("testpass123");
  });

  test("submit button is enabled by default", async ({ page }) => {
    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeEnabled();
  });

  test("shows loading state on form submission", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    const passwordInput = page.getByTestId("login-password-input");
    const submitButton = page.getByTestId("login-submit-button");

    await usernameInput.fill("iconsagrado");
    await passwordInput.fill("123");
    await submitButton.click();

    await expect(submitButton).toContainText("Entrando...");
  });

  test("disables form fields during submission", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    const passwordInput = page.getByTestId("login-password-input");
    const submitButton = page.getByTestId("login-submit-button");

    await usernameInput.fill("iconsagrado");
    await passwordInput.fill("123");
    await submitButton.click();

    await expect(usernameInput).toBeDisabled();
    await expect(passwordInput).toBeDisabled();
    await expect(submitButton).toBeDisabled();
  });

  test("displays error message for invalid credentials", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    const passwordInput = page.getByTestId("login-password-input");
    const submitButton = page.getByTestId("login-submit-button");

    await usernameInput.fill("wronguser");
    await passwordInput.fill("wrongpass");
    await submitButton.click();

    const errorContainer = page.getByTestId("login-error-container");
    await expect(errorContainer).toBeVisible({ timeout: 5000 });

    const errorMessage = page.getByTestId("login-error-message");
    await expect(errorMessage).toBeVisible();
  });

  test("navigates to dashboard on successful login as admin", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    const passwordInput = page.getByTestId("login-password-input");
    const submitButton = page.getByTestId("login-submit-button");

    await usernameInput.fill("iconsagrado");
    await passwordInput.fill("123");
    await submitButton.click();

    await page.waitForURL("/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("form has correct HTML structure", async ({ page }) => {
    const form = page.locator("form");
    await expect(form).toBeVisible();

    const usernameLabel = page.getByText("Usuário");
    await expect(usernameLabel).toBeVisible();

    const passwordLabel = page.getByText("Senha");
    await expect(passwordLabel).toBeVisible();
  });

  test("labels are correctly associated with inputs", async ({ page }) => {
    const usernameInput = page.getByTestId("login-username-input");
    await expect(usernameInput).toHaveAttribute("id", "username");

    const passwordInput = page.getByTestId("login-password-input");
    await expect(passwordInput).toHaveAttribute("id", "password");
  });

  test("submit button has correct size", async ({ page }) => {
    const submitButton = page.getByTestId("login-submit-button");
    const classes = await submitButton.getAttribute("class");
    expect(classes).toContain("w-full");
  });

  test("card has correct max width constraint", async ({ page }) => {
    const card = page.locator('div[class*="rounded-lg"]').first();
    const classes = await card.getAttribute("class");
    expect(classes).toContain("max-w-md");
  });
});
