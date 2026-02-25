import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "@/components/__tests__/helpers";

test.describe("Combobox", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator("tbody tr").first();
    const editButton = firstRow.locator("button").last();
    await editButton.click();

    await page.waitForSelector("[role='dialog']", { state: "visible", timeout: 10000 });
  });

  test("combobox trigger button is visible in product form", async ({ page }) => {
    const dialog = page.locator("[role='dialog']");
    const comboboxButton = dialog.locator("button[data-open]").first();
    await expect(comboboxButton).toBeVisible({ timeout: 5000 });
  });

  test("combobox opens dropdown on click", async ({ page }) => {
    const dialog = page.locator("[role='dialog']");
    const comboboxButton = dialog.locator("button[data-open]").first();

    await comboboxButton.click();
    await page.waitForTimeout(300);

    const openAttr = await comboboxButton.getAttribute("data-open");
    expect(openAttr).toBe("true");
  });

  test("combobox dropdown shows search input", async ({ page }) => {
    const dialog = page.locator("[role='dialog']");
    const comboboxButton = dialog.locator("button[data-open]").first();

    await comboboxButton.click();
    await page.waitForTimeout(300);

    const searchInput = dialog.locator("input[type='text']").first();
    await expect(searchInput).toBeVisible();
  });

  test("combobox search filters options", async ({ page }) => {
    const dialog = page.locator("[role='dialog']");
    const comboboxButton = dialog.locator("button[data-open]").first();

    await comboboxButton.click();
    await page.waitForTimeout(300);

    const searchInput = dialog.locator("input[type='text']").first();
    await searchInput.fill("zzz_no_match_xyz");
    await page.waitForTimeout(300);

    const noResultsText = dialog.locator("div[class*='text-center']").first();
    await expect(noResultsText).toBeVisible();
  });

  test("combobox closes dropdown when option is selected", async ({ page }) => {
    const dialog = page.locator("[role='dialog']");
    const comboboxButton = dialog.locator("button[data-open]").first();

    await comboboxButton.click();
    await page.waitForTimeout(300);

    const firstOption = dialog.locator("div[class*='overflow-auto'] button[type='button']").first();
    const hasOption = await firstOption.count();

    if (hasOption > 0) {
      await firstOption.click();
      await page.waitForTimeout(300);

      const openAttr = await comboboxButton.getAttribute("data-open");
      expect(openAttr).toBe("false");
    }
  });

  test("combobox closes when clicking outside", async ({ page }) => {
    const dialog = page.locator("[role='dialog']");
    const comboboxButton = dialog.locator("button[data-open]").first();

    await comboboxButton.click();
    await page.waitForTimeout(300);

    const openAttr = await comboboxButton.getAttribute("data-open");
    expect(openAttr).toBe("true");

    await page.locator("[role='dialog'] h2").click();
    await page.waitForTimeout(300);

    const closedAttr = await comboboxButton.getAttribute("data-open");
    expect(closedAttr).toBe("false");
  });

  test("combobox shows selected option label after selection", async ({ page }) => {
    const dialog = page.locator("[role='dialog']");
    const comboboxButton = dialog.locator("button[data-open]").first();

    const buttonLabelBeforeElement = comboboxButton.locator("span").first();
    const buttonLabelBefore = await buttonLabelBeforeElement.textContent();
    const trimmedButtonLabelBefore = buttonLabelBefore.trim();

    await comboboxButton.click();
    await page.waitForTimeout(300);

    const allOptions = dialog.locator("div[class*='overflow-auto'] button[type='button']");
    const optionCount = await allOptions.count();

    if (optionCount > 0) {
      const firstOption = allOptions.first();
      await expect(firstOption).toBeVisible();
      await firstOption.click();
      await page.waitForTimeout(500);

      const buttonLabelAfterElement = comboboxButton.locator("span").first();
      const buttonLabelAfter = await buttonLabelAfterElement.textContent();
      const trimmedButtonLabelAfter = buttonLabelAfter.trim();

      const labelChanged = trimmedButtonLabelAfter !== trimmedButtonLabelBefore;
      expect(labelChanged).toBe(true);
    }
  });

  test("combobox selected option has check icon highlighted", async ({ page }) => {
    const dialog = page.locator("[role='dialog']");
    const comboboxButton = dialog.locator("button[data-open]").first();

    await comboboxButton.click();
    await page.waitForTimeout(300);

    const firstOption = dialog.locator("div[class*='overflow-auto'] button[type='button']").first();
    const hasOption = await firstOption.count();

    if (hasOption > 0) {
      await firstOption.click();
      await page.waitForTimeout(300);

      await comboboxButton.click();
      await page.waitForTimeout(300);

      const selectedOption = dialog.locator("div[class*='overflow-auto'] button[class*='bg-muted']").first();
      await expect(selectedOption).toBeVisible();
    }
  });
});

test.describe("Combobox — categories page", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/categories/");
    await page.waitForLoadState("networkidle");
  });

  test("new category button opens form dialog", async ({ page }) => {
    const newButton = page.getByTestId("new-category-button");
    await expect(newButton).toBeVisible({ timeout: 10000 });

    await newButton.click();
    await page.waitForSelector("[role='dialog']", { state: "visible", timeout: 5000 });

    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();
  });

  test("category form has name, description, sort order and active fields", async ({ page }) => {
    const newButton = page.getByTestId("new-category-button");
    await newButton.click();
    await page.waitForSelector("[role='dialog']", { state: "visible", timeout: 5000 });

    const dialog = page.locator("[role='dialog']");

    const nameInput = dialog.locator("input#name");
    await expect(nameInput).toBeVisible();

    const descriptionTextarea = dialog.locator("textarea#description");
    await expect(descriptionTextarea).toBeVisible();

    const sortOrderInput = dialog.locator("input#sortOrder");
    await expect(sortOrderInput).toBeVisible();

    const activeCheckbox = dialog.locator("input#active");
    await expect(activeCheckbox).toBeVisible();
  });
});
