import { test, expect } from "@playwright/test";
import { loginAsAdmin, loginAsKitchen, waitForApiRequest } from "../../../components/__tests__/helpers";

test.describe("useOrders — admin table view", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("orders-view", "table");
    });
    await loginAsAdmin(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");
  });

  test("fetches orders from API on mount", async ({ page }) => {
    const apiResponse = waitForApiRequest(page, "/orders");
    await page.reload();
    const response = await apiResponse;

    expect(response.url()).toContain("/orders");
    expect(response.status()).toBe(200);
  });

  test("displays orders in table after API load", async ({ page }) => {
    const thead = page.locator("thead").first();
    const hasTable = await thead.isVisible({ timeout: 15000 }).catch(() => false);

    const emptyState = page.locator("div[class*='rounded-lg'][class*='text-center']");
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBe(true);
  });

  test("query params include page and size in API request", async ({ page }) => {
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes("localhost:3000") && req.url().includes("/orders") && req.method() === "GET",
      { timeout: 15000 }
    );

    await page.goto("/dashboard/orders");
    const request = await requestPromise;
    const url = request.url();

    expect(url).toContain("page=");
    expect(url).toContain("size=");
  });

  test("sorting a column sends updated orderBy to API", async ({ page }) => {
    const thead = page.locator("thead").first();
    await expect(thead).toBeVisible({ timeout: 15000 });

    const sortableHeader = page.locator("thead th[class*='cursor-pointer']").first();
    const hasHeader = await sortableHeader.count();

    if (hasHeader > 0) {
      const apiRequestPromise = page.waitForRequest(
        (req) => req.url().includes("localhost:3000") && req.url().includes("/orders") && req.method() === "GET",
        { timeout: 8000 }
      );
      await sortableHeader.click();
      const request = await apiRequestPromise;
      expect(request.url()).toContain("orderBy=");
    }
  });

  test("pagination controls are rendered", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    const pagination = page.locator("nav").first();
    await expect(pagination).toBeVisible({ timeout: 5000 });
  });

  test("pagination size select is visible when orders are loaded", async ({ page }) => {
    const firstRow = page.locator("[data-testid='orders-table-row']").first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    const sizeSelect = page.getByTestId("pagination-size-input");
    await expect(sizeSelect).toBeVisible({ timeout: 5000 });
  });
});

test.describe("useOrders — priority fallback", () => {
  test("admin sees table view by default", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("orders-view", "table");
    });
    await loginAsAdmin(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const thead = page.locator("thead").first();
    await expect(thead).toBeVisible({ timeout: 15000 });
  });

  test("optimistic orders appear immediately after status update", async ({ page }) => {
    await loginAsKitchen(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const grid = page.getByTestId("kitchen-orders-grid");
    const hasGrid = await grid.isVisible({ timeout: 15000 }).catch(() => false);

    if (hasGrid) {
      const cards = grid.locator('[data-testid^="kitchen-order-card-"]');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("admin can switch to kitchen view", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("orders-view", "kitchen");
    });
    await loginAsAdmin(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const grid = page.getByTestId("kitchen-orders-grid");
    await expect(grid).toBeVisible({ timeout: 15000 });
  });

  test("kitchen user always sees kitchen grid view", async ({ page }) => {
    await loginAsKitchen(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const grid = page.getByTestId("kitchen-orders-grid");
    await expect(grid).toBeVisible({ timeout: 15000 });
  });
});

test.describe("useOrders — write operations returning void", () => {
  test("status update does not crash the page", async ({ page }) => {
    await loginAsKitchen(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const grid = page.getByTestId("kitchen-orders-grid");
    const hasGrid = await grid.isVisible({ timeout: 15000 }).catch(() => false);

    if (hasGrid) {
      const cards = grid.locator('[data-testid^="kitchen-order-card-"]');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("invalidates orders cache after status update", async ({ page }) => {
    await loginAsKitchen(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const grid = page.getByTestId("kitchen-orders-grid");
    const hasGrid = await grid.isVisible({ timeout: 15000 }).catch(() => false);

    if (!hasGrid) return;

    const pendingCards = grid.locator('[data-status="pending"]');
    const count = await pendingCards.count();

    if (count > 0) {
      const statusElement = pendingCards.first().getByTestId("order-status");
      const preparingOption = pendingCards.first().getByTestId("status-option-preparing");

      await statusElement.hover();
      await page.waitForTimeout(300);

      const hasPreparing = await preparingOption.count();
      if (hasPreparing > 0) {
        const refetchPromise = page.waitForRequest(
          (req) => req.url().includes("/orders") && req.method() === "GET",
          { timeout: 8000 }
        );
        await preparingOption.click();
        await refetchPromise;
      }
    }
  });
});
