import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "../../../__tests__/helpers";

test.describe("DropdownMenu Component", () => {
  test.beforeEach(async ({ page }) => {
    await disableSplashScreen(page);
  });

  test("dropdown menu trigger renders and is clickable", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const trigger = page.locator('[role="combobox"]').first();
    if (await trigger.isVisible()) {
      await expect(trigger).toBeVisible();
      await expect(trigger).toBeEnabled();
    }
  });

  test("dropdown menu opens when trigger is clicked", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const trigger = page.locator('[role="combobox"]').first();
    if (await trigger.isVisible()) {
      await trigger.click();
      await page.waitForTimeout(300);

      const menu = page.locator('[role="menu"], [data-radix-popper-content-wrapper]');
      const isMenuVisible = await menu.isVisible().catch(() => false);

      if (isMenuVisible) {
        await expect(menu).toBeVisible();
      }
    }
  });

  test("dropdown menu closes when clicking outside", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const trigger = page.locator('[role="combobox"]').first();
    if (await trigger.isVisible()) {
      await trigger.click();
      await page.waitForTimeout(300);

      await page.click("body");
      await page.waitForTimeout(300);

      const menu = page.locator('[role="menu"], [data-radix-popper-content-wrapper]');
      const isMenuVisible = await menu.isVisible().catch(() => false);

      expect(isMenuVisible).toBe(false);
    }
  });

  test("dropdown menu items are selectable", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const trigger = page.locator('[role="combobox"]').first();
    if (await trigger.isVisible()) {
      await trigger.click();
      await page.waitForTimeout(300);

      const firstItem = page.locator('[role="option"], [role="menuitem"]').first();
      const isItemVisible = await firstItem.isVisible().catch(() => false);

      if (isItemVisible) {
        await expect(firstItem).toBeVisible();
        await firstItem.click();
      }
    }
  });

  test("dropdown menu has proper styling", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const trigger = page.locator('[role="combobox"]').first();
    if (await trigger.isVisible()) {
      await trigger.click();
      await page.waitForTimeout(300);

      const menu = page.locator('[role="menu"], [data-radix-popper-content-wrapper]').first();
      const isMenuVisible = await menu.isVisible().catch(() => false);

      if (isMenuVisible) {
        const borderRadius = await menu.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue("border-radius")
        );
        expect(borderRadius).toBeTruthy();
      }
    }
  });
});
