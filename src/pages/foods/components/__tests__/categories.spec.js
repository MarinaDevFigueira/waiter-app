import { test, expect } from "@playwright/test";

test.describe("Categories Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();
  });

  test("renders all four category items", async ({ page }) => {
    const categoryItems = page.locator("li[data-category]");
    await expect(categoryItems).toHaveCount(4);
  });

  test("renders pizza category", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    await expect(pizzaItem).toBeVisible();
  });

  test("renders drinks category", async ({ page }) => {
    const drinksItem = page.locator("li[data-category='drinks']");
    await expect(drinksItem).toBeVisible();
  });

  test("renders snacks category", async ({ page }) => {
    const snacksItem = page.locator("li[data-category='snacks']");
    await expect(snacksItem).toBeVisible();
  });

  test("renders promotions category", async ({ page }) => {
    const promotionsItem = page.locator("li[data-category='promotions']");
    await expect(promotionsItem).toBeVisible();
  });

  test("renders correct category labels", async ({ page }) => {
    const pizzaLabel = page.locator("li[data-category='pizzas']").getByText("Pizzas");
    const drinksLabel = page.locator("li[data-category='drinks']").getByText("Bebidas");
    const snacksLabel = page.locator("li[data-category='snacks']").getByText("Lanches");
    const promotionsLabel = page.locator("li[data-category='promotions']").getByText("Promoções");

    await expect(pizzaLabel).toBeVisible();
    await expect(drinksLabel).toBeVisible();
    await expect(snacksLabel).toBeVisible();
    await expect(promotionsLabel).toBeVisible();
  });

  test("pizza category has orange background color class", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const style = await pizzaItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });
    expect(style).toContain("bg-orange-100");
  });

  test("drinks category has blue background color class", async ({ page }) => {
    const drinksItem = page.locator("li[data-category='drinks']");
    const style = await drinksItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });
    expect(style).toContain("bg-blue-100");
  });

  test("snacks category has amber background color class", async ({ page }) => {
    const snacksItem = page.locator("li[data-category='snacks']");
    const style = await snacksItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });
    expect(style).toContain("bg-amber-100");
  });

  test("promotions category has pink background color class", async ({ page }) => {
    const promotionsItem = page.locator("li[data-category='promotions']");
    const style = await promotionsItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });
    expect(style).toContain("bg-pink-100");
  });

  test("pizza icon has orange color class", async ({ page }) => {
    const pizzaIcon = page.locator("li[data-category='pizzas'] svg");
    const className = await pizzaIcon.getAttribute("class");
    expect(className).toContain("text-orange-600");
  });

  test("drinks icon has blue color class", async ({ page }) => {
    const drinksIcon = page.locator("li[data-category='drinks'] svg");
    const className = await drinksIcon.getAttribute("class");
    expect(className).toContain("text-blue-600");
  });

  test("snacks icon has amber color class", async ({ page }) => {
    const snacksIcon = page.locator("li[data-category='snacks'] svg");
    const className = await snacksIcon.getAttribute("class");
    expect(className).toContain("text-amber-700");
  });

  test("promotions icon has pink color class", async ({ page }) => {
    const promotionsIcon = page.locator("li[data-category='promotions'] svg");
    const className = await promotionsIcon.getAttribute("class");
    expect(className).toContain("text-pink-600");
  });

  test("categories list is styled with flex layout", async ({ page }) => {
    const ul = page.locator("ul").filter({ has: page.locator("li[data-category]") });
    const className = await ul.getAttribute("class");

    expect(className).toContain("w-full");
    expect(className).toContain("flex");
    expect(className).toContain("flex-row");
    expect(className).toContain("overflow-x-auto");
  });

  test("all categories use list item elements", async ({ page }) => {
    const categories = page.locator("li[data-category]");
    const count = await categories.count();
    expect(count).toBe(4);
  });

  test("each category item contains icon and label", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const innerDiv = pizzaItem.locator("> div");
    const label = pizzaItem.locator("span");

    await expect(innerDiv).toBeVisible();
    await expect(label).toBeVisible();
  });

  test("icons are sized correctly on mobile", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const style = await pizzaItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });

    expect(style).toContain("w-8");
    expect(style).toContain("h-8");
  });

  test("icons are responsive sized", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const style = await pizzaItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });

    expect(style).toContain("sm:w-10");
    expect(style).toContain("sm:h-10");
  });

  test("icon containers are circular", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const style = await pizzaItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });

    expect(style).toContain("rounded-full");
  });

  test("icon containers use flex centering", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const style = await pizzaItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });

    expect(style).toContain("flex");
    expect(style).toContain("items-center");
    expect(style).toContain("justify-center");
  });

  test("icon containers have shadow", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const style = await pizzaItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });

    expect(style).toContain("shadow-xs");
  });

  test("icon containers have padding", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const style = await pizzaItem.evaluate((el) => {
      const div = el.querySelector("div:nth-child(2)");
      return div.className;
    });

    expect(style).toContain("p-1.5");
    expect(style).toContain("sm:p-2");
  });

  test("all SVG icons are rendered", async ({ page }) => {
    const icons = page.locator("li[data-category] svg");
    const count = await icons.count();
    expect(count).toBe(4);
  });

  test("category labels have responsive text sizing", async ({ page }) => {
    const pizzaLabel = page.locator("li[data-category='pizzas']").locator("span").last();
    const className = await pizzaLabel.getAttribute("class");

    expect(className).toContain("text-xs");
    expect(className).toContain("sm:text-sm");
  });

  test("category labels are semibold", async ({ page }) => {
    const pizzaLabel = page.locator("li[data-category='pizzas']").locator("span").last();
    const className = await pizzaLabel.getAttribute("class");

    expect(className).toContain("font-semibold");
  });

  test("category labels are centered", async ({ page }) => {
    const pizzaLabel = page.locator("li[data-category='pizzas']").locator("span").last();
    const className = await pizzaLabel.getAttribute("class");

    expect(className).toContain("text-center");
  });

  test("category items have transition opacity", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const className = await pizzaItem.getAttribute("class");

    expect(className).toContain("transition-opacity");
  });

  test("category items have responsive gap spacing", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const className = await pizzaItem.getAttribute("class");

    expect(className).toContain("gap-2");
    expect(className).toContain("sm:gap-3");
  });

  test("categories list has bottom padding", async ({ page }) => {
    const ul = page.locator("ul").filter({ has: page.locator("li[data-category]") });
    const className = await ul.getAttribute("class");

    expect(className).toContain("pb-2");
  });

  test("all items have data-selected attribute", async ({ page }) => {
    const items = page.locator("li[data-category]");
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const hasAttr = await items.nth(i).evaluate((el) => el.hasAttribute("data-selected"));
      expect(hasAttr).toBe(true);
    }
  });

  test("pizza category value is correct", async ({ page }) => {
    const value = await page.locator("li[data-category='pizzas']").getAttribute("data-category");
    expect(value).toBe("pizzas");
  });

  test("drinks category value is correct", async ({ page }) => {
    const value = await page.locator("li[data-category='drinks']").getAttribute("data-category");
    expect(value).toBe("drinks");
  });

  test("snacks category value is correct", async ({ page }) => {
    const value = await page.locator("li[data-category='snacks']").getAttribute("data-category");
    expect(value).toBe("snacks");
  });

  test("promotions category value is correct", async ({ page }) => {
    const value = await page.locator("li[data-category='promotions']").getAttribute("data-category");
    expect(value).toBe("promotions");
  });

  test("category group styling is applied", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const className = await pizzaItem.getAttribute("class");

    expect(className).toContain("group");
  });

  test("flexbox structure on main item", async ({ page }) => {
    const pizzaItem = page.locator("li[data-category='pizzas']");
    const className = await pizzaItem.getAttribute("class");

    expect(className).toContain("flex");
    expect(className).toContain("items-center");
  });
});
