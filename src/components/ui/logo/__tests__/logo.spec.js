import { test, expect } from "@playwright/test";
import { loginAsAdmin, loginAsMesa } from "../../../__tests__/helpers";

test.describe("Logo Component", () => {
  test("renders logo with WaiterApp text", async ({ page }) => {
    await loginAsMesa(page);

    const logo = page.getByTestId("logo");
    await expect(logo).toBeVisible();
    await expect(logo).toContainText("WaiterApp");
  });

  test("logo has red background", async ({ page }) => {
    await loginAsMesa(page);

    const logo = page.getByTestId("logo");
    await expect(logo).toBeVisible();

    const bgColor = await logo.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(bgColor).toBeTruthy();
  });

  test("logo text is white", async ({ page }) => {
    await loginAsMesa(page);

    const logo = page.getByTestId("logo");
    const logoText = logo.locator("span");

    await expect(logoText).toBeVisible();
    await expect(logoText).toHaveText("WaiterApp");
  });

  test("logo is hidden when minimized in dashboard", async ({ page }) => {
    await loginAsAdmin(page);

    const logo = page.getByTestId("logo");
    await expect(logo).toBeVisible();

    const toggleButton = page.getByTestId("toggle-sidebar");
    await toggleButton.click();

    await expect(logo).toBeHidden();
  });

  test("logo redirects to home when clicked", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("http://localhost:5173/dashboard/pedidos");

    await page.waitForURL("**/dashboard/pedidos");

    const logo = page.getByTestId("logo");
    await logo.click();

    await page.waitForURL("**/");
    expect(page.url()).toContain("/");
  });
});
