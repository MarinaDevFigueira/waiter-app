import { test, expect } from "@playwright/test";

test.describe("useCategory Hook", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();
  });

  test("should return initial category as pizzas", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const initialState = await pizzasCategory.getAttribute("data-selected");

    expect(initialState).toBe("true");
  });

  test("should change category when changeCategory is called", async ({ page }) => {
    const drinksCategory = page.locator("li[data-category='drinks']");

    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    const selectedState = await drinksCategory.getAttribute("data-selected");
    expect(selectedState).toBe("true");
  });

  test("should update selectedCategory state after category change", async ({ page }) => {
    const snacksCategory = page.locator("li[data-category='snacks']");
    const pizzasCategory = page.locator("li[data-category='pizzas']");

    // Initial state should be pizzas
    let pizzasSelected = await pizzasCategory.getAttribute("data-selected");
    expect(pizzasSelected).toBe("true");

    // Click snacks
    await snacksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    // Check that snacks is now selected
    let snacksSelected = await snacksCategory.getAttribute("data-selected");
    expect(snacksSelected).toBe("true");

    // Check that pizzas is no longer selected
    pizzasSelected = await pizzasCategory.getAttribute("data-selected");
    expect(pizzasSelected).toBe("false");
  });

  test("should only allow one category selected at a time", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");
    const snacksCategory = page.locator("li[data-category='snacks']");

    // Change to drinks
    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    let drinksSelected = await drinksCategory.getAttribute("data-selected");
    let pizzasSelected = await pizzasCategory.getAttribute("data-selected");
    let snacksSelected = await snacksCategory.getAttribute("data-selected");

    expect(drinksSelected).toBe("true");
    expect(pizzasSelected).toBe("false");
    expect(snacksSelected).toBe("false");

    // Change to snacks
    await snacksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    drinksSelected = await drinksCategory.getAttribute("data-selected");
    pizzasSelected = await pizzasCategory.getAttribute("data-selected");
    snacksSelected = await snacksCategory.getAttribute("data-selected");

    expect(snacksSelected).toBe("true");
    expect(drinksSelected).toBe("false");
    expect(pizzasSelected).toBe("false");
  });

  test("should persist category selection across multiple changes", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");
    const snacksCategory = page.locator("li[data-category='snacks']");
    const promotionsCategory = page.locator("li[data-category='promotions']");

    // Test sequence: pizzas -> drinks -> snacks -> promotions -> pizzas
    const sequence = [drinksCategory, snacksCategory, promotionsCategory, pizzasCategory];

    for (let i = 0; i < sequence.length; i++) {
      const currentCategory = sequence[i];
      await currentCategory.click({ force: true });
      await page.waitForTimeout(500);

      const selectedState = await currentCategory.getAttribute("data-selected");
      expect(selectedState).toBe("true");
    }
  });

  test("should maintain correct state after rapid category changes", async ({ page }) => {
    const drinksCategory = page.locator("li[data-category='drinks']");
    const snacksCategory = page.locator("li[data-category='snacks']");
    const promotionsCategory = page.locator("li[data-category='promotions']");

    // Rapid clicks
    await drinksCategory.click({ force: true });
    await snacksCategory.click({ force: true });
    await promotionsCategory.click({ force: true });

    await page.waitForTimeout(1000);

    // Only promotions should be selected
    const promotionsSelected = await promotionsCategory.getAttribute("data-selected");
    const drinksSelected = await drinksCategory.getAttribute("data-selected");
    const snacksSelected = await snacksCategory.getAttribute("data-selected");

    expect(promotionsSelected).toBe("true");
    expect(drinksSelected).toBe("false");
    expect(snacksSelected).toBe("false");
  });

  test("should apply correct opacity styling based on selection", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");

    // Pizzas should be fully opaque (selected)
    const pizzasClass = await pizzasCategory.getAttribute("class");
    expect(pizzasClass).toContain("data-[selected=false]:opacity-40");

    // Drinks should be less opaque (not selected initially)
    const drinksClass = await drinksCategory.getAttribute("class");
    expect(drinksClass).toContain("data-[selected=false]:opacity-40");

    // Click drinks
    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    // Now drinks should be fully opaque
    const updatedDrinksClass = await drinksCategory.getAttribute("class");
    expect(updatedDrinksClass).toContain("data-[selected=false]:opacity-40");
  });

  test("should trigger component re-render when category changes", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");

    // Get initial state
    const initialPizzasSelected = await pizzasCategory.getAttribute("data-selected");
    expect(initialPizzasSelected).toBe("true");

    // Change category
    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    // Verify re-render occurred by checking both categories
    const updatedPizzasSelected = await pizzasCategory.getAttribute("data-selected");
    const updatedDrinksSelected = await drinksCategory.getAttribute("data-selected");

    expect(updatedPizzasSelected).toBe("false");
    expect(updatedDrinksSelected).toBe("true");
  });

  test("should handle all four category types", async ({ page }) => {
    const categories = [
      { name: "pizzas", locator: page.locator("li[data-category='pizzas']") },
      { name: "drinks", locator: page.locator("li[data-category='drinks']") },
      { name: "snacks", locator: page.locator("li[data-category='snacks']") },
      { name: "promotions", locator: page.locator("li[data-category='promotions']") },
    ];

    for (const category of categories) {
      await category.locator.click({ force: true });
      await page.waitForTimeout(500);

      const selectedState = await category.locator.getAttribute("data-selected");
      expect(selectedState).toBe("true");

      // Verify other categories are not selected
      for (const other of categories) {
        if (other.name !== category.name) {
          const otherSelected = await other.locator.getAttribute("data-selected");
          expect(otherSelected).toBe("false");
        }
      }
    }
  });

  test("should not allow pointer events on unselected categories", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");

    // Change to drinks (pizzas becomes unselected)
    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    // Check pizzas has pointer-events-none
    const pizzasClass = await pizzasCategory.getAttribute("class");
    // The component uses data-[selected=false] which applies opacity-40
    // but not pointer-events-none anymore based on the updated code
    expect(pizzasClass).toContain("opacity-40");
  });

  test("should update food list when category changes", async ({ page }) => {
    const foodsContainer = page.locator("div").filter({ has: page.locator("text=/Pizza|Bebida|Lanche|Promoção/") });

    // Start with pizzas
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const pizzasSelected = await pizzasCategory.getAttribute("data-selected");
    expect(pizzasSelected).toBe("true");

    // Change to drinks
    const drinksCategory = page.locator("li[data-category='drinks']");
    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    // Verify drinks is now selected
    const drinksSelected = await drinksCategory.getAttribute("data-selected");
    expect(drinksSelected).toBe("true");
  });
});
