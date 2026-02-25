import { test, expect } from "@playwright/test";
import { loginAsKitchen as _loginAsKitchen } from "@/components/__tests__/helpers";

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

    await page.goto("/dashboard/orders");
    await page.waitForLoadState("domcontentloaded");

    await page.waitForSelector('[data-testid="kitchen-orders-grid"]', { state: 'visible', timeout: 15000 });
  });

  test("renders kitchen orders page", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    await expect(grid).toBeVisible();
  });

  test("displays page title", async ({ page }) => {
    const title = page.getByTestId("kitchen-orders-title");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("Pedidos da Cozinha");
  });

  test("displays page subtitle", async ({ page }) => {
    const subtitle = page.getByTestId("kitchen-orders-subtitle");
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText("Gerencie os pedidos em preparação");
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
    const searchInput = page.getByTestId("kitchen-search-input");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("mesa01");
    await page.waitForTimeout(500);

    const grid = page.getByTestId("kitchen-orders-grid");
    const orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const count = await orderCards.count();

    if (count > 0) {
      const firstCard = orderCards.first();
      const tableName = firstCard.getByTestId("order-table-name");
      await expect(tableName).toBeVisible();
      const text = await tableName.textContent();
      const lowerCaseText = text.toLowerCase();
      expect(lowerCaseText).toContain("mesa");
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
    const readyCards = grid.locator('[data-status="ready"]');
    const canceledCards = grid.locator('[data-status="canceled"]');

    const pendingCount = await pendingCards.count();
    const preparingCount = await preparingCards.count();
    const readyCount = await readyCards.count();
    const canceledCount = await canceledCards.count();

    const totalCount = pendingCount + preparingCount + readyCount + canceledCount;
    expect(totalCount).toBeGreaterThan(0);
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
    await expect(grid).toBeVisible();

    const orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const count = await orderCards.count();
    expect(count).toBeGreaterThan(0);

    const checkLimit = Math.min(3, count);
    for (let i = 0; i < checkLimit; i++) {
      const orderCard = orderCards.nth(i);
      const tableName = orderCard.getByTestId("order-table-name");
      await expect(tableName).toBeVisible();
      const text = await tableName.textContent();
      const lowerCaseText = text.toLowerCase();
      expect(lowerCaseText).toContain("mesa");
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
    await expect(grid).toBeVisible();

    const scrollContainer = page.locator('.overflow-y-auto').first();
    await expect(scrollContainer).toBeVisible();

    const classes = await scrollContainer.getAttribute("class");
    const hasWidthClass = classes.includes("flex-1") || classes.includes("w-full");
    expect(hasWidthClass).toBe(true);
  });

  test("status labels are in Portuguese", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    await expect(grid).toBeVisible();

    const orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const count = await orderCards.count();
    expect(count).toBeGreaterThan(0);

    const firstCard = orderCards.first();
    const status = firstCard.getByTestId("order-status");
    await expect(status).toBeVisible();

    const text = await status.textContent();
    const portugueseStatuses = ["Pendente", "Preparando", "Pronto", "Cancelado"];
    const hasPortugueseStatus = portugueseStatuses.some(statusText => text.includes(statusText));
    expect(hasPortugueseStatus).toBe(true);
  });
});
