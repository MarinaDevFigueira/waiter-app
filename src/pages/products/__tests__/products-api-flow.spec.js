import { test, expect } from "@playwright/test";
import { loginAsAdmin, waitForApiRequest } from "../../../components/__tests__/helpers";

test.describe("Products — API Integration", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForLoadState("domcontentloaded");
  });

  test("fetches and displays products from API", async ({ page }) => {
    await page.waitForResponse((r) => r.url().includes("/products"), { timeout: 15000 });
    await page.waitForTimeout(500);

    const skeleton = page.locator("[data-testid='products-table-skeleton']");
    const skeletonVisible = await skeleton.isVisible().catch(() => false);
    if (skeletonVisible) {
      await skeleton.waitFor({ state: "hidden", timeout: 10000 });
    }

    const table = page.locator("table");
    const emptyState = page.locator("text=/Nenhum produto|No products/i");

    await expect(table.or(emptyState)).toBeVisible({ timeout: 20000 });
  });

  test("products request hits /products endpoint", async ({ page }) => {
    const productsResponse = waitForApiRequest(page, "/products");
    await page.reload();
    const response = await productsResponse;

    expect(response.url()).toContain("/products");
    expect(response.status()).toBe(200);
  });

  test("search filters products via API", async ({ page }) => {
    await page.waitForResponse((r) => r.url().includes("/products"), { timeout: 15000 });

    const searchInput = page.locator("input[type='text']").first();
    await searchInput.fill("pizza");

    const searchResponsePromise = page.waitForResponse(
      (r) => r.url().includes("/products") && r.url().includes("search=pizza"),
      { timeout: 10000 }
    );

    await page.keyboard.press("Enter");

    const searchResponse = await searchResponsePromise;
    expect(searchResponse.url()).toContain("search=pizza");
    expect(searchResponse.status()).toBe(200);
  });

  test("table shows product columns", async ({ page }) => {
    await page.waitForResponse((r) => r.url().includes("/products"), { timeout: 15000 });

    const skeleton = page.locator("[data-testid='products-table-skeleton']");
    const skeletonVisible = await skeleton.isVisible().catch(() => false);
    if (skeletonVisible) {
      await skeleton.waitFor({ state: "hidden", timeout: 10000 });
    }

    const table = page.locator("table");
    const hasTable = await table.isVisible().catch(() => false);

    if (hasTable) {
      const thead = page.locator("thead");
      await expect(thead).toBeVisible();
    }
  });
});
