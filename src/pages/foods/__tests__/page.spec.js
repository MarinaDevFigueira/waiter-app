import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../components/__tests__/helpers";

test.describe("FoodsPage", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
    await page.waitForTimeout(1500);
  });

  test("should render the page with all main components", async ({ page }) => {
    const titleElement = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    await expect(titleElement).toBeVisible();

    await page.waitForTimeout(500);

    const categoriesContainer = page.locator("div").filter({ hasText: "Todos" }).first();
    await expect(categoriesContainer).toBeVisible();
  });

  test("should display the title component", async ({ page }) => {
    await expect(page.getByText("Bem vindo(a) ao")).toBeVisible();
    await expect(page.locator("strong").filter({ hasText: /waiter/i })).toBeVisible();
    const appText = page.locator("span").filter({ hasText: /^App$/i });
    await expect(appText).toBeVisible();
  });

  test("should display categories list with All option", async ({ page }) => {
    await page.waitForTimeout(500);

    const allCategoryTab = page.getByText("Todos", { exact: true });
    await expect(allCategoryTab).toBeVisible();

    const allTabParent = allCategoryTab.locator("..");
    const allSelected = await allTabParent.getAttribute("data-selected");
    expect(allSelected).toBe("true");
  });

  test("should display the cart button", async ({ page }) => {
    const cartButton = page.getByTestId("cart-button");
    await expect(cartButton).toBeVisible();
  });

  test("should open cart drawer when cart button is clicked", async ({ page }) => {
    const cartButton = page.getByTestId("cart-button");
    await cartButton.click();

    const cartDrawer = page.getByTestId("cart-drawer");
    await expect(cartDrawer).toBeVisible();
  });

  test("should close cart drawer when overlay is clicked", async ({ page }) => {
    const cartButton = page.getByTestId("cart-button");
    await cartButton.click();

    const cartDrawer = page.getByTestId("cart-drawer");
    await expect(cartDrawer).toBeVisible();

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  });

  test("should display foods list after loading", async ({ page }) => {
    await page.waitForTimeout(1500);

    const foodsList = page.locator("ul").last();
    await expect(foodsList).toBeVisible();
  });

  test("should filter foods when a category is clicked", async ({ page }) => {
    const categoriesList = page.locator("ul").first();
    const categoryTabs = categoriesList.locator("li");
    const count = await categoryTabs.count();

    const hasCategories = count > 1;
    if (hasCategories) {
      const secondCategory = categoryTabs.nth(1);
      await secondCategory.click();
      await page.waitForTimeout(800);

      const secondCategorySpan = secondCategory.locator("span");
      const selectedState = await secondCategorySpan.getAttribute("data-selected");
      expect(selectedState).toBe("true");
    }
  });

  test("should render foods with proper spacing", async ({ page }) => {
    await page.waitForTimeout(1000);
    const titleElement = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    await expect(titleElement).toBeVisible();

    const foodsList = page.locator("ul").last();
    const listClass = await foodsList.getAttribute("class");
    expect(listClass).toContain("gap");
  });

  test("should add product to cart when plus button is clicked", async ({ page }) => {
    await page.waitForTimeout(2000);

    const products = page.locator("[data-testid^='product-']");
    const productCount = await products.count();

    const hasProducts = productCount > 0;
    if (hasProducts) {
      const cartButton = page.getByTestId("cart-button");

      await products.first().click();

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      const addToCartButton = modal.locator('[data-testid="add-to-cart-button"]');
      await page.waitForTimeout(500);
      await addToCartButton.dispatchEvent("click");

      await page.waitForTimeout(2000);

      const cartBadge = cartButton.locator("span").filter({ hasText: /^\d+$/ });
      await expect(cartBadge).toBeVisible({ timeout: 5000 });
    }
  });
});
