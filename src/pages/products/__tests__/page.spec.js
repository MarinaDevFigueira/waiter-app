import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "@/components/__tests__/helpers";

test.describe("ProductsPage", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("networkidle");

    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 10000 });

    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    const nameCell = firstRow.locator("td").first();
    const productName = nameCell.locator(".font-medium");
    await expect(productName).not.toBeEmpty({ timeout: 15000 });
  });

  test("renders products page", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /produtos/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("displays page title", async ({ page }) => {
    const title = page.getByRole("heading", { name: /produtos/i });
    await expect(title).toBeVisible({ timeout: 10000 });

    const classes = await title.getAttribute("class");
    expect(classes).toContain("text-3xl");
    expect(classes).toContain("font-bold");
  });

  test("displays page description", async ({ page }) => {
    const description = page.getByText(/gerencie o catálogo de produtos do restaurante/i);
    await expect(description).toBeVisible({ timeout: 10000 });

    const classes = await description.getAttribute("class");
    expect(classes).toContain("text-muted-foreground");
  });

  test("displays products filters section", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /produtos/i });
    await expect(heading).toBeVisible({ timeout: 10000 });

    const filtersContainer = page.locator('[class*="flex"][class*="flex-col"]').first();
    await expect(filtersContainer).toBeVisible({ timeout: 10000 });
  });

  test("displays products table when data is loaded", async ({ page }) => {
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test("page has correct layout structure", async ({ page }) => {
    const mainContainer = page.locator('[class*="flex"][class*="flex-col"]').first();
    await expect(mainContainer).toBeVisible({ timeout: 10000 });
  });

  test("page layout has correct spacing", async ({ page }) => {
    const mainContainer = page.locator('div.flex.flex-col.h-full').first();
    await expect(mainContainer).toBeVisible({ timeout: 10000 });
    const classes = await mainContainer.getAttribute("class");
    const hasGapClass = classes.includes("gap-");
    expect(hasGapClass).toBe(true);
  });

  test("displays product rows in table", async ({ page }) => {
    const tbody = page.locator("tbody");
    const rows = tbody.locator("tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("products have names displayed", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const nameCell = firstRow.locator("td").first();
    const productName = nameCell.locator(".font-medium");

    await expect(productName).toBeVisible({ timeout: 10000 });
    const text = await productName.textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  test("products have descriptions displayed", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const nameCell = firstRow.locator("td").first();
    const productDescription = nameCell.locator(".text-muted-foreground");

    await expect(productDescription).toBeVisible({ timeout: 10000 });
  });

  test("products show categories", async ({ page }) => {
    const tbody = page.locator("tbody");
    const rows = tbody.locator("tr");
    const count = await rows.count();

    if (count > 0) {
      const firstRow = rows.first();
      const cells = firstRow.locator("td");
      const categoryCell = cells.nth(1);
      await expect(categoryCell).toBeVisible({ timeout: 10000 });
    }
  });

  test("products show prices in BRL format", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const priceCell = cells.nth(2);

    await expect(priceCell).toBeVisible({ timeout: 10000 });
    const text = await priceCell.textContent();
    expect(text).toMatch(/R\$/);
  });

  test("products show stock information", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const stockCell = cells.nth(3);

    await expect(stockCell).toBeVisible({ timeout: 10000 });
    const text = await stockCell.textContent();
    expect(text).toMatch(/\d+/);
  });

  test("products show status badges", async ({ page }) => {
    const statusBadges = page.locator('span:has-text("Ativo"), span:has-text("Inativo"), span:has-text("Excluído")');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test("products show creation dates", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const createdCell = cells.nth(5);

    await expect(createdCell).toBeVisible({ timeout: 10000 });
    const text = await createdCell.textContent();
    expect(text).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test("products show update dates", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const updatedCell = cells.nth(6);

    await expect(updatedCell).toBeVisible({ timeout: 10000 });
    const text = await updatedCell.textContent();
    expect(text).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test("can sort products by name", async ({ page }) => {
    const nameHeader = page.getByRole("columnheader", { name: /nome/i });
    await nameHeader.click();
    await page.waitForTimeout(500);

    const table = page.locator("table");
    await expect(table).toBeVisible();
  });

  test("can sort products by category", async ({ page }) => {
    const categoryHeader = page.getByRole("columnheader", { name: /categoria/i });
    await categoryHeader.click();
    await page.waitForTimeout(500);

    const table = page.locator("table");
    await expect(table).toBeVisible();
  });

  test("can sort products by price", async ({ page }) => {
    const priceHeader = page.getByRole("columnheader", { name: /preço/i });
    await priceHeader.click();
    await page.waitForTimeout(500);

    const table = page.locator("table");
    await expect(table).toBeVisible();
  });

  test("table headers are visible", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: /nome/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("columnheader", { name: /categoria/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /preço/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /estoque/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /status/i })).toBeVisible();
  });

  test("page displays multiple products", async ({ page }) => {
    const tbody = page.locator("tbody");
    const rows = tbody.locator("tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("active products are highlighted correctly", async ({ page }) => {
    const activeBadges = page.locator('span:has-text("Ativo")');
    const count = await activeBadges.count();

    if (count > 0) {
      const badge = activeBadges.first();
      const classes = await badge.getAttribute("class");
      expect(classes).toContain("text-green-600");
    }
  });

  test("inactive products are styled correctly", async ({ page }) => {
    const inactiveBadges = page.locator('span:has-text("Inativo")');
    const count = await inactiveBadges.count();

    if (count > 0) {
      const badge = inactiveBadges.first();
      const classes = await badge.getAttribute("class");
      expect(classes).toContain("text-muted-foreground");
    }
  });

  test("table is contained in a card layout", async ({ page }) => {
    const tableContainer = page.locator('div[class*="rounded-lg"][class*="border"]').first();
    await expect(tableContainer).toBeVisible({ timeout: 10000 });
  });

  test("table has shadow styling", async ({ page }) => {
    const tableContainer = page.locator('div[class*="rounded-lg"][class*="border"]').first();
    const classes = await tableContainer.getAttribute("class");
    expect(classes).toContain("shadow-sm");
  });

  test("created by information is displayed", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const createdCell = cells.nth(5);
    const createdBy = createdCell.locator(".text-xs");

    await expect(createdBy).toBeVisible({ timeout: 10000 });
    const text = await createdBy.textContent();
    expect(text).toContain("por");
  });

  test("updated by information is displayed", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const updatedCell = cells.nth(6);
    const updatedBy = updatedCell.locator(".text-xs");

    await expect(updatedBy).toBeVisible({ timeout: 10000 });
    const text = await updatedBy.textContent();
    expect(text).toContain("por");
  });

  test("products with different categories are displayed", async ({ page }) => {
    const tbody = page.locator("tbody");
    const rows = tbody.locator("tr");
    const count = await rows.count();

    if (count > 1) {
      const firstRow = rows.first();
      const secondRow = rows.nth(1);

      const firstCategory = firstRow.locator("td").nth(1);
      const secondCategory = secondRow.locator("td").nth(1);

      await expect(firstCategory).toBeVisible({ timeout: 10000 });
      await expect(secondCategory).toBeVisible();
    }
  });

  test("page header is at the top", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /produtos/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});
