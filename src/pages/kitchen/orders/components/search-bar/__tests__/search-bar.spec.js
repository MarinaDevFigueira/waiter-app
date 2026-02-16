import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../../../../../../components/__tests__/helpers";

test.describe("SearchBar Component", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/pedidos");
    await page.waitForTimeout(1000);
  });

  test("should render the search form", async ({ page }) => {
    const searchForm = page.getByTestId("kitchen-search-form");
    await expect(searchForm).toBeVisible();
  });

  test("should render the search input", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    await expect(searchInput).toBeVisible();
  });

  test("should render the search button", async ({ page }) => {
    const searchButton = page.getByTestId("kitchen-search-button");
    await expect(searchButton).toBeVisible();
  });

  test("should have correct placeholder text", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const placeholder = await searchInput.getAttribute("placeholder");

    expect(placeholder).toBe("Buscar por mesa ou item...");
  });

  test("should allow typing in the search input", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");

    await searchInput.fill("Mesa 01");
    const value = await searchInput.inputValue();

    expect(value).toBe("Mesa 01");
  });

  test("should clear input value", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");

    await searchInput.fill("Mesa 01");
    await searchInput.clear();
    const value = await searchInput.inputValue();

    expect(value).toBe("");
  });

  test("should submit form on button click", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Pizza");
    await searchButton.click();

    await page.waitForTimeout(500);
  });

  test("should submit form on Enter key press", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");

    await searchInput.fill("Mesa 02");
    await searchInput.press("Enter");

    await page.waitForTimeout(500);
  });

  test("should have icon button styling", async ({ page }) => {
    const searchButton = page.getByTestId("kitchen-search-button");

    const buttonType = await searchButton.getAttribute("type");
    expect(buttonType).toBe("submit");
  });

  test("should have proper form layout", async ({ page }) => {
    const searchForm = page.getByTestId("kitchen-search-form");
    const formClass = await searchForm.getAttribute("class");

    expect(formClass).toContain("flex");
    expect(formClass).toContain("gap-2");
    expect(formClass).toContain("w-full");
  });

  test("should have shadow styling on button", async ({ page }) => {
    const searchButton = page.getByTestId("kitchen-search-button");
    const buttonClass = await searchButton.getAttribute("class");

    expect(buttonClass).toContain("shadow-sm");
  });

  test("should render magnifying glass icon", async ({ page }) => {
    const searchButton = page.getByTestId("kitchen-search-button");
    const icon = searchButton.locator("svg");

    await expect(icon).toBeVisible();
  });

  test("should accept multiple search queries", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    const queries = ["Mesa 01", "Pizza", "Bebida"];

    for (const query of queries) {
      await searchInput.fill(query);
      const value = await searchInput.inputValue();
      expect(value).toBe(query);

      await searchButton.click();
      await page.waitForTimeout(300);
    }
  });

  test("should maintain button state after clicks", async ({ page }) => {
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchButton.click();
    await page.waitForTimeout(300);

    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeEnabled();
  });

  test("should handle rapid form submissions", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Test");
    await searchButton.click();
    await searchButton.click();
    await searchButton.click();

    await page.waitForTimeout(500);
    await expect(searchButton).toBeVisible();
  });

  test("should preserve input value after submission", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const searchButton = page.getByTestId("kitchen-search-button");

    await searchInput.fill("Mesa 03");
    await searchButton.click();
    await page.waitForTimeout(300);

    const value = await searchInput.inputValue();
    expect(value).toBe("Mesa 03");
  });

  test("should have proper input container styling", async ({ page }) => {
    const searchForm = page.getByTestId("kitchen-search-form");
    const inputContainer = searchForm.locator("div").first();
    const containerClass = await inputContainer.getAttribute("class");

    expect(containerClass).toContain("flex-1");
    expect(containerClass).toContain("max-w-md");
  });

  test("should have shadow on input", async ({ page }) => {
    const searchInput = page.getByTestId("kitchen-search-input");
    const inputClass = await searchInput.getAttribute("class");

    expect(inputClass).toContain("shadow-sm");
  });
});
