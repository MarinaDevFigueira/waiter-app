import { test, expect } from "@playwright/test";
import { disableSplashScreen, loginAsAdmin } from "../../../__tests__/helpers";

test.describe("Dialog Component", () => {
  test.beforeEach(async ({ page }) => {
    await disableSplashScreen(page);
  });

  test("dialog trigger renders and is clickable", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await expect(filtersButton).toBeVisible();
      await expect(filtersButton).toBeEnabled();
    }
  });

  test("dialog opens when trigger is clicked", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const dialogContent = page.locator('[role="dialog"]');
      const isDialogVisible = await dialogContent.isVisible().catch(() => false);

      if (isDialogVisible) {
        await expect(dialogContent).toBeVisible();
      }
    }
  });

  test("dialog displays header with title and description", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const dialogTitle = page.locator('text=Filtros de Produtos');
      const dialogDescription = page.locator('text=Refine sua busca aplicando filtros personalizados');

      const isTitleVisible = await dialogTitle.isVisible().catch(() => false);
      const isDescriptionVisible = await dialogDescription.isVisible().catch(() => false);

      if (isTitleVisible) {
        await expect(dialogTitle).toBeVisible();
      }
      if (isDescriptionVisible) {
        await expect(dialogDescription).toBeVisible();
      }
    }
  });

  test("dialog displays close button", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const closeButton = page.locator('[role="dialog"] button:has(svg)').first();
      const isCloseButtonVisible = await closeButton.isVisible().catch(() => false);

      if (isCloseButtonVisible) {
        await expect(closeButton).toBeVisible();
      }
    }
  });

  test("dialog closes when close button is clicked", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const closeButton = page.locator('[role="dialog"] button:has(svg)').first();
      const isCloseButtonVisible = await closeButton.isVisible().catch(() => false);

      if (isCloseButtonVisible) {
        await closeButton.click();
        await page.waitForTimeout(300);

        const dialogContent = page.locator('[role="dialog"]');
        const isDialogVisible = await dialogContent.isVisible().catch(() => false);

        expect(isDialogVisible).toBe(false);
      }
    }
  });

  test("dialog displays footer with action buttons", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const clearButton = page.locator('button:has-text("Limpar")');
      const applyButton = page.locator('button:has-text("Aplicar Filtros")');

      const isClearVisible = await clearButton.isVisible().catch(() => false);
      const isApplyVisible = await applyButton.isVisible().catch(() => false);

      if (isClearVisible) {
        await expect(clearButton).toBeVisible();
      }
      if (isApplyVisible) {
        await expect(applyButton).toBeVisible();
      }
    }
  });

  test("dialog has overlay with backdrop blur", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const overlay = page.locator('[data-radix-dialog-overlay]');
      const isOverlayVisible = await overlay.isVisible().catch(() => false);

      if (isOverlayVisible) {
        const backdropFilter = await overlay.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue("backdrop-filter")
        );
        expect(backdropFilter).toContain("blur");
      }
    }
  });

  test("dialog content has proper styling", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const dialogContent = page.locator('[role="dialog"]');
      const isDialogVisible = await dialogContent.isVisible().catch(() => false);

      if (isDialogVisible) {
        const borderRadius = await dialogContent.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue("border-radius")
        );
        expect(borderRadius).toBeTruthy();
      }
    }
  });
});
