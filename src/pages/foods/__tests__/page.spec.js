import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../components/__tests__/helpers";

test.describe("FoodsPage", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
  });

  test("should render the page with all main components", async ({ page }) => {
    const titleElement = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    await expect(titleElement).toBeVisible();

    const categoriesContainer = page.locator("ul").first();
    await expect(categoriesContainer).toBeVisible();

    const foodsList = page.locator("ul").last();
    await expect(foodsList).toBeVisible();
  });

  test("should display the title component", async ({ page }) => {
    await expect(page.getByText("Bem vindo(a) ao")).toBeVisible();
    await expect(page.locator("strong").filter({ hasText: "WAITER" })).toBeVisible();
    const appText = page.locator("span").filter({ hasText: /^App$/i });
    await expect(appText).toBeVisible();
  });

  test("should display categories list", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");
    const snacksCategory = page.locator("li[data-category='snacks']");
    const promotionsCategory = page.locator("li[data-category='promotions']");

    await expect(pizzasCategory).toBeVisible();
    await expect(drinksCategory).toBeVisible();
    await expect(snacksCategory).toBeVisible();
    await expect(promotionsCategory).toBeVisible();
  });

  test("should display foods list when category is selected", async ({ page }) => {
    await page.waitForTimeout(500);

    const foodItems = page.locator("ul").last().locator("div").first();
    await expect(foodItems).toBeVisible();
  });

  test("should update foods list when category changes", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");

    const initialPizzasSelected = await pizzasCategory.getAttribute("data-selected");
    expect(initialPizzasSelected).toBe("true");

    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    const updatedDrinksSelected = await drinksCategory.getAttribute("data-selected");
    expect(updatedDrinksSelected).toBe("true");
  });

  test("should have proper layout structure", async ({ page }) => {
    const titleElement = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    await expect(titleElement).toBeVisible();

    const categoriesContainer = page.locator("ul").first();
    await expect(categoriesContainer).toBeVisible();

    const foodsList = page.locator("ul").last();
    await expect(foodsList).toBeVisible();
  });

  test("should maintain state across category selections", async ({ page }) => {
    const categories = [
      page.locator("li[data-category='pizzas']"),
      page.locator("li[data-category='drinks']"),
      page.locator("li[data-category='snacks']"),
      page.locator("li[data-category='promotions']"),
    ];

    for (const category of categories) {
      await category.click({ force: true });
      await page.waitForTimeout(500);

      const selectedState = await category.getAttribute("data-selected");
      expect(selectedState).toBe("true");

      const foodsList = page.locator("ul").last();
      await expect(foodsList).toBeVisible();
    }
  });

  test("should render foods with proper spacing", async ({ page }) => {
    const titleElement = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    await expect(titleElement).toBeVisible();

    const foodsList = page.locator("ul").last();
    const listClass = await foodsList.getAttribute("class");

    expect(listClass).toContain("gap");
  });
});
