import { test, expect } from "@playwright/test";

test.describe("Food Filtering by Category", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();
  });

  test("should display pizzas by default", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    await expect(pizzasCategory).toHaveAttribute("data-selected", "true");
  });

  test("should switch to drinks category when clicked", async ({ page }) => {
    const drinksCategory = page.locator("li[data-category='drinks']");
    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    await expect(drinksCategory).toHaveAttribute("data-selected", "true");
  });

  test("should switch to snacks category when clicked", async ({ page }) => {
    const snacksCategory = page.locator("li[data-category='snacks']");
    await snacksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    await expect(snacksCategory).toHaveAttribute("data-selected", "true");
  });

  test("should switch to promotions category when clicked", async ({ page }) => {
    const promotionsCategory = page.locator("li[data-category='promotions']");
    await promotionsCategory.click({ force: true });
    await page.waitForTimeout(1000);

    await expect(promotionsCategory).toHaveAttribute("data-selected", "true");
  });

  test("only one category should be selected at a time", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");

    await drinksCategory.click({ force: true });
    await page.waitForTimeout(1000);

    await expect(drinksCategory).toHaveAttribute("data-selected", "true");
    await expect(pizzasCategory).toHaveAttribute("data-selected", "false");
  });

  test("should maintain category selection after switching multiple times", async ({ page }) => {
    const pizzasCategory = page.locator("li[data-category='pizzas']");
    const drinksCategory = page.locator("li[data-category='drinks']");
    const snacksCategory = page.locator("li[data-category='snacks']");

    await drinksCategory.click({ force: true });
    await page.waitForTimeout(500);
    await snacksCategory.click({ force: true });
    await page.waitForTimeout(500);
    await pizzasCategory.click({ force: true });
    await page.waitForTimeout(500);

    await expect(pizzasCategory).toHaveAttribute("data-selected", "true");
    await expect(drinksCategory).toHaveAttribute("data-selected", "false");
    await expect(snacksCategory).toHaveAttribute("data-selected", "false");
  });

  test("all categories should be clickable", async ({ page }) => {
    const categories = ["pizzas", "drinks", "snacks", "promotions"];

    for (const cat of categories) {
      const categoryItem = page.locator(`li[data-category='${cat}']`);
      await categoryItem.click({ force: true });
      await page.waitForTimeout(500);
      await expect(categoryItem).toHaveAttribute("data-selected", "true");
    }
  });
});
