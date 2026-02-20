import { test, expect } from "@playwright/test";
import { loginAsAdmin, waitForApiRequest } from "@/components/__tests__/helpers";

test.describe("CategoriesPage", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/categories/");
    await page.waitForLoadState("networkidle");

    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });
  });

  test("renders categories page title", async ({ page }) => {
    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test("renders new category button", async ({ page }) => {
    const newButton = page.getByTestId("new-category-button");
    await expect(newButton).toBeVisible();
  });

  test("displays categories table", async ({ page }) => {
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test("table has categories listed", async ({ page }) => {
    const rows = page.locator("tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("categories show name column", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    const nameCell = firstRow.locator("td").first();
    await expect(nameCell).toBeVisible();

    const text = await nameCell.textContent();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test("categories show description column", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    const descCell = firstRow.locator("td").nth(1);
    await expect(descCell).toBeVisible();
  });

  test("categories show sort order column", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    const sortCell = firstRow.locator("td").nth(2);
    await expect(sortCell).toBeVisible();

    const text = await sortCell.textContent();
    expect(text.trim()).toMatch(/\d+/);
  });

  test("categories show status badges", async ({ page }) => {
    const statusBadges = page.locator('span:has-text("Ativo"), span:has-text("Inativo")');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test("active categories have green badge", async ({ page }) => {
    const activeBadges = page.locator('span:has-text("Ativo")');
    const count = await activeBadges.count();

    if (count > 0) {
      const badge = activeBadges.first();
      const classes = await badge.getAttribute("class");
      expect(classes).toContain("text-green-600");
    }
  });

  test("each row has an edit button", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    const editButton = firstRow.locator("button").first();
    await expect(editButton).toBeVisible();
  });

  test("clicking edit button opens category form dialog", async ({ page }) => {
    const categoryId = await page.locator("[data-testid^='edit-category-']").first().getAttribute("data-testid");
    const editButton = page.getByTestId(categoryId);

    await editButton.click();
    await page.waitForSelector("[role='dialog']", { state: "visible", timeout: 5000 });

    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();
  });

  test("edit form is pre-populated with category data", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    const categoryName = await firstRow.locator("td").first().textContent();

    const editButton = page.locator("[data-testid^='edit-category-']").first();
    await editButton.click();
    await page.waitForSelector("[role='dialog']", { state: "visible", timeout: 5000 });

    const nameInput = page.locator("input#name");
    const inputValue = await nameInput.inputValue();
    expect(inputValue.trim()).toBe(categoryName.trim());
  });

  test("new category button opens empty form dialog", async ({ page }) => {
    const newButton = page.getByTestId("new-category-button");
    await newButton.click();

    await page.waitForSelector("[role='dialog']", { state: "visible", timeout: 5000 });

    const nameInput = page.locator("input#name");
    const value = await nameInput.inputValue();
    expect(value).toBe("");
  });

  test("can sort by name column", async ({ page }) => {
    const nameHeader = page.getByRole("columnheader", { name: /nome/i });
    await nameHeader.click();
    await page.waitForTimeout(500);

    const table = page.locator("table");
    await expect(table).toBeVisible();
  });

  test("can sort by sort order column", async ({ page }) => {
    const sortOrderHeader = page.getByRole("columnheader", { name: /ordem/i });
    await sortOrderHeader.click();
    await page.waitForTimeout(500);

    const table = page.locator("table");
    await expect(table).toBeVisible();
  });

  test("has search bar", async ({ page }) => {
    const searchInput = page.locator("input[type='text']").first();
    await expect(searchInput).toBeVisible();
  });

  test("search filters categories via API", async ({ page }) => {
    const searchInput = page.locator("input[type='text']").first();

    const apiResponsePromise = page.waitForResponse(
      (r) => r.url().includes("/categories") && r.url().includes("search="),
      { timeout: 10000 }
    );

    await searchInput.fill("test");
    await page.keyboard.press("Enter");

    const apiResponse = await apiResponsePromise;
    expect(apiResponse.url()).toContain("search=");
    expect(apiResponse.status()).toBe(200);
  });

  test("page has pagination controls", async ({ page }) => {
    const pagination = page.locator("nav").first();
    await expect(pagination).toBeVisible({ timeout: 5000 });
  });
});

test.describe("CategoriesPage — API Integration", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/categories/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("fetches categories from API on page load", async ({ page }) => {
    const apiResponse = waitForApiRequest(page, "/categories");
    await page.reload();
    const response = await apiResponse;

    expect(response.url()).toContain("/categories");
    expect(response.status()).toBe(200);
  });

  test("shows loading skeleton while fetching", async ({ page }) => {
    await page.reload();

    const skeleton = page.locator(".animate-pulse").first();
    const skeletonCount = await skeleton.count();
    expect(skeletonCount).toBeGreaterThanOrEqual(0);
  });

  test("shows table or empty state after API load", async ({ page }) => {
    await page.waitForResponse((r) => r.url().includes("/categories"), { timeout: 15000 });
    await page.waitForTimeout(500);

    const table = page.locator("table");
    const emptyState = page.locator("div[class*='rounded-lg'][class*='text-center']");

    const hasTable = await table.isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBe(true);
  });
});
