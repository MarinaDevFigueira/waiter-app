import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../../components/__tests__/helpers";

test.describe("Categories Component", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
    await page.waitForTimeout(1500);
  });

  test("renders Todos (All) tab", async ({ page }) => {
    const todosTab = page.getByText("Todos", { exact: true });
    await expect(todosTab).toBeVisible();
  });

  test("Todos tab is selected by default", async ({ page }) => {
    const todosTab = page.getByText("Todos", { exact: true });
    const parent = todosTab.locator("..");
    const selected = await parent.getAttribute("data-selected");
    expect(selected).toBe("true");
  });

  test("renders category tabs from API", async ({ page }) => {
    await page.waitForTimeout(500);
    const categoryTabs = page.locator("div").filter({ hasText: /^(Todos|[A-Z])/ });
    const count = await categoryTabs.count();
    expect(count).toBeGreaterThan(0);
  });

  test("can click on a category tab", async ({ page }) => {
    await page.waitForTimeout(500);
    const categoryTabs = page.locator("li").filter({ has: page.locator("span[data-selected]") });
    const count = await categoryTabs.count();

    const hasCategories = count > 1;
    if (hasCategories) {
      const secondTab = categoryTabs.nth(1);
      await secondTab.click();
      await page.waitForTimeout(300);

      const span = secondTab.locator("span[data-selected]");
      const selected = await span.getAttribute("data-selected");
      expect(selected).toBe("true");
    }
  });

  test("categories are displayed in pills/tabs format", async ({ page }) => {
    const todosTab = page.getByText("Todos", { exact: true });
    await expect(todosTab).toBeVisible();

    const className = await todosTab.getAttribute("class");
    expect(className).toContain("rounded-full");
  });
});
