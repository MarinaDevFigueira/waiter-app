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

  test("should render food item with add button", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const addButton = firstFoodItem.locator("button");

    await expect(addButton).toBeVisible();
  });

  test("should have proper hover effect on add button", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const addButton = firstFoodItem.locator("button");

    const buttonClass = await addButton.getAttribute("class");
    expect(buttonClass).toContain("hover:opacity-80");
    expect(buttonClass).toContain("transition-opacity");
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
    const drinksCategory = page.locator("li[data-category='drinks']");

    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    const foodsList = page.locator("ul").last();
    await expect(foodsList).toBeVisible();

    const foodItems = foodsList.locator("div");
    const count = await foodItems.count();
    expect(count).toBeGreaterThan(0);
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

  test("should display aria-label on add button", async ({ page }) => {
    const firstFoodItem = page.locator("ul").last().locator("div").first();
    const addButton = firstFoodItem.locator("button");

    const ariaLabel = await addButton.getAttribute("aria-label");
    expect(ariaLabel).toContain("Adicionar");
    expect(ariaLabel).toContain("ao pedido");
  });

  test("should render all foods in the selected category", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const pizzasSelected = await pizzasCategory.getAttribute("data-selected");
    expect(pizzasSelected).toBe("true");

    const foodsList = page.locator("ul").last();
    const foodItems = foodsList.locator("> *");

    const count = await foodItems.count();
    expect(count).toBeGreaterThan(0);
  });
});
