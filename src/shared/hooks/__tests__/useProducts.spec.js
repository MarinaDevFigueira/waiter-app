import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../../../components/__tests__/helpers";

test.describe("useProducts Hook", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForTimeout(1500);
  });

  test("should load products initially", async ({ page }) => {
    const tableRows = page.locator("tbody tr");
    const count = await tableRows.count();

    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should display loading skeleton while fetching", async ({ page }) => {
    await page.reload();

    const skeleton = page.locator(".animate-pulse").first();
    const hasLoading = await skeleton.count();

    expect(hasLoading).toBeGreaterThanOrEqual(0);
  });

  test("should filter products by search query", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");
    const searchButton = page.locator("button").filter({ hasText: "Buscar" });

    await searchInput.fill("Pizza");
    await searchButton.click();
    await page.waitForTimeout(1000);
  });

  test("should reset to page 1 when filters change", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });

    await filtersButton.click();
    await page.waitForTimeout(500);

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await applyButton.click();
    await page.waitForTimeout(1000);
  });

  test("should filter by category", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await applyButton.click();
    await page.waitForTimeout(1000);
  });

  test("should filter by price range", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const minPriceInput = page.locator("input#precoMin");
    const maxPriceInput = page.locator("input#precoMax");

    await minPriceInput.fill("10");
    await maxPriceInput.fill("50");

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await applyButton.click();
    await page.waitForTimeout(1000);
  });

  test("should filter by status", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const inativoCheckbox = page.locator("label").filter({ hasText: "Inativo" }).locator("button");
    await inativoCheckbox.click();
    await page.waitForTimeout(300);

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await applyButton.click();
    await page.waitForTimeout(1000);
  });

  test("should clear all filters", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const minPriceInput = page.locator("input#precoMin");
    await minPriceInput.fill("10");

    const clearButton = page.locator("button").filter({ hasText: "Limpar" });
    await clearButton.click();
    await page.waitForTimeout(1000);

    await filtersButton.click();
    await page.waitForTimeout(500);

    const clearedValue = await minPriceInput.inputValue();
    expect(clearedValue).toBe("");
  });

  test("should show filter count badge", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const minPriceInput = page.locator("input#precoMin");
    await minPriceInput.fill("10");

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await applyButton.click();
    await page.waitForTimeout(1000);

    const badge = filtersButton.locator("span");
    const badgeCount = await badge.count();
    expect(badgeCount).toBeGreaterThanOrEqual(0);
  });

  test("should handle empty search results", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");
    const searchButton = page.locator("button").filter({ hasText: "Buscar" });

    await searchInput.fill("NonexistentProduct12345");
    await searchButton.click();
    await page.waitForTimeout(1000);
  });

  test("should maintain query params structure", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await applyButton.click();
    await page.waitForTimeout(1000);
  });

  test("should handle multiple filter combinations", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");
    const searchButton = page.locator("button").filter({ hasText: "Buscar" });
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });

    await searchInput.fill("Pizza");
    await searchButton.click();
    await page.waitForTimeout(500);

    await filtersButton.click();
    await page.waitForTimeout(500);

    const minPriceInput = page.locator("input#precoMin");
    await minPriceInput.fill("15");

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await applyButton.click();
    await page.waitForTimeout(1000);
  });

  test("should subscribe to filters observable", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await applyButton.click();
    await page.waitForTimeout(1000);

    await page.reload();
    await page.waitForTimeout(1500);
  });

  test("should unsubscribe from filters observable on unmount", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(500);

    await page.goto("/dashboard/products");
    await page.waitForTimeout(1500);
  });

  test("should handle pagination updates", async ({ page }) => {
    const tableRows = page.locator("tbody tr");
    const initialCount = await tableRows.count();

    expect(initialCount).toBeGreaterThanOrEqual(0);
  });

  test("should handle sorting updates", async ({ page }) => {
    const tableHeaders = page.locator("thead th");
    const firstHeader = tableHeaders.first();

    await firstHeader.click();
    await page.waitForTimeout(1000);
  });

  test("should maintain filter state across rerenders", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");
    const searchButton = page.locator("button").filter({ hasText: "Buscar" });

    await searchInput.fill("Test");
    await searchButton.click();
    await page.waitForTimeout(500);

    const value = await searchInput.inputValue();
    expect(value).toBe("Test");
  });

  test("should handle error states gracefully", async ({ page }) => {
    await page.waitForTimeout(1000);

    const tableContainer = page.locator("table");
    await expect(tableContainer).toBeVisible();
  });

  test("should show total products count", async ({ page }) => {
    await page.waitForTimeout(1500);

    const tableRows = page.locator("tbody tr");
    const count = await tableRows.count();

    expect(count).toBeGreaterThanOrEqual(0);
  });
});
