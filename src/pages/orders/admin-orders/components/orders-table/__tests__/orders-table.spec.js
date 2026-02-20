import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "@/components/__tests__/helpers";

test.describe("OrdersTable", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("orders-view", "table");
    });
    await loginAsAdmin(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const thead = page.locator("thead").first();
    await expect(thead).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });
  });

  test("renders the orders table with rows", async ({ page }) => {
    const rows = page.locator("[data-testid='orders-table-row']");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("renders table headers", async ({ page }) => {
    const thead = page.locator("thead").first();
    await expect(thead).toBeVisible();

    const headers = thead.locator("th");
    const count = await headers.count();
    expect(count).toBeGreaterThan(0);
  });

  test("each row has a toggle-order-items-button", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    const toggleButton = firstRow.locator("[data-testid='toggle-order-items-button']");
    await expect(toggleButton).toBeVisible();
  });

  test("toggle button expands order items on click", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    const toggleButton = firstRow.locator("[data-testid='toggle-order-items-button']");

    await toggleButton.click();
    await page.waitForTimeout(400);

    const itemsDetails = page.locator("[data-testid='order-items-details']").first();
    const itemRows = itemsDetails.locator("[data-testid='order-item-row']");
    const count = await itemRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("toggle button sets aria-expanded true on click", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    const toggleButton = firstRow.locator("[data-testid='toggle-order-items-button']");

    await toggleButton.click();
    await page.waitForTimeout(400);

    const ariaExpanded = await toggleButton.getAttribute("aria-expanded");
    expect(ariaExpanded).toBe("true");
  });

  test("toggle button collapses items on second click", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    const toggleButton = firstRow.locator("[data-testid='toggle-order-items-button']");

    await toggleButton.click();
    await page.waitForTimeout(400);

    await toggleButton.click();
    await page.waitForTimeout(400);

    const ariaExpanded = await toggleButton.getAttribute("aria-expanded");
    expect(ariaExpanded).toBe("false");
  });

  test("expanding one row collapses another", async ({ page }) => {
    const rows = page.locator("[data-testid='orders-table-row']");
    const count = await rows.count();

    if (count < 2) return;

    const firstToggle = rows.first().locator("[data-testid='toggle-order-items-button']");
    const secondToggle = rows.nth(1).locator("[data-testid='toggle-order-items-button']");

    await firstToggle.click();
    await page.waitForTimeout(400);
    expect(await firstToggle.getAttribute("aria-expanded")).toBe("true");

    await secondToggle.click();
    await page.waitForTimeout(400);
    expect(await firstToggle.getAttribute("aria-expanded")).toBe("false");
    expect(await secondToggle.getAttribute("aria-expanded")).toBe("true");
  });

  test("expanded order items details shows item rows", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    const toggleButton = firstRow.locator("[data-testid='toggle-order-items-button']");

    await toggleButton.click();
    await page.waitForTimeout(400);

    const itemsDetails = page.locator("[data-testid='order-items-details']").first();
    const itemRows = itemsDetails.locator("[data-testid='order-item-row']");
    const count = await itemRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("expanded order items details shows total in BRL", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    const toggleButton = firstRow.locator("[data-testid='toggle-order-items-button']");

    await toggleButton.click();
    await page.waitForTimeout(400);

    const total = page.locator("[data-testid='order-items-total']").first();
    await expect(total).toBeVisible();

    const text = await total.textContent();
    expect(text).toMatch(/R\$/);
  });

  test("rows have data-expanded attribute reflecting state", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    const toggleButton = firstRow.locator("[data-testid='toggle-order-items-button']");

    const expandedBefore = await firstRow.getAttribute("data-expanded");
    expect(expandedBefore).toBe("false");

    await toggleButton.click();
    await page.waitForTimeout(400);

    const expandedAfter = await firstRow.getAttribute("data-expanded");
    expect(expandedAfter).toBe("true");
  });

  test("table has sortable column headers with cursor-pointer", async ({ page }) => {
    const sortableHeaders = page.locator("thead th[class*='cursor-pointer']");
    const count = await sortableHeaders.count();
    expect(count).toBeGreaterThan(0);
  });

  test("clicking sortable column header changes sort indicator", async ({ page }) => {
    const sortableHeader = page.locator("thead th[class*='cursor-pointer']").first();
    await sortableHeader.click();
    await page.waitForTimeout(500);

    const indicator = sortableHeader.locator("span.text-xs").last();
    const text = await indicator.textContent();
    expect(["▲", "▼"]).toContain(text);
  });

  test("status badges are visible in table rows", async ({ page }) => {
    const statusBadge = page.locator("[data-testid='orders-table-row']").first().locator("td span[class*='rounded-md']").first();
    await expect(statusBadge).toBeVisible();
  });

  test("totals are displayed in BRL format in table rows", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    const cells = firstRow.locator("td");
    const count = await cells.count();
    expect(count).toBeGreaterThan(3);

    const totalCell = cells.nth(3);
    const text = await totalCell.textContent();
    expect(text).toMatch(/R\$/);
  });
});
