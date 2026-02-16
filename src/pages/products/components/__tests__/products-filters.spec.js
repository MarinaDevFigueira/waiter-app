import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../../../../components/__tests__/helpers";

test.describe("ProductsFilters Component", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForTimeout(1000);
  });

  test("should render search input", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");
    await expect(searchInput).toBeVisible();
  });

  test("should render search button", async ({ page }) => {
    const searchButton = page.locator("button").filter({ hasText: "Buscar" });
    await expect(searchButton).toBeVisible();
  });

  test("should render filters button", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await expect(filtersButton).toBeVisible();
  });

  test("should allow typing in search input", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");

    await searchInput.fill("Pizza");
    const value = await searchInput.inputValue();

    expect(value).toBe("Pizza");
  });

  test("should trigger search on button click", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");
    const searchButton = page.locator("button").filter({ hasText: "Buscar" });

    await searchInput.fill("Hamburguer");
    await searchButton.click();
    await page.waitForTimeout(500);
  });

  test("should trigger search on Enter key", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");

    await searchInput.fill("Bebida");
    await searchInput.press("Enter");
    await page.waitForTimeout(500);
  });

  test("should open filters modal on button click", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });

    await filtersButton.click();
    await page.waitForTimeout(500);

    const modalTitle = page.getByText("Filtros de Produtos");
    await expect(modalTitle).toBeVisible();
  });

  test("should close filters modal", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });

    await filtersButton.click();
    await page.waitForTimeout(500);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  });

  test("should display category filter in modal", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const categoryLabel = page.locator("label").filter({ hasText: "Categoria" }).first();
    await expect(categoryLabel).toBeVisible();
  });

  test("should display price range filter in modal", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const priceLabel = page.getByText("Faixa de Preço");
    await expect(priceLabel).toBeVisible();
  });

  test("should display status filter in modal", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const statusLabel = page.locator("label").filter({ hasText: /^Status$/ });
    await expect(statusLabel).toBeVisible();
  });

  test("should have clear filters button in modal", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const clearButton = page.locator("button").filter({ hasText: "Limpar" });
    await expect(clearButton).toBeVisible();
  });

  test("should have apply filters button in modal", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const applyButton = page.locator("button").filter({ hasText: "Aplicar Filtros" });
    await expect(applyButton).toBeVisible();
  });

  test("should display search icon", async ({ page }) => {
    const searchContainer = page.locator("div.relative").first();
    const searchIcon = searchContainer.locator("svg").first();

    await expect(searchIcon).toBeVisible();
  });

  test("should display sliders icon on filters button", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    const icon = filtersButton.locator("svg");

    await expect(icon).toBeVisible();
  });

  test("should have proper search input styling", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");
    const inputClass = await searchInput.getAttribute("class");

    expect(inputClass).toContain("pl-9");
    expect(inputClass).toContain("pr-20");
  });

  test("should maintain input value after modal interaction", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });

    await searchInput.fill("Test Product");

    await filtersButton.click();
    await page.waitForTimeout(300);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    const value = await searchInput.inputValue();
    expect(value).toBe("Test Product");
  });

  test("should display min and max price inputs", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const minPriceInput = page.locator("input#precoMin");
    const maxPriceInput = page.locator("input#precoMax");

    await expect(minPriceInput).toBeVisible();
    await expect(maxPriceInput).toBeVisible();
  });

  test("should allow entering price values", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const minPriceInput = page.locator("input#precoMin");
    const maxPriceInput = page.locator("input#precoMax");

    await minPriceInput.fill("10");
    await maxPriceInput.fill("50");

    expect(await minPriceInput.inputValue()).toBe("10");
    expect(await maxPriceInput.inputValue()).toBe("50");
  });

  test("should display status checkboxes", async ({ page }) => {
    const filtersButton = page.locator("button").filter({ hasText: "Filtros" });
    await filtersButton.click();
    await page.waitForTimeout(500);

    const ativoLabel = page.locator("label").filter({ hasText: /^Ativo$/ });
    const inativoLabel = page.locator("label").filter({ hasText: /^Inativo$/ });

    await expect(ativoLabel).toBeVisible();
    await expect(inativoLabel).toBeVisible();
  });

  test("should clear search input", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Buscar produtos...']");

    await searchInput.fill("Product Name");
    await searchInput.clear();

    const value = await searchInput.inputValue();
    expect(value).toBe("");
  });
});
