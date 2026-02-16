import { test, expect } from "@playwright/test";
import { loginAsKitchen } from "@/components/__tests__/helpers";

test.describe("OrdersGrid Component", () => {
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

  test("renders orders grid container", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    await expect(grid).toBeVisible();
  });

  test("grid has correct CSS grid layout", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const classes = await grid.getAttribute("class");

    expect(classes).toContain("grid");
    expect(classes).toContain("grid-cols-1");
    expect(classes).toContain("gap-4");
  });

  test("grid has responsive column configuration", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const classes = await grid.getAttribute("class");

    expect(classes).toContain("sm:grid-cols-2");
    expect(classes).toContain("md:grid-cols-3");
    expect(classes).toContain("lg:grid-cols-4");
    expect(classes).toContain("xl:grid-cols-5");
  });

  test("displays multiple order cards", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const count = await orderCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("each order card displays table name", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const tableNames = grid.getByTestId("order-table-name");
    const count = await tableNames.count();
    expect(count).toBeGreaterThan(0);

    const firstTable = tableNames.first();
    await expect(firstTable).toContainText("Mesa");
  });

  test("each order card displays order items", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const items = firstCard.getByTestId("order-item");
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test("each order card displays status", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const status = firstCard.getByTestId("order-status");
    await expect(status).toBeVisible();
  });

  test("status shows correct label for pending orders", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const pendingCards = grid.locator('[data-status="pending"]');
    const count = await pendingCards.count();

    if (count > 0) {
      const firstPending = pendingCards.first();
      const status = firstPending.getByTestId("order-status");
      await expect(status).toContainText("Pendente");
    }
  });

  test("status shows correct label for preparing orders", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const preparingCards = grid.locator('[data-status="preparing"]');
    const count = await preparingCards.count();

    if (count > 0) {
      const firstPreparing = preparingCards.first();
      const status = firstPreparing.getByTestId("order-status");
      await expect(status).toContainText("Preparando");
    }
  });

  test("clicking status shows status menu", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const status = firstCard.getByTestId("order-status");

    await status.hover();
    await page.waitForTimeout(300);

    const menu = firstCard.getByTestId("order-status-menu");
    await expect(menu).toBeVisible({ timeout: 3000 });
  });

  test("status menu displays all status options", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const status = firstCard.getByTestId("order-status");

    await status.hover();
    await page.waitForTimeout(300);

    const pendingOption = firstCard.getByTestId("status-option-pending");
    const preparingOption = firstCard.getByTestId("status-option-preparing");
    const readyOption = firstCard.getByTestId("status-option-ready");

    await expect(pendingOption).toBeVisible({ timeout: 3000 });
    await expect(preparingOption).toBeVisible();
    await expect(readyOption).toBeVisible();
  });

  test("status options have correct labels", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const status = firstCard.getByTestId("order-status");

    await status.hover();
    await page.waitForTimeout(300);

    const pendingOption = firstCard.getByTestId("status-option-pending");
    const preparingOption = firstCard.getByTestId("status-option-preparing");
    const readyOption = firstCard.getByTestId("status-option-ready");

    await expect(pendingOption).toContainText("Pendente");
    await expect(preparingOption).toContainText("Preparando");
    await expect(readyOption).toContainText("Pronto");
  });

  test("can change order status to preparing", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const pendingCards = grid.locator('[data-status="pending"]');
    const count = await pendingCards.count();

    if (count > 0) {
      const firstPending = pendingCards.first();
      const status = firstPending.getByTestId("order-status");

      await status.hover();
      await page.waitForTimeout(300);

      const preparingOption = firstPending.getByTestId("status-option-preparing");
      await preparingOption.click();

      await page.waitForTimeout(500);
    }
  });

  test("displays formatted date for each order", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const dateElement = firstCard.locator('span.text-xs.text-muted-foreground').first();
    await expect(dateElement).toBeVisible();

    const text = await dateElement.textContent();
    expect(text).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  test("order items display quantity with x suffix", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const firstItem = firstCard.getByTestId("order-item").first();

    const text = await firstItem.textContent();
    expect(text).toMatch(/\d+x/);
  });

  test("active status option is highlighted", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const status = firstCard.getByTestId("order-status");

    await status.hover();
    await page.waitForTimeout(300);

    const statusOptions = firstCard.locator('[data-testid^="status-option-"]');
    const count = await statusOptions.count();

    for (let i = 0; i < count; i++) {
      const option = statusOptions.nth(i);
      const isActive = await option.getAttribute("data-active");
      if (isActive === "true") {
        const classes = await option.getAttribute("class");
        expect(classes).toContain("bg-primary/10");
      }
    }
  });

  test("grid has correct padding", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const classes = await grid.getAttribute("class");
    expect(classes).toContain("py-4");
  });

  test("status has hover effect", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const firstCard = grid.locator('[data-testid^="kitchen-order-card-"]').first();
    const status = firstCard.getByTestId("order-status");

    await status.hover();
    await page.waitForTimeout(300);

    const preparingOption = firstCard.getByTestId("status-option-preparing");
    const classes = await preparingOption.getAttribute("class");
    expect(classes).toContain("hover:bg-accent");
  });

  test("each order card has unique test id", async ({ page }) => {
    const grid = page.getByTestId("kitchen-orders-grid");
    const orderCards = grid.locator('[data-testid^="kitchen-order-card-"]');
    const count = await orderCards.count();

    const testIds = [];
    for (let i = 0; i < count; i++) {
      const card = orderCards.nth(i);
      const testId = await card.getAttribute("data-testid");
      testIds.push(testId);
    }

    const uniqueIds = new Set(testIds);
    expect(uniqueIds.size).toBe(count);
  });
});
