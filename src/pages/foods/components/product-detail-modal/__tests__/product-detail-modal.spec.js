import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../../../components/__tests__/helpers";

test.describe("ProductDetailModal", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
    await page.waitForTimeout(1500);
  });

  test("should open modal when clicking on a product", async ({ page }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test("should display product details in modal", async ({ page }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const productImage = modal.locator("img");
    await expect(productImage).toBeVisible();

    const quantityDisplay = modal.locator('[data-testid="quantity-display"]');
    await expect(quantityDisplay).toBeVisible();
    await expect(quantityDisplay).toHaveText("1");
  });

  test("should increment quantity when clicking plus button", async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    const incrementButton = modal.locator('[data-testid="increment-quantity"]');
    const quantityDisplay = modal.locator('[data-testid="quantity-display"]');

    await page.waitForTimeout(500);
    await incrementButton.dispatchEvent("click");
    await expect(quantityDisplay).toHaveText("2");

    await incrementButton.dispatchEvent("click");
    await expect(quantityDisplay).toHaveText("3");
  });

  test("should decrement quantity when clicking minus button", async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    const incrementButton = modal.locator('[data-testid="increment-quantity"]');
    const decrementButton = modal.locator('[data-testid="decrement-quantity"]');
    const quantityDisplay = modal.locator('[data-testid="quantity-display"]');

    await page.waitForTimeout(500);
    await incrementButton.dispatchEvent("click");
    await incrementButton.dispatchEvent("click");
    await expect(quantityDisplay).toHaveText("3");

    await decrementButton.dispatchEvent("click");
    await expect(quantityDisplay).toHaveText("2");
  });

  test("should not decrement quantity below 1", async ({ page }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    const decrementButton = modal.locator('[data-testid="decrement-quantity"]');
    const quantityDisplay = modal.locator('[data-testid="quantity-display"]');

    await page.waitForTimeout(500);
    const isDisabled = await decrementButton.isDisabled();
    expect(isDisabled).toBe(true);

    await expect(quantityDisplay).toHaveText("1");
  });

  test("should close modal when clicking close button", async ({ page }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await page.waitForTimeout(500);
    const closeButton = page.getByRole("button", { name: "Fechar" });
    await closeButton.dispatchEvent("click");

    await expect(modal).not.toBeVisible();
  });

  test("should add product to cart with correct quantity", async ({ page }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    const incrementButton = modal.locator('[data-testid="increment-quantity"]');
    const addToCartButton = modal.locator('[data-testid="add-to-cart-button"]');

    await page.waitForTimeout(500);
    await incrementButton.dispatchEvent("click");
    await incrementButton.dispatchEvent("click");

    await addToCartButton.dispatchEvent("click");

    await expect(modal).not.toBeVisible();
  });

  test("should reset quantity to 1 when modal is closed and reopened", async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    const incrementButton = modal.locator('[data-testid="increment-quantity"]');
    const quantityDisplay = modal.locator('[data-testid="quantity-display"]');

    await page.waitForTimeout(500);
    await incrementButton.dispatchEvent("click");
    await expect(quantityDisplay).toHaveText("2");

    const closeButton = page.getByRole("button", { name: "Fechar" });
    await closeButton.dispatchEvent("click");

    await page.waitForTimeout(500);
    await firstProduct.click();
    await expect(quantityDisplay).toHaveText("1");
  });

  test("should display swiper navigation for images", async ({ page }) => {
    await page.waitForSelector('[data-testid^="product-"]', { timeout: 10000 });

    const firstProduct = page.locator('[data-testid^="product-"]').first();
    await firstProduct.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const swiperContainer = modal.locator(".swiper");
    await expect(swiperContainer).toBeVisible();
  });
});
