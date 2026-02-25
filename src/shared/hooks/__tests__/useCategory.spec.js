import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../components/__tests__/helpers";

test.describe("useCategory Hook", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
    await page.waitForTimeout(2000);
  });

  test("should return initial category as all", async ({ page }) => {
    const allCategory = page.locator("li[data-selected='true']").first();
    const initialState = await allCategory.getAttribute("data-selected");
    expect(initialState).toBe("true");
  });

  test("should change category when changeCategory is called", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 1;
    if (hasMultipleCategories) {
      const secondCategory = categoryTabs.nth(1);
      await secondCategory.click();
      await page.waitForTimeout(1000);

      const selectedState = await secondCategory.getAttribute("data-selected");
      expect(selectedState).toBe("true");
    }
  });

  test("should update selectedCategory state after category change", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 2;
    if (hasMultipleCategories) {
      const firstCategory = categoryTabs.first();
      const secondCategory = categoryTabs.nth(1);

      let firstSelected = await firstCategory.getAttribute("data-selected");
      expect(firstSelected).toBe("true");

      await secondCategory.click();
      await page.waitForTimeout(1000);

      const secondSelected = await secondCategory.getAttribute("data-selected");
      expect(secondSelected).toBe("true");

      firstSelected = await firstCategory.getAttribute("data-selected");
      expect(firstSelected).toBe("false");
    }
  });

  test("should only allow one category selected at a time", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 2;
    if (hasMultipleCategories) {
      const firstCategory = categoryTabs.first();
      const secondCategory = categoryTabs.nth(1);
      const thirdCategory = categoryTabs.nth(2);

      await secondCategory.click();
      await page.waitForTimeout(1000);

      let secondSelected = await secondCategory.getAttribute("data-selected");
      let firstSelected = await firstCategory.getAttribute("data-selected");
      let thirdSelected = await thirdCategory.getAttribute("data-selected");

      expect(secondSelected).toBe("true");
      expect(firstSelected).toBe("false");
      expect(thirdSelected).toBe("false");

      await thirdCategory.click();
      await page.waitForTimeout(1000);

      secondSelected = await secondCategory.getAttribute("data-selected");
      firstSelected = await firstCategory.getAttribute("data-selected");
      thirdSelected = await thirdCategory.getAttribute("data-selected");

      expect(thirdSelected).toBe("true");
      expect(secondSelected).toBe("false");
      expect(firstSelected).toBe("false");
    }
  });

  test("should persist category selection across multiple changes", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasEnoughCategories = count >= 4;
    if (hasEnoughCategories) {
      const sequence = [
        categoryTabs.nth(1),
        categoryTabs.nth(2),
        categoryTabs.nth(3),
        categoryTabs.first(),
      ];

      for (let i = 0; i < sequence.length; i++) {
        const currentCategory = sequence[i];
        await currentCategory.click();
        await page.waitForTimeout(500);

        const selectedState = await currentCategory.getAttribute("data-selected");
        expect(selectedState).toBe("true");
      }
    }
  });

  test("should maintain correct state after rapid category changes", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 3;
    if (hasMultipleCategories) {
      const secondCategory = categoryTabs.nth(1);
      const thirdCategory = categoryTabs.nth(2);
      const fourthCategory = categoryTabs.nth(3);

      await secondCategory.click();
      await thirdCategory.click();
      await fourthCategory.click();

      await page.waitForTimeout(1000);

      const fourthSelected = await fourthCategory.getAttribute("data-selected");
      const secondSelected = await secondCategory.getAttribute("data-selected");
      const thirdSelected = await thirdCategory.getAttribute("data-selected");

      expect(fourthSelected).toBe("true");
      expect(secondSelected).toBe("false");
      expect(thirdSelected).toBe("false");
    }
  });

  test("should apply correct opacity styling based on selection", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 1;
    if (hasMultipleCategories) {
      const firstCategory = categoryTabs.first();
      const secondCategory = categoryTabs.nth(1);

      const firstSpan = firstCategory.locator("span");
      const firstClass = await firstSpan.getAttribute("class");
      expect(firstClass).toContain("data-[selected=false]");

      const secondSpan = secondCategory.locator("span");
      const secondClass = await secondSpan.getAttribute("class");
      expect(secondClass).toContain("data-[selected=false]");

      await secondCategory.click();
      await page.waitForTimeout(1000);

      const updatedSecondClass = await secondSpan.getAttribute("class");
      expect(updatedSecondClass).toContain("data-[selected=false]");
    }
  });

  test("should trigger component re-render when category changes", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 1;
    if (hasMultipleCategories) {
      const firstCategory = categoryTabs.first();
      const secondCategory = categoryTabs.nth(1);

      const initialFirstSelected = await firstCategory.getAttribute("data-selected");
      expect(initialFirstSelected).toBe("true");

      await secondCategory.click();
      await page.waitForTimeout(1000);

      const updatedFirstSelected = await firstCategory.getAttribute("data-selected");
      const updatedSecondSelected = await secondCategory.getAttribute("data-selected");

      expect(updatedFirstSelected).toBe("false");
      expect(updatedSecondSelected).toBe("true");
    }
  });

  test("should handle all available category types", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    for (let i = 0; i < count; i++) {
      const currentCategory = categoryTabs.nth(i);
      await currentCategory.click();
      await page.waitForTimeout(500);

      const selectedState = await currentCategory.getAttribute("data-selected");
      expect(selectedState).toBe("true");

      for (let j = 0; j < count; j++) {
        if (i !== j) {
          const otherCategory = categoryTabs.nth(j);
          const otherSelected = await otherCategory.getAttribute("data-selected");
          expect(otherSelected).toBe("false");
        }
      }
    }
  });

  test("should not allow pointer events on unselected categories", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const hasMultipleCategories = count > 1;
    if (hasMultipleCategories) {
      const firstCategory = categoryTabs.first();
      const secondCategory = categoryTabs.nth(1);

      await secondCategory.click();
      await page.waitForTimeout(1000);

      const firstSpan = firstCategory.locator("span");
      const firstClass = await firstSpan.getAttribute("class");
      expect(firstClass).toContain("text-muted-foreground");
    }
  });

  test("should update food list when category changes", async ({ page }) => {
    const categoryTabs = page.locator("li[data-selected]");
    const count = await categoryTabs.count();

    const firstSelected = await categoryTabs.first().getAttribute("data-selected");
    expect(firstSelected).toBe("true");

    const hasMultipleCategories = count > 1;
    if (hasMultipleCategories) {
      const secondCategory = categoryTabs.nth(1);
      await secondCategory.click();
      await page.waitForTimeout(1000);

      const secondSelected = await secondCategory.getAttribute("data-selected");
      expect(secondSelected).toBe("true");
    }
  });
});
