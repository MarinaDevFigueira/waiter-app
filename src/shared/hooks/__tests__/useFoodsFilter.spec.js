import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../components/__tests__/helpers";

test.describe("Food Filtering by Category", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
    await page.waitForTimeout(2000);
  });

  test("should display all category by default", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const firstCategory = categoryTabs.first();
    await expect(firstCategory).toHaveAttribute("data-selected", "true");
  });

  test("should switch to second category when clicked", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 1;
    if (hasMultipleCategories) {
      const secondCategory = categoryTabs.nth(1);
      await secondCategory.click();
      await page.waitForTimeout(1000);

      await expect(secondCategory).toHaveAttribute("data-selected", "true");
    }
  });

  test("should switch to third category when clicked", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasThirdCategory = count > 2;
    if (hasThirdCategory) {
      const thirdCategory = categoryTabs.nth(2);
      await thirdCategory.click();
      await page.waitForTimeout(1000);

      await expect(thirdCategory).toHaveAttribute("data-selected", "true");
    }
  });

  test("should switch to fourth category when clicked", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasFourthCategory = count > 3;
    if (hasFourthCategory) {
      const fourthCategory = categoryTabs.nth(3);
      await fourthCategory.click();
      await page.waitForTimeout(1000);

      await expect(fourthCategory).toHaveAttribute("data-selected", "true");
    }
  });

  test("only one category should be selected at a time", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 1;
    if (hasMultipleCategories) {
      const firstCategory = categoryTabs.first();
      const secondCategory = categoryTabs.nth(1);

      await secondCategory.click();
      await page.waitForTimeout(1000);

      await expect(secondCategory).toHaveAttribute("data-selected", "true");
      await expect(firstCategory).toHaveAttribute("data-selected", "false");
    }
  });

  test("should maintain category selection after switching multiple times", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 2;
    if (hasMultipleCategories) {
      const firstCategory = categoryTabs.first();
      const secondCategory = categoryTabs.nth(1);
      const thirdCategory = categoryTabs.nth(2);

      await secondCategory.click();
      await page.waitForTimeout(500);
      await thirdCategory.click();
      await page.waitForTimeout(500);
      await firstCategory.click();
      await page.waitForTimeout(500);

      await expect(firstCategory).toHaveAttribute("data-selected", "true");
      await expect(secondCategory).toHaveAttribute("data-selected", "false");
      await expect(thirdCategory).toHaveAttribute("data-selected", "false");
    }
  });

  test("all categories should be clickable", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    for (let i = 0; i < count; i++) {
      const categoryItem = categoryTabs.nth(i);
      await categoryItem.click();
      await page.waitForTimeout(500);
      await expect(categoryItem).toHaveAttribute("data-selected", "true");
    }
  });
});
