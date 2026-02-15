import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../../../__tests__/helpers";

test.describe("ThemeToggle Component", () => {
  test("theme toggle button renders in dashboard", async ({ page }) => {
    await loginAsAdmin(page);

    const themeToggle = page.getByTestId("theme-toggle");
    await expect(themeToggle).toBeVisible();
  });

  test("clicking theme toggle changes theme", async ({ page }) => {
    await loginAsAdmin(page);

    const themeToggle = page.getByTestId("theme-toggle");
    const htmlElement = page.locator("html");

    const initialTheme = await htmlElement.evaluate((el) =>
      el.classList.contains("dark") ? "dark" : "light"
    );

    await themeToggle.click();

    const newTheme = await htmlElement.evaluate((el) =>
      el.classList.contains("dark") ? "dark" : "light"
    );

    expect(newTheme).not.toBe(initialTheme);
  });

  test("theme preference persists in sessionStorage", async ({ page }) => {
    await loginAsAdmin(page);

    const themeToggle = page.getByTestId("theme-toggle");
    await themeToggle.click();

    const storedTheme = await page.evaluate(() =>
      sessionStorage.getItem("theme")
    );

    expect(storedTheme).toBeTruthy();
    expect(["light", "dark"]).toContain(storedTheme);
  });
});
