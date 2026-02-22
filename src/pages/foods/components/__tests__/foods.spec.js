import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../../components/__tests__/helpers";

test.describe("Foods Component", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
    await page.waitForTimeout(500);
  });

  test("should render foods list", async ({ page }) => {
    const foodsList = page.locator("ul").last();
    await expect(foodsList).toBeVisible();
  });

  test("should display multiple food items", async ({ page }) => {
    const foodsList = page.locator("ul").last();
    const foodItems = foodsList.locator("div");

    const count = await foodItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should render food item with image", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("li").first();
    const image = firstFoodItem.locator("img").first();

    await expect(image).toBeVisible();
  });

  test("should render food item with name", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const nameElement = firstFoodItem.locator("span.font-semibold").first();

    await expect(nameElement).toBeVisible();
    const text = await nameElement.textContent();
    expect(text).toBeTruthy();
  });

  test("should render food item with description", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const descriptionElement = firstFoodItem.locator("span.text-muted-foreground");

    await expect(descriptionElement).toBeVisible();
  });

  test("should render food item with price", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const priceElements = firstFoodItem.locator("span.font-semibold");

    const count = await priceElements.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("should display food image with proper styling", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("li").first();
    const image = firstFoodItem.locator("img").first();

    const imageClass = await image.getAttribute("class");
    expect(imageClass).toContain("rounded-md");
    expect(imageClass).toContain("object-cover");
  });

  test("should truncate long food names", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const nameElement = firstFoodItem.locator("span.font-semibold").first();

    const nameClass = await nameElement.getAttribute("class");
    expect(nameClass).toContain("line-clamp-2");
  });

  test("should truncate long descriptions", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const descriptionElement = firstFoodItem.locator("span.text-muted-foreground");

    const descClass = await descriptionElement.getAttribute("class");
    expect(descClass).toContain("line-clamp-1");
  });

  test("should update food list when category changes", async ({ page }) => {
    const categoriesList = page.locator("ul").first();
    const categoryTabs = categoriesList.locator("li");
    const count = await categoryTabs.count();

    const hasCategories = count > 1;
    if (hasCategories) {
      const secondCategory = categoryTabs.nth(1);
      await secondCategory.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);

      const secondCategorySpan = secondCategory.locator("span[data-selected]");
      const selectedState = await secondCategorySpan.getAttribute("data-selected");
      expect(selectedState).toBe("true");

      const hasProducts = await page.locator('[data-testid^="product-"]').count() > 0;
      const hasEmptyState = await page.getByText(/Nenhum produto|No products/).isVisible().catch(() => false);
      const pageResponded = hasProducts || hasEmptyState;
      expect(pageResponded).toBe(true);
    }
  });

  test("should have proper spacing between food items", async ({ page }) => {
    const foodsList = page.locator("ul").last();
    const listClass = await foodsList.getAttribute("class");

    expect(listClass).toContain("gap-3");
  });

  test("should render food items with consistent layout", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const itemClass = await firstFoodItem.getAttribute("class");

    expect(itemClass).toContain("flex");
    expect(itemClass).toContain("w-full");
  });

  test("should render all foods in the selected category", async ({ page }) => {
    const allTab = page.getByText("Todos", { exact: true });
    const allTabParent = allTab.locator("..");
    const allSelected = await allTabParent.getAttribute("data-selected");
    expect(allSelected).toBe("true");

    const foodsList = page.locator("ul").last();
    const foodItems = foodsList.locator("> *");

    const count = await foodItems.count();
    expect(count).toBeGreaterThan(0);
  });
});
