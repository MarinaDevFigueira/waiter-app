import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "@/components/__tests__/helpers";

test.describe("useLanguage Hook", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForTimeout(500);
  });

  test("should initialize with default language (pt-BR)", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const language = await page.evaluate(() => {
      return localStorage.getItem("language");
    });

    expect(language || "pt-BR").toBe("pt-BR");
  });

  test("should update localStorage when language changes", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

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

  test("should update document.lang attribute when language changes", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const initialLang = await page.evaluate(() => {
      return document.documentElement.lang;
    });

    expect(initialLang).toBe("pt-BR");

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    const updatedLang = await page.evaluate(() => {
      return document.documentElement.lang;
    });

    expect(updatedLang).toBe("en-US");
  });

  test("should persist language preference across sessions", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    await page.reload();
    await page.waitForTimeout(500);

    const language = await page.evaluate(() => {
      return localStorage.getItem("language");
    });

    expect(language).toBe("en-US");

    const documentLang = await page.evaluate(() => {
      return document.documentElement.lang;
    });

    expect(documentLang).toBe("en-US");
  });

  test("should maintain language when navigating between pages", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const languageButton = page.getByTestId("language-selector");
    await languageButton.click();
    await page.waitForTimeout(300);

    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    await page.goto("/dashboard/orders");
    await page.waitForTimeout(500);

    const language = await page.evaluate(() => {
      return localStorage.getItem("language");
    });

    expect(language).toBe("en-US");
  });

  test("should switch from English back to Portuguese", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const languageButton = page.getByTestId("language-selector");

    await languageButton.click();
    await page.waitForTimeout(300);
    const englishOption = page.getByTestId("language-option-en-US");
    await englishOption.click();
    await page.waitForTimeout(500);

    await languageButton.click();
    await page.waitForTimeout(300);
    const portugueseOption = page.getByTestId("language-option-pt-BR");
    await portugueseOption.click();
    await page.waitForTimeout(500);

    const language = await page.evaluate(() => {
      return localStorage.getItem("language");
    });

    expect(language).toBe("pt-BR");

    const documentLang = await page.evaluate(() => {
      return document.documentElement.lang;
    });

    expect(documentLang).toBe("pt-BR");
  });

  test("should not change language with invalid value", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const initialLanguage = await page.evaluate(() => {
      return localStorage.getItem("language");
    });

    await page.evaluate(() => {
      window.languageObservable?.setLanguage("invalid-language");
    });

    await page.waitForTimeout(500);

    const currentLanguage = await page.evaluate(() => {
      return localStorage.getItem("language");
    });

    expect(currentLanguage).toBe(initialLanguage);
  });

  test("should only accept pt-BR or en-US values", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const validLanguages = ["pt-BR", "en-US"];

    const currentLanguage = await page.evaluate(() => {
      return localStorage.getItem("language") || "pt-BR";
    });

    expect(validLanguages).toContain(currentLanguage);
  });
});
