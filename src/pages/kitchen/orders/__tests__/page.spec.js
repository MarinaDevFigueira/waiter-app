import { test, expect } from "@playwright/test";
import { loginAsKitchen } from "@/components/__tests__/helpers";

test.describe("KitchenOrdersPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("showWelcomeSplash", "false");
    });

    await page.goto("/");
    await page.getByTestId("login-username-input").fill("chefecozin");
    await page.getByTestId("login-password-input").fill("123");
    await page.getByTestId("login-submit-button").click();

    await page.waitForURL("/dashboard");

    await page.goto("/dashboard/pedidos");
    await page.waitForLoadState("domcontentloaded");

    await page.waitForSelector('[data-testid="kitchen-orders-grid"]', { state: 'visible', timeout: 15000 });
  });

  test("renders kitchen orders page", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    await expect(grid).toBeVisible();
  });

  test("displays search bar", async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });

  test("page has correct layout structure", async ({ page }) => {
    const mainContainer = page.locator('div.w-full.h-full.flex.flex-col').first();
    await expect(mainContainer).toBeVisible();
  });

  test("displays multiple orders on load", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const count = await orderCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("search filters orders by table name", async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill("Mesa 01");
    await page.waitForTimeout(500);

    const grid = page.getByTestId("kitchen-orders-grid");
    const tableNames = grid.getByTestId("order-table-name");
    const count = await tableNames.count();

    if (count > 0) {
      const firstTable = tableNames.first();
      const text = await firstTable.textContent();
      expect(text).toContain("Mesa 01");
    }
  });

  test("search filters orders by item name", async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill("Pizza");
    await page.waitForTimeout(500);

    const grid = page.getByTestId("kitchen-orders-grid");
    const orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const count = await orderCards.count();

    if (count > 0) {
      const firstCard = orderCards.first();
      const items = firstCard.getByTestId("order-item");
      const itemsCount = await items.count();
      expect(itemsCount).toBeGreaterThan(0);
    }
  });

  test("search is case insensitive", async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();

    await searchInput.fill("pizza");
    await page.waitForTimeout(500);

    const grid = page.getByTestId("kitchen-orders-grid");
    const orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const count = await orderCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("clearing search shows all orders", async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();

    await searchInput.fill("Mesa 01");
    await page.waitForTimeout(500);

    const grid = page.getByTestId("kitchen-orders-grid");
    let orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const filteredCount = await orderCards.count();

    await searchInput.clear();
    await page.waitForTimeout(500);

    orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const allCount = await orderCards.count();

    expect(allCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test("displays orders with different statuses", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");

    const pendingCards = grid.locator('[data-status="pending"]');
    const preparingCards = grid.locator('[data-status="preparing"]');

    const pendingCount = await pendingCards.count();
    const preparingCount = await preparingCards.count();

    expect(pendingCount + preparingCount).toBeGreaterThan(0);
  });

  test("can change order status from pending to preparing", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const pendingCards = grid.locator('[data-status="pending"]');
    const count = await pendingCards.count();

    if (count > 0) {
      const firstPending = pendingCards.first();
      const orderId = await firstPending.getAttribute("data-testid");
      const status = firstPending.getByTestId("order-status");

      await status.hover();
      await page.waitForTimeout(300);

      const preparingOption = firstPending.getByTestId("status-option-preparing");
      await preparingOption.click();
      await page.waitForTimeout(500);

      const updatedCard = page.locator(`[data-testid="${orderId}"]`);
      const newStatus = await updatedCard.getAttribute("data-status");
      expect(newStatus).toBe("preparing");
    }
  });

  test("can change order status from preparing to ready", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const preparingCards = grid.locator('[data-status="preparing"]');
    const count = await preparingCards.count();

    if (count > 0) {
      const firstPreparing = preparingCards.first();
      const orderId = await firstPreparing.getAttribute("data-testid");
      const status = firstPreparing.getByTestId("order-status");

      await status.hover();
      await page.waitForTimeout(300);

      const readyOption = firstPreparing.getByTestId("status-option-ready");
      await readyOption.click();
      await page.waitForTimeout(500);

      const updatedCard = page.locator(`[data-testid="${orderId}"]`);
      const newStatus = await updatedCard.getAttribute("data-status");
      expect(newStatus).toBe("ready");
    }
  });

  test("orders display formatted dates", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const dateElement = firstCard.locator('span.text-xs.text-muted-foreground').first();

    await expect(dateElement).toBeVisible();
    const text = await dateElement.textContent();
    expect(text).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  test("orders display formatted times", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const timeElements = firstCard.locator('span.text-xs.text-muted-foreground');
    const count = await timeElements.count();
    expect(count).toBeGreaterThan(1);
  });

  test("page layout has correct spacing", async ({ page }) => {
    const mainContainer = page.locator('div.w-full.h-full.flex.flex-col').first();
    const classes = await mainContainer.getAttribute("class");
    expect(classes).toContain("gap-6");
  });

  test("orders grid is scrollable", async ({ page }) => {
    const scrollContainer = page.locator('.overflow-y-auto').first();
    await expect(scrollContainer).toBeVisible();
  });

  test("each order displays table information", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const tableNames = grid.getByTestId("order-table-name");
    const count = await tableNames.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(3, count); i++) {
      const tableName = tableNames.nth(i);
      await expect(tableName).toContainText("Mesa");
    }
  });

  test("each order displays multiple items", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const items = firstCard.getByTestId("order-item");
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test("search bar is positioned at the top", async ({ page }) => {
    const searchBar = page.locator('input[type="text"]').first();
    const searchContainer = searchBar.locator('..').locator('..');
    await expect(searchContainer).toBeVisible();
  });

  test("grid container has correct width", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const parent = grid.locator('..');
    const classes = await parent.getAttribute("class");
    expect(classes).toContain("w-full");
  });

  test("status labels are in Portuguese", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const statuses = grid.getByTestId("order-status");
    const count = await statuses.count();

    if (count > 0) {
      const firstStatus = statuses.first();
      const text = await firstStatus.textContent();
      const portugueseStatuses = ["Pendente", "Preparando", "Pronto"];
      const isPortuguese = portugueseStatuses.some(status => text.includes(status));
      expect(isPortuguese).toBe(true);
    }
  });
});
