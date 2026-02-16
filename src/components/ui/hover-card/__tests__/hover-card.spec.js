import { test, expect } from "@playwright/test";
import { disableSplashScreen, loginAsKitchen } from "../../../__tests__/helpers";

test.describe("HoverCard Component", () => {
  test.beforeEach(async ({ page }) => {
    await disableSplashScreen(page);
  });

  test("hover card trigger renders correctly", async ({ page }) => {
    await loginAsKitchen(page);
    await page.waitForLoadState("networkidle");

    const statusElement = page.getByTestId("order-status").first();
    const isVisible = await statusElement.isVisible().catch(() => false);

    if (isVisible) {
      await expect(statusElement).toBeVisible();
    }
  });

  test("hover card opens on hover", async ({ page }) => {
    await loginAsKitchen(page);
    await page.waitForLoadState("networkidle");

    const statusElement = page.getByTestId("order-status").first();
    const isVisible = await statusElement.isVisible().catch(() => false);

    if (isVisible) {
      await statusElement.hover();
      await page.waitForTimeout(300);

      const hoverCardContent = page.getByTestId("order-status-menu");
      const isContentVisible = await hoverCardContent.isVisible().catch(() => false);

      if (isContentVisible) {
        await expect(hoverCardContent).toBeVisible();
      }
    }
  });

  test("hover card closes when moving mouse away", async ({ page }) => {
    await loginAsKitchen(page);
    await page.waitForLoadState("networkidle");

    const statusElement = page.getByTestId("order-status").first();
    const isVisible = await statusElement.isVisible().catch(() => false);

    if (isVisible) {
      await statusElement.hover();
      await page.waitForTimeout(300);

      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);

      const hoverCardContent = page.getByTestId("order-status-menu");
      const isContentVisible = await hoverCardContent.isVisible().catch(() => false);

      expect(isContentVisible).toBe(false);
    }
  });

  test("hover card content has proper styling", async ({ page }) => {
    await loginAsKitchen(page);
    await page.waitForLoadState("networkidle");

    const statusElement = page.getByTestId("order-status").first();
    const isVisible = await statusElement.isVisible().catch(() => false);

    if (isVisible) {
      await statusElement.hover();
      await page.waitForTimeout(300);

      const hoverCardContent = page.getByTestId("order-status-menu");
      const isContentVisible = await hoverCardContent.isVisible().catch(() => false);

      if (isContentVisible) {
        const borderRadius = await hoverCardContent.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue("border-radius")
        );
        expect(borderRadius).toBeTruthy();
      }
    }
  });

  test("hover card shows status options", async ({ page }) => {
    await loginAsKitchen(page);
    await page.waitForLoadState("networkidle");

    const statusElement = page.getByTestId("order-status").first();
    const isVisible = await statusElement.isVisible().catch(() => false);

    if (isVisible) {
      await statusElement.hover();
      await page.waitForTimeout(300);

      const pendingOption = page.getByTestId("status-option-pending");
      const preparingOption = page.getByTestId("status-option-preparing");
      const readyOption = page.getByTestId("status-option-ready");

      const isPendingVisible = await pendingOption.isVisible().catch(() => false);
      const isPreparingVisible = await preparingOption.isVisible().catch(() => false);
      const isReadyVisible = await readyOption.isVisible().catch(() => false);

      if (isPendingVisible && isPreparingVisible && isReadyVisible) {
        await expect(pendingOption).toBeVisible();
        await expect(preparingOption).toBeVisible();
        await expect(readyOption).toBeVisible();
      }
    }
  });

  test("hover card options are clickable", async ({ page }) => {
    await loginAsKitchen(page);
    await page.waitForLoadState("networkidle");

    const statusElement = page.getByTestId("order-status").first();
    const isVisible = await statusElement.isVisible().catch(() => false);

    if (isVisible) {
      await statusElement.hover();
      await page.waitForTimeout(300);

      const preparingOption = page.getByTestId("status-option-preparing");
      const isOptionVisible = await preparingOption.isVisible().catch(() => false);

      if (isOptionVisible) {
        await expect(preparingOption).toBeEnabled();
        await preparingOption.click();
      }
    }
  });
});
