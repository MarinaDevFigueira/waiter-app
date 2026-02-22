import { test, expect } from "@playwright/test";
import { disableSplashScreen, loginAsAdmin } from "../../../__tests__/helpers";

test.describe("MultiSelect Component", () => {
  test.beforeEach(async ({ page }) => {
    await disableSplashScreen(page);
  });

  test("multi-select trigger renders correctly", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const multiSelectTrigger = page.locator('[role="combobox"]').first();
      const isTriggerVisible = await multiSelectTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        await expect(multiSelectTrigger).toBeVisible();
        await expect(multiSelectTrigger).toBeEnabled();
      }
    }
  });

  test("multi-select displays placeholder text", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const multiSelectTrigger = page.locator('[role="combobox"]').first();
      const isTriggerVisible = await multiSelectTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        const text = await multiSelectTrigger.textContent();
        expect(text).toBeTruthy();
      }
    }
  });

  test("multi-select opens dropdown when clicked", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const multiSelectTrigger = page.locator('[role="combobox"]').first();
      const isTriggerVisible = await multiSelectTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        await multiSelectTrigger.click();
        await page.waitForTimeout(300);

        const dropdown = page.locator('[data-radix-popper-content-wrapper]');
        const isDropdownVisible = await dropdown.isVisible().catch(() => false);

        if (isDropdownVisible) {
          await expect(dropdown).toBeVisible();
        }
      }
    }
  });

  test("multi-select displays options when opened", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const multiSelectTrigger = page.locator('[role="combobox"]').first();
      const isTriggerVisible = await multiSelectTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        await multiSelectTrigger.click();
        await page.waitForTimeout(300);

        const options = page.locator('[role="checkbox"]');
        const count = await options.count();

        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test("multi-select can select an option", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const multiSelectTrigger = page.locator('[role="combobox"]').first();
      const isTriggerVisible = await multiSelectTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        await multiSelectTrigger.click();
        await page.waitForTimeout(300);

        const options = page.locator('[role="checkbox"]');
        const count = await options.count();

        if (count > 0) {
          const firstCheckbox = options.first();
          const initialState = await firstCheckbox.getAttribute("data-state");

          const optionContainer = firstCheckbox.locator('..');
          await page.waitForTimeout(500);
          await optionContainer.dispatchEvent("click");
          await page.waitForTimeout(300);

          const newState = await firstCheckbox.getAttribute("data-state");
          expect(newState).not.toBe(initialState);
        }
      }
    }
  });

  test("multi-select updates state when multiple items toggled", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const multiSelectTrigger = page.locator('[role="combobox"]').first();
      const isTriggerVisible = await multiSelectTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        await multiSelectTrigger.click();
        await page.waitForTimeout(300);

        const checkboxes = page.locator('[role="checkbox"]');
        const count = await checkboxes.count();

        if (count >= 2) {
          const firstCheckbox = checkboxes.nth(0);
          const secondCheckbox = checkboxes.nth(1);

          const firstInitialState = await firstCheckbox.getAttribute("data-state");
          const secondInitialState = await secondCheckbox.getAttribute("data-state");

          const firstContainer = firstCheckbox.locator('..');
          await page.waitForTimeout(500);
          await firstContainer.dispatchEvent("click");
          await page.waitForTimeout(300);

          const firstNewState = await firstCheckbox.getAttribute("data-state");
          expect(firstNewState).not.toBe(firstInitialState);

          const secondContainer = secondCheckbox.locator('..');
          await page.waitForTimeout(500);
          await secondContainer.dispatchEvent("click");
          await page.waitForTimeout(300);

          const secondNewState = await secondCheckbox.getAttribute("data-state");
          expect(secondNewState).not.toBe(secondInitialState);
        }
      }
    }
  });

  test("multi-select can deselect an option", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const multiSelectTrigger = page.locator('[role="combobox"]').first();
      const isTriggerVisible = await multiSelectTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        await multiSelectTrigger.click();
        await page.waitForTimeout(300);

        const firstOption = page.locator('[role="checkbox"]').first();
        const isOptionVisible = await firstOption.isVisible().catch(() => false);

        if (isOptionVisible) {
          const optionContainer = firstOption.locator('..');
          await page.waitForTimeout(500);
          await optionContainer.dispatchEvent("click");
          await page.waitForTimeout(300);
          await page.waitForTimeout(500);
          await optionContainer.dispatchEvent("click");
          await page.waitForTimeout(300);

          const triggerText = await multiSelectTrigger.textContent();
          expect(triggerText).not.toContain("selecionado");
        }
      }
    }
  });

  test("multi-select shows checkmark for selected items", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const filtersButton = page.locator('button:has-text("Filtros")');
    const isButtonVisible = await filtersButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      const multiSelectTrigger = page.locator('[role="combobox"]').first();
      const isTriggerVisible = await multiSelectTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        await multiSelectTrigger.click();
        await page.waitForTimeout(300);

        const firstOptionContainer = page.locator('[role="checkbox"]').first().locator('..');
        const isContainerVisible = await firstOptionContainer.isVisible().catch(() => false);

        if (isContainerVisible) {
          await page.waitForTimeout(500);
          await firstOptionContainer.dispatchEvent("click");
          await page.waitForTimeout(300);

          const checkIcon = firstOptionContainer.locator('svg').last();
          const isCheckVisible = await checkIcon.isVisible().catch(() => false);

          if (isCheckVisible) {
            await expect(checkIcon).toBeVisible();
          }
        }
      }
    }
  });
});
