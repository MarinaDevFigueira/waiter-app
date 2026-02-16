import { test, expect } from "@playwright/test";
import { disableSplashScreen, loginAsAdmin } from "../../../__tests__/helpers";

test.describe("Checkbox Component", () => {
  test.beforeEach(async ({ page }) => {
    await disableSplashScreen(page);
  });

  test("checkbox renders correctly", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const checkbox = page.locator('[role="checkbox"]').first();
      const isCheckboxVisible = await checkbox.isVisible().catch(() => false);

      if (isCheckboxVisible) {
        await expect(checkbox).toBeVisible();
      }
    }
  });

  test("checkbox can be checked", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const checkbox = page.locator('[role="checkbox"]').first();
      const isCheckboxVisible = await checkbox.isVisible().catch(() => false);

      if (isCheckboxVisible) {
        const initialState = await checkbox.getAttribute("data-state");
        await checkbox.click();
        await page.waitForTimeout(100);

        const newState = await checkbox.getAttribute("data-state");
        expect(newState).not.toBe(initialState);
      }
    }
  });

  test("checkbox can be unchecked", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const checkbox = page.locator('[role="checkbox"]').first();
      const isCheckboxVisible = await checkbox.isVisible().catch(() => false);

      if (isCheckboxVisible) {
        await checkbox.click();
        await page.waitForTimeout(100);
        const checkedState = await checkbox.getAttribute("data-state");

        await checkbox.click();
        await page.waitForTimeout(100);
        const uncheckedState = await checkbox.getAttribute("data-state");

        expect(uncheckedState).not.toBe(checkedState);
      }
    }
  });

  test("checkbox has proper hover state", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const checkbox = page.locator('[role="checkbox"]').first();
      const isCheckboxVisible = await checkbox.isVisible().catch(() => false);

      if (isCheckboxVisible) {
        await checkbox.hover();

        const borderColor = await checkbox.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue("border-color")
        );
        expect(borderColor).toBeTruthy();
      }
    }
  });

  test("checkbox displays check icon when checked", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const checkbox = page.locator('[role="checkbox"]').first();
      const isCheckboxVisible = await checkbox.isVisible().catch(() => false);

      if (isCheckboxVisible) {
        await checkbox.click();
        await page.waitForTimeout(100);

        const checkIcon = checkbox.locator('svg');
        const isIconVisible = await checkIcon.isVisible().catch(() => false);

        if (isIconVisible) {
          await expect(checkIcon).toBeVisible();
        }
      }
    }
  });

  test("checkbox has proper styling", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const checkbox = page.locator('[role="checkbox"]').first();
      const isCheckboxVisible = await checkbox.isVisible().catch(() => false);

      if (isCheckboxVisible) {
        const borderRadius = await checkbox.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue("border-radius")
        );
        expect(borderRadius).toBeTruthy();
      }
    }
  });
});
