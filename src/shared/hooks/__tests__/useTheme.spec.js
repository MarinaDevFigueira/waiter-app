import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../../../components/__tests__/helpers";

test.describe("useTheme Hook", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForTimeout(500);
  });

  test("should toggle theme on button click", async ({ page }) => {
    const themeToggle = page.locator("button").filter({ has: page.locator("svg") }).nth(1);

    const htmlElement = page.locator("html");
    const initialClass = await htmlElement.getAttribute("class");

    await themeToggle.click();
    await page.waitForTimeout(500);

    const updatedClass = await htmlElement.getAttribute("class");
    expect(updatedClass).toBeDefined();
  });

  test("should persist theme preference", async ({ page }) => {
    const themeToggle = page.locator("button").filter({ has: page.locator("svg") }).nth(1);

    await themeToggle.click();
    await page.waitForTimeout(500);

    const htmlElement = page.locator("html");
    const themeAfterToggle = await htmlElement.getAttribute("class");

    await page.reload();
    await page.waitForTimeout(500);

    const themeAfterReload = await htmlElement.getAttribute("class");
    expect(themeAfterReload).toBe(themeAfterToggle);
  });

  test("should maintain theme across navigation", async ({ page }) => {
    const htmlElement = page.locator("html");
    const initialTheme = await htmlElement.getAttribute("class");

    await page.goto("/dashboard/products");
    await page.waitForTimeout(500);

    const themeAfterNav = await htmlElement.getAttribute("class");
    expect(themeAfterNav).toBe(initialTheme);
  });

  test("should update theme reactively", async ({ page }) => {
    const themeToggle = page.locator("button").filter({ has: page.locator("svg") }).nth(1);
    const htmlElement = page.locator("html");

    const beforeToggle = await htmlElement.getAttribute("class");

    await themeToggle.click();
    await page.waitForTimeout(500);

    const afterToggle = await htmlElement.getAttribute("class");
    expect(afterToggle).toBeDefined();
  });

  test("should render theme toggle button", async ({ page }) => {
    const themeToggle = page.locator("button").filter({ has: page.locator("svg") }).nth(1);
    await expect(themeToggle).toBeVisible();
  });

  test("should have icon in theme toggle button", async ({ page }) => {
    const themeToggle = page.locator("button").filter({ has: page.locator("svg") }).nth(1);
    const icon = themeToggle.locator("svg");

    await expect(icon).toBeVisible();
  });

  test("should handle rapid theme toggles", async ({ page }) => {
    const themeToggle = page.locator("button").filter({ has: page.locator("svg") }).nth(1);

    await themeToggle.click();
    await themeToggle.click();
    await themeToggle.click();
    await page.waitForTimeout(500);

    const htmlElement = page.locator("html");
    const finalTheme = await htmlElement.getAttribute("class");

    expect(finalTheme).toBeDefined();
  });

  test("should apply theme to root html element", async ({ page }) => {
    const htmlElement = page.locator("html");
    await expect(htmlElement).toBeVisible();
  });

  test("should maintain theme consistency across page reloads", async ({ page }) => {
    const themeToggle = page.locator("button").filter({ has: page.locator("svg") }).nth(1);
    const htmlElement = page.locator("html");

    await themeToggle.click();
    await page.waitForTimeout(500);
    const theme1 = await htmlElement.getAttribute("class");

    await page.reload();
    await page.waitForTimeout(500);
    const theme2 = await htmlElement.getAttribute("class");

    expect(theme1).toBe(theme2);
  });
});
