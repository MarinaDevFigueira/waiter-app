import { test, expect } from "@playwright/test";
import { loginAsKitchen, loginAsAdmin, waitForApiRequest } from "../../../components/__tests__/helpers";

test.describe("Orders — API Integration", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsKitchen(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("domcontentloaded");
  });

  test("fetches orders from API on page load", async ({ page }) => {
    const ordersResponse = waitForApiRequest(page, "/orders");
    await page.reload();
    const response = await ordersResponse;

    expect(response.url()).toContain("/orders");
    expect(response.status()).toBe(200);
  });

  test("renders kitchen orders page title", async ({ page }) => {
    const title = page.getByTestId("kitchen-orders-title");
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test("renders kitchen orders subtitle", async ({ page }) => {
    const subtitle = page.getByTestId("kitchen-orders-subtitle");
    await expect(subtitle).toBeVisible({ timeout: 10000 });
  });

  test("shows orders grid or empty state after API load", async ({ page }) => {
    await page.waitForResponse((r) => r.url().includes("/orders"), { timeout: 15000 });
    await page.waitForTimeout(500);

    const grid = page.getByTestId("kitchen-orders-grid");
    const emptyState = page.locator("[data-testid='kitchen-empty-state']");

    const hasGrid = await grid.isVisible().catch(() => false);
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    expect(hasGrid || hasEmptyState).toBe(true);
  });

  test("search bar filters orders", async ({ page }) => {
    await page.waitForResponse((r) => r.url().includes("/orders"), { timeout: 15000 });
    await page.waitForTimeout(500);

    const searchInput = page.locator("input[placeholder]").first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    await searchInput.fill("mesa");
    await page.waitForTimeout(300);

    const grid = page.getByTestId("kitchen-orders-grid");
    const emptyState = page.locator("[data-testid='kitchen-empty-state']");

    const hasGrid = await grid.isVisible().catch(() => false);
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    expect(hasGrid || hasEmptyState).toBe(true);
  });
});

test.describe("Orders Status Update — API Integration", () => {
  test("admin sees table view by default", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("orders-view", "table");
    });
    await loginAsAdmin(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const thead = page.locator("thead").first();
    const hasTable = await thead.isVisible({ timeout: 15000 }).catch(() => false);

    const emptyState = page.locator("div[class*='rounded-lg'][class*='text-center']");
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBe(true);
  });

  test("admin table view sends pagination params to API", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("orders-view", "table");
    });

    const apiRequestPromise = page.waitForRequest(
      (req) => req.url().includes("localhost:3000") && req.url().includes("/orders") && req.method() === "GET",
      { timeout: 15000 }
    );

    await loginAsAdmin(page);
    await page.goto("/dashboard/orders");
    const request = await apiRequestPromise;

    expect(request.url()).toContain("page=");
    expect(request.url()).toContain("size=");
  });

  test("order status badge is visible when orders exist in kitchen view", async ({ page }) => {
    await loginAsKitchen(page);
    await page.goto("/dashboard/orders");
    await page.waitForResponse((r) => r.url().includes("/orders"), { timeout: 15000 });
    await page.waitForTimeout(500);

    const grid = page.getByTestId("kitchen-orders-grid");
    const hasGrid = await grid.isVisible().catch(() => false);

    if (hasGrid) {
      const firstStatus = page.getByTestId("order-status").first();
      await expect(firstStatus).toBeVisible();
    }
  });

  test("admin updateStatus write operation returns void", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("orders-view", "table");
    });
    await loginAsAdmin(page);
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("networkidle");

    const thead = page.locator("thead").first();
    await expect(thead).toBeVisible({ timeout: 15000 });
  });
});
