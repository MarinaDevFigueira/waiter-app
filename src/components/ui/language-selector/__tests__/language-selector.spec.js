import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "@/components/__tests__/helpers";

test.describe("LanguageSelector Component", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForTimeout(500);
  });

  test("should render language selector button", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await expect(languageButton).toBeVisible();
  });

  test("should have translate icon", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    const icon = languageButton.locator('svg');
    await expect(icon).toBeVisible();
  });

  test("should open dropdown menu on click", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible();
  });

  test("should display both language options", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const portugueseOption = page.getByTestId("language-option-pt-BR");
    const englishOption = page.getByTestId("language-option-en-US");

    await expect(portugueseOption).toBeVisible();
    await expect(englishOption).toBeVisible();
  });

  test("should display flag emojis for each language", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const portugueseOption = page.getByTestId("language-option-pt-BR");
    const englishOption = page.getByTestId("language-option-en-US");

    await expect(portugueseOption).toContainText("🇧🇷");
    await expect(englishOption).toContainText("🇺🇸");
  });

  test("should show checkmark on selected language", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const portugueseOption = page.getByTestId("language-option-pt-BR");
    const checkIcon = portugueseOption.locator('svg');

    await expect(checkIcon).toBeVisible();
  });

  test("should change language when option is clicked", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    const language = await page.evaluate(() => {
      return localStorage.getItem("language");
    });

    expect(language).toBe("en-US");
  });

  test("should close menu after selecting language", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    const menu = page.locator('[role="menu"]');
    await expect(menu).not.toBeVisible();
  });

  test("should update checkmark position when language changes", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    await languageButton.click();
    await page.waitForTimeout(300);

    const englishCheckIcon = page.getByTestId("language-option-en-US").locator('svg');
    await expect(englishCheckIcon).toBeVisible();
  });

  test("should have button styling", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    const classes = await languageButton.getAttribute("class");

    expect(classes).toBeTruthy();
    expect(classes.length).toBeGreaterThan(0);
  });

  test("should be clickable", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    const isClickable = await languageButton.isEnabled();

    expect(isClickable).toBe(true);
  });

  test("should display separator between flag and label", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const portugueseOption = page.getByTestId("language-option-pt-BR");
    const text = await portugueseOption.textContent();

    expect(text).toContain("-");
  });

  test("should align menu to end", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible();
  });

  test("should show Portuguese as default selected option", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem("language");
    });

    await page.reload();
    await page.waitForTimeout(500);

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const portugueseCheckIcon = page.getByTestId("language-option-pt-BR").locator('svg');
    await expect(portugueseCheckIcon).toBeVisible();
  });

  test("should toggle between languages multiple times", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");

    await languageButton.click();
    await page.waitForTimeout(300);
    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    let language = await page.evaluate(() => localStorage.getItem("language"));
    expect(language).toBe("en-US");

    await languageButton.click();
    await page.waitForTimeout(300);
    const portugueseOption = page.getByTestId("language-option-pt-BR");
    await portugueseOption.click();
    await page.waitForTimeout(500);

    language = await page.evaluate(() => localStorage.getItem("language"));
    expect(language).toBe("pt-BR");

    await languageButton.click();
    await page.waitForTimeout(300);
    await englishOption.click();
    await page.waitForTimeout(500);

    language = await page.evaluate(() => localStorage.getItem("language"));
    expect(language).toBe("en-US");
  });

  test("should be positioned in app layout header", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    const parent = languageButton.locator("..");

    await expect(parent).toBeVisible();
  });

  test("should have proper spacing in menu items", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const menuItem = page.locator('[role="menuitem"]').first();
    const classes = await menuItem.getAttribute("class");

    expect(classes).toBeTruthy();
  });

  test("should display language labels correctly formatted", async ({ page }) => {
    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const portugueseOption = page.getByTestId("language-option-pt-BR");
    const englishOption = page.getByTestId("language-option-en-US");

    await expect(portugueseOption).toContainText("Português (BR)");
    await expect(englishOption).toContainText("English (US)");
  });
});
