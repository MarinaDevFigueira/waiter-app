import { test, expect } from "@playwright/test";
import { disableSplashScreen, loginAsAdmin, loginAsMesa } from "../../__tests__/helpers";

test.describe("ProtectedRoute Component", () => {
  test("redirects to home (login) when not authenticated and trying to access dashboard", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/dashboard");

    const usernameInput = page.getByTestId("login-username-input");
    await expect(usernameInput).toBeVisible();
  });

  test("allows access when authenticated", async ({ page }) => {
    await loginAsAdmin(page);

    expect(page.url()).toContain("/dashboard");
  });

  test("admin can access admin routes", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/dashboard/users");
    expect(page.url()).toContain("/dashboard/users");
  });

  test("mesa user cannot access dashboard routes", async ({ page }) => {
    await loginAsMesa(page);

    expect(page.url()).toBe("http://localhost:5173/");
    expect(page.url()).not.toContain("/dashboard");
  });

  test("maintains authentication across page reloads", async ({ page }) => {
    await loginAsAdmin(page);

    await page.reload();

    expect(page.url()).toContain("/dashboard");
  });
});
