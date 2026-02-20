import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "@/components/__tests__/helpers";

test.describe("useTranslation Hook", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("orders-view", "kitchen");
    });
    await loginAsAdmin(page);
    await page.waitForTimeout(500);
  });

  test("should display Portuguese text by default", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("domcontentloaded");

    const title = page.getByTestId("kitchen-orders-title");
    await expect(title).toHaveText("Pedidos da Cozinha");

    const subtitle = page.getByTestId("kitchen-orders-subtitle");
    await expect(subtitle).toHaveText("Gerencie os pedidos em preparação");
  });

  test("should switch to English when language is changed", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("domcontentloaded");

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    const title = page.getByTestId("kitchen-orders-title");
    await expect(title).toHaveText("Kitchen Orders");

    const subtitle = page.getByTestId("kitchen-orders-subtitle");
    await expect(subtitle).toHaveText("Manage orders in preparation");
  });

  test("should persist language preference after page reload", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("domcontentloaded");

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    await page.reload();
    await page.waitForTimeout(500);

    const title = page.getByTestId("kitchen-orders-title");
    await expect(title).toHaveText("Kitchen Orders");
  });

  test("should maintain language across navigation", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("domcontentloaded");

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    await page.goto("/dashboard/products");
    await page.waitForTimeout(500);

    const title = page.locator("h1").first();
    await expect(title).toHaveText("Products");
  });

  test("should translate status labels", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector('[data-testid="kitchen-orders-grid"]', { state: 'visible', timeout: 15000 });

    const grid = page.getByTestId("kitchen-orders-grid");
    const statusElement = grid.getByTestId("order-status").first();
    const portugueseStatus = await statusElement.textContent();
    expect(["Pendente", "Preparando", "Pronto"]).toContain(portugueseStatus);

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    const englishStatus = await statusElement.textContent();
    expect(["Pending", "Preparing", "Ready"]).toContain(englishStatus);
  });

  test("should translate navigation menu items", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const ordersLink = page.locator('a[href="/dashboard/orders"]').first();
    await expect(ordersLink).toContainText("Pedidos");

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    await expect(ordersLink).toContainText("Orders");
  });


});
