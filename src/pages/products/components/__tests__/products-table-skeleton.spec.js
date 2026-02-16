import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../../../../components/__tests__/helpers";

test.describe("ProductsTableSkeleton Component", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForTimeout(1500);
  });

  test("should render table structure", async ({ page }) => {
    const table = page.locator("table");
    const tableCount = await table.count();

    expect(tableCount).toBeGreaterThanOrEqual(1);
  });

  test("should render table headers", async ({ page }) => {
    const thead = page.locator("thead").first();
    const headerCells = thead.locator("th");

    const count = await headerCells.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should render table rows", async ({ page }) => {
    const tbody = page.locator("tbody").first();
    const rows = tbody.locator("tr");

    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("should have overflow handling", async ({ page }) => {
    const overflowContainer = page.locator("div.overflow-x-auto").first();
    await expect(overflowContainer).toBeVisible();
  });

  test("should have proper table header background", async ({ page }) => {
    const thead = page.locator("thead").first();
    const theadClass = await thead.getAttribute("class");

    expect(theadClass).toContain("bg-muted");
  });

  test("should have dividers between body rows", async ({ page }) => {
    const tbody = page.locator("tbody").first();
    const tbodyClass = await tbody.getAttribute("class");

    expect(tbodyClass).toContain("divide-y");
  });

  test("should render multiple columns per row", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    const cells = firstRow.locator("td");

    const count = await cells.count();
    expect(count).toBeGreaterThan(5);
  });

  test("should have consistent padding on cells", async ({ page }) => {
    const firstCell = page.locator("tbody tr td").first();
    const cellClass = await firstCell.getAttribute("class");

    expect(cellClass).toContain("px-4");
    expect(cellClass).toContain("py-3");
  });

  test("should have proper table width", async ({ page }) => {
    const table = page.locator("table").first();
    const tableClass = await table.getAttribute("class");

    expect(tableClass).toContain("w-full");
  });
});
