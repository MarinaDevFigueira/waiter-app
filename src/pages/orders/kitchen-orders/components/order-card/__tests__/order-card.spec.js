import { test, expect } from "@playwright/test";
import { loginAsKitchen as _loginAsKitchen } from "@/components/__tests__/helpers";

test.describe("OrderCard Component", () => {
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

  test("renders order card with correct structure", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });

    const classes = await orderCard.getAttribute("class");
    expect(classes).toContain("flex");
    expect(classes).toContain("flex-col");
    expect(classes).toContain("bg-card");
    expect(classes).toContain("border");
    expect(classes).toContain("rounded-lg");
  });

  test("displays order card with correct height", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const classes = await orderCard.getAttribute("class");
    expect(classes).toContain("h-[280px]");
  });

  test("order card has correct status data attribute", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const status = await orderCard.getAttribute("data-status");
    expect(status).toBeTruthy();
  });

  test("renders order card header section", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const tableName = orderCard.getByTestId("order-table-name");
    await expect(tableName).toBeVisible();
    await expect(tableName).toContainText("Mesa");
  });

  test("renders order items list", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const itemsList = orderCard.getByTestId("order-items-list");
    await expect(itemsList).toBeVisible();
  });

  test("renders individual order items", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const items = orderCard.getByTestId("order-item");
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test("order item displays name and quantity", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const firstItem = orderCard.getByTestId("order-item").first();
    await expect(firstItem).toBeVisible();

    const text = await firstItem.textContent();
    expect(text).toMatch(/\d+x/);
  });

  test("renders order status in footer", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const status = orderCard.getByTestId("order-status");
    await expect(status).toBeVisible();
  });

  test("order status has correct styling", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const status = orderCard.getByTestId("order-status");

    const classes = await status.getAttribute("class");
    expect(classes).toContain("text-xs");
    expect(classes).toContain("font-medium");
    expect(classes).toContain("rounded");
  });

  test("order items list is scrollable", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const itemsList = orderCard.getByTestId("order-items-list");

    const classes = await itemsList.getAttribute("class");
    expect(classes).toContain("overflow-y-auto");
  });

  test("order card header has correct background", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const header = orderCard.locator('[class*="bg-primary/5"]').first();
    await expect(header).toBeVisible();
  });

  test("order items have correct spacing", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const itemsList = orderCard.getByTestId("order-items-list");

    const classes = await itemsList.getAttribute("class");
    expect(classes).toContain("space-y-2");
  });

  test("order card has transition effect", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const classes = await orderCard.getAttribute("class");
    expect(classes).toContain("transition-shadow");
  });

  test("order status is clickable", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const status = orderCard.getByTestId("order-status");

    const cursor = await status.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue("cursor")
    );
    expect(cursor).toBe("pointer");
  });

  test("displays formatted date in header", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const dateText = orderCard.locator('span.text-xs.text-muted-foreground').first();
    await expect(dateText).toBeVisible();

    const text = await dateText.textContent();
    expect(text).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  test("displays formatted time in header", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const timeElements = orderCard.locator('span.text-xs.text-muted-foreground');
    const count = await timeElements.count();
    expect(count).toBeGreaterThan(1);
  });

  test("table name has uppercase styling", async ({ page }) => {
    const orderCard = page.locator('[data-testid^="kitchen-order-card-"]').first();
    await expect(orderCard).toBeVisible({ timeout: 10000 });
    const tableName = orderCard.getByTestId("order-table-name");

    const classes = await tableName.getAttribute("class");
    expect(classes).toContain("uppercase");
  });
});
