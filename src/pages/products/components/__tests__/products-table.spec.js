import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "@/components/__tests__/helpers";

test.describe("ProductsTable Component", () => {
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

  test("renders products table", async ({ page }) => {
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test("table has correct structure with thead and tbody", async ({ page }) => {
    const thead = page.locator("thead");
    const tbody = page.locator("tbody");

    await expect(thead).toBeVisible({ timeout: 10000 });
    await expect(tbody).toBeVisible();
  });

  test("displays all column headers", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: /nome/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("columnheader", { name: /categoria/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /preço/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /estoque/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /status/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /criado em/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /atualizado em/i })).toBeVisible();
  });

  test("displays product rows", async ({ page }) => {
    const tbody = page.locator("tbody");
    const rows = tbody.locator("tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("product name column displays name and description", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const nameCell = firstRow.locator("td").first();

    const productName = nameCell.locator(".font-medium");
    const productDescription = nameCell.locator(".text-muted-foreground");

    await expect(productName).toBeVisible({ timeout: 10000 });
    await expect(productDescription).toBeVisible();
  });

  test("displays product category", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const categoryCell = cells.nth(1);

    await expect(categoryCell).toBeVisible({ timeout: 10000 });
    const text = await categoryCell.textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  test("displays formatted price in BRL", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const priceCell = cells.nth(2);

    await expect(priceCell).toBeVisible({ timeout: 10000 });
    const text = await priceCell.textContent();
    expect(text).toMatch(/R\$/);
  });

  test("displays stock with unit", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const stockCell = cells.nth(3);

    await expect(stockCell).toBeVisible({ timeout: 10000 });
    const text = await stockCell.textContent();
    expect(text).toMatch(/\d+\s+(un|kg|L)/);
  });

  test("displays status badge", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const statusCell = cells.nth(4);
    const badge = statusCell.locator("span");

    await expect(badge).toBeVisible({ timeout: 10000 });
    const text = await badge.textContent();
    const validStatuses = ["Ativo", "Inativo", "Excluído"];
    const isValid = validStatuses.some(status => text.includes(status));
    expect(isValid).toBe(true);
  });

  test("active status has green styling", async ({ page }) => {
    const activeBadges = page.locator('span:has-text("Ativo")');
    const count = await activeBadges.count();

    if (count > 0) {
      const badge = activeBadges.first();
      const classes = await badge.getAttribute("class");
      expect(classes).toContain("bg-green-500/10");
      expect(classes).toContain("text-green-600");
    }
  });

  test("inactive status has muted styling", async ({ page }) => {
    const inactiveBadges = page.locator('span:has-text("Inativo")');
    const count = await inactiveBadges.count();

    if (count > 0) {
      const badge = inactiveBadges.first();
      const classes = await badge.getAttribute("class");
      expect(classes).toContain("bg-muted");
      expect(classes).toContain("text-muted-foreground");
    }
  });

  test("deleted status has destructive styling", async ({ page }) => {
    const deletedBadges = page.locator('span:has-text("Excluído")');
    const count = await deletedBadges.count();

    if (count > 0) {
      const badge = deletedBadges.first();
      const classes = await badge.getAttribute("class");
      expect(classes).toContain("bg-destructive/10");
      expect(classes).toContain("text-destructive");
    }
  });

  test("displays formatted creation date", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const createdCell = cells.nth(5);

    await expect(createdCell).toBeVisible({ timeout: 10000 });
    const text = await createdCell.textContent();
    expect(text).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test("displays formatted update date", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const updatedCell = cells.nth(6);

    await expect(updatedCell).toBeVisible({ timeout: 10000 });
    const text = await updatedCell.textContent();
    expect(text).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test("created by user is displayed", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const createdCell = cells.nth(5);
    const createdBy = createdCell.locator(".text-xs");

    await expect(createdBy).toBeVisible({ timeout: 10000 });
    const text = await createdBy.textContent();
    expect(text).toContain("por");
  });

  test("updated by user is displayed", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const updatedCell = cells.nth(6);
    const updatedBy = updatedCell.locator(".text-xs");

    await expect(updatedBy).toBeVisible({ timeout: 10000 });
    const text = await updatedBy.textContent();
    expect(text).toContain("por");
  });

  test("sortable columns show sort indicator", async ({ page }) => {
    const nameHeader = page.getByRole("columnheader", { name: /nome/i });
    await expect(nameHeader).toBeVisible({ timeout: 10000 });

    const sortIndicator = nameHeader.locator("span");
    await expect(sortIndicator).toBeVisible();
  });

  test("can sort by name column", async ({ page }) => {
    const nameHeader = page.getByRole("columnheader", { name: /nome/i });
    await nameHeader.click();
    await page.waitForTimeout(500);

    const sortIndicator = nameHeader.locator("span");
    const text = await sortIndicator.textContent();
    expect(text).toBeTruthy();
  });

  test("can sort by category column", async ({ page }) => {
    const categoryHeader = page.getByRole("columnheader", { name: /categoria/i });
    await categoryHeader.click();
    await page.waitForTimeout(500);

    const sortIndicator = categoryHeader.locator("span");
    const text = await sortIndicator.textContent();
    expect(text).toBeTruthy();
  });

  test("can sort by price column", async ({ page }) => {
    const priceHeader = page.getByRole("columnheader", { name: /preço/i });
    await priceHeader.click();
    await page.waitForTimeout(500);

    const sortIndicator = priceHeader.locator("span");
    const text = await sortIndicator.textContent();
    expect(text).toBeTruthy();
  });

  test("status column is not sortable", async ({ page }) => {
    const statusHeader = page.getByRole("columnheader", { name: /status/i });
    const classes = await statusHeader.getAttribute("class");
    expect(classes).not.toContain("cursor-pointer");
  });

  test("table has hover effect on rows", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const classes = await firstRow.getAttribute("class");
    expect(classes).toContain("hover:bg-muted/30");
  });

  test("table rows have transition effect", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const classes = await firstRow.getAttribute("class");
    expect(classes).toContain("transition-colors");
  });

  test("table has correct border styling", async ({ page }) => {
    const tableContainer = page.locator('div[class*="rounded-lg"][class*="border"]').first();
    await expect(tableContainer).toBeVisible({ timeout: 10000 });

    const classes = await tableContainer.getAttribute("class");
    expect(classes).toContain("border-border");
    expect(classes).toContain("rounded-lg");
  });

  test("table header has correct background", async ({ page }) => {
    const thead = page.locator("thead");
    const classes = await thead.getAttribute("class");
    expect(classes).toContain("bg-muted/50");
  });

  test("table is horizontally scrollable", async ({ page }) => {
    const scrollContainer = page.locator('div.overflow-x-auto');
    await expect(scrollContainer).toBeVisible({ timeout: 10000 });
  });

  test("column headers have uppercase text", async ({ page }) => {
    const nameHeader = page.getByRole("columnheader", { name: /nome/i });
    const classes = await nameHeader.getAttribute("class");
    expect(classes).toContain("uppercase");
  });

  test("category values are capitalized", async ({ page }) => {
    const tbody = page.locator("tbody");
    const firstRow = tbody.locator("tr").first();
    const cells = firstRow.locator("td");
    const categoryCell = cells.nth(1);
    const categorySpan = categoryCell.locator("span.capitalize");

    await expect(categorySpan).toBeVisible({ timeout: 10000 });
  });
});
