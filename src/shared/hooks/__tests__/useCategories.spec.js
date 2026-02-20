import { test, expect } from "@playwright/test";
import { loginAsAdmin, waitForApiRequest } from "../../../components/__tests__/helpers";

test.describe("useCategories Hook", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/categories/");
    await page.waitForLoadState("networkidle");
  });

  test("fetches categories from API on mount", async ({ page }) => {
    const apiResponse = waitForApiRequest(page, "/categories");
    await page.reload();
    const response = await apiResponse;

    expect(response.url()).toContain("/categories");
    expect(response.status()).toBe(200);
  });

  test("displays categories after successful fetch", async ({ page }) => {
    const table = page.locator("table");
    const hasTable = await table.isVisible({ timeout: 15000 }).catch(() => false);

    const emptyState = page.locator("div[class*='text-center']");
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBe(true);
  });

  test("default request includes page, size, orderBy, direction params", async ({ page }) => {
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes("localhost:3000") && req.url().includes("/categories") && req.method() === "GET",
      { timeout: 15000 }
    );
    await page.goto("/dashboard/categories/");
    const request = await requestPromise;
    const url = request.url();

    expect(url).toContain("page=");
    expect(url).toContain("size=");
    expect(url).toContain("orderBy=");
    expect(url).toContain("direction=");
  });

  test("search input triggers API request with search param", async ({ page }) => {
    const searchInput = page.locator("input[type='text']").first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    const searchRequestPromise = page.waitForRequest(
      (req) => req.url().includes("localhost:3000") && req.url().includes("/categories") && req.url().includes("search="),
      { timeout: 10000 }
    );

    await searchInput.fill("pizza");
    await page.keyboard.press("Enter");

    const request = await searchRequestPromise;
    expect(request.url()).toContain("search=pizza");
  });

  test("clearing search triggers API request without search param", async ({ page }) => {
    const searchInput = page.locator("input[type='text']").first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    await searchInput.fill("abc");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);

    const clearRequestPromise = page.waitForRequest(
      (req) => req.url().includes("localhost:3000") && req.url().includes("/categories") && req.method() === "GET",
      { timeout: 8000 }
    );

    await searchInput.clear();
    await page.keyboard.press("Enter");

    const request = await clearRequestPromise;
    expect(request.url()).not.toContain("search=abc");
  });

  test("sortable column headers exist", async ({ page }) => {
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 15000 });

    const sortableHeaders = page.locator("thead th[data-sortable='true']");
    const count = await sortableHeaders.count();
    expect(count).toBeGreaterThan(0);
  });

  test("pagination controls are visible when data is loaded", async ({ page }) => {
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 15000 });

    const pagination = page.getByTestId("pagination");
    await expect(pagination).toBeVisible({ timeout: 5000 });
  });

  test("pagination size input is visible", async ({ page }) => {
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 15000 });

    const sizeSelect = page.getByTestId("pagination-size-input");
    await expect(sizeSelect).toBeVisible({ timeout: 5000 });
  });

  test("updateSearch includes page=1 in request", async ({ page }) => {
    const searchInput = page.locator("input[type='text']").first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    const searchRequestPromise = page.waitForRequest(
      (req) => req.url().includes("localhost:3000") && req.url().includes("/categories") && req.url().includes("page=1"),
      { timeout: 10000 }
    );

    await searchInput.fill("test");
    await page.keyboard.press("Enter");

    const request = await searchRequestPromise;
    expect(request.url()).toContain("page=1");
  });

  test("shows table or empty state after data loads", async ({ page }) => {
    const table = page.locator("table");
    const emptyState = page.locator("div[class*='text-center']");

    const hasTable = await table.isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBe(true);
  });
});
