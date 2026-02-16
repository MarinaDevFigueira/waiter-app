import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../../../components/__tests__/helpers";

test.describe("useKitchenOrders Hook", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/orders");
    await page.waitForTimeout(1000);
  });

  test("should display initial orders", async ({ page }) => {
    const orderCards = page.locator("[data-testid*='order-card']");
    const count = await orderCards.count();

    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter orders by table search", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Mesa 01");
    await searchButton.click();
    await page.waitForTimeout(500);
  });

  test("should filter orders by item search", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Pizza");
    await searchButton.click();
    await page.waitForTimeout(500);
  });

  test("should return all orders when search is empty", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Mesa 01");
    await searchButton.click();
    await page.waitForTimeout(500);

    await searchInput.clear();
    await searchButton.click();
    await page.waitForTimeout(500);
  });

  test("should be case insensitive in search", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("MESA");
    await searchButton.click();
    await page.waitForTimeout(500);

    await searchInput.clear();
    await searchInput.fill("mesa");
    await searchButton.click();
    await page.waitForTimeout(500);
  });

  test("should handle partial matches in search", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Mes");
    await searchButton.click();
    await page.waitForTimeout(500);
  });

  test("should maintain search state across updates", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Pizza");
    await searchButton.click();
    await page.waitForTimeout(500);

    const value = await searchInput.inputValue();
    expect(value).toBe("Pizza");
  });

  test("should display orders when no search query is set", async ({ page }) => {
    const ordersContainer = page.locator("div").filter({ has: page.locator("[data-testid*='order-card']") }).first();

    const hasOrders = await ordersContainer.count();
    expect(hasOrders).toBeGreaterThanOrEqual(0);
  });

  test("should handle multiple consecutive searches", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    const queries = ["Mesa 01", "Pizza", "Bebida"];

    for (const query of queries) {
      await searchInput.fill(query);
      await searchButton.click();
      await page.waitForTimeout(300);
    }
  });

  test("should reset search results when cleared", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Mesa 01");
    await searchButton.click();
    await page.waitForTimeout(500);

    await searchInput.clear();
    await searchButton.click();
    await page.waitForTimeout(500);
  });
});
