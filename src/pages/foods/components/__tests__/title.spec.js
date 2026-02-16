import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../../components/__tests__/helpers";

test.describe("Title Component", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
  });

  test("should render the title component", async ({ page }) => {
    const titleElement = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    await expect(titleElement).toBeVisible();
  });

  test("should display welcome message", async ({ page }) => {
    const welcomeText = page.getByText("Bem vindo(a) ao");
    await expect(welcomeText).toBeVisible();
  });

  test("should display WAITER in bold uppercase", async ({ page }) => {
    const waiterText = page.locator("strong").filter({ hasText: "WAITER" });
    await expect(waiterText).toBeVisible();

    const waiterClass = await waiterText.getAttribute("class");
    expect(waiterClass).toContain("font-bold");
    expect(waiterClass).toContain("uppercase");
    expect(waiterClass).toContain("font-title");
  });

  test("should display APP in light weight uppercase", async ({ page }) => {
    const appText = page.locator("span.pl-0\\.5").filter({ hasText: /^App$/i });
    await expect(appText).toBeVisible();

    const appClass = await appText.getAttribute("class");
    expect(appClass).toContain("font-extralight");
  });

  test("should have proper text styling on welcome message", async ({ page }) => {
    const welcomeText = page.getByText("Bem vindo(a) ao");
    const welcomeClass = await welcomeText.getAttribute("class");

    expect(welcomeClass).toContain("text-muted-foreground");
  });

  test("should have proper layout structure", async ({ page }) => {
    const titleContainer = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    const containerClass = await titleContainer.getAttribute("class");

    expect(containerClass).toContain("flex");
    expect(containerClass).toContain("flex-col");
    expect(containerClass).toContain("w-full");
  });

  test("should have proper spacing between elements", async ({ page }) => {
    const titleContainer = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    const containerClass = await titleContainer.getAttribute("class");

    expect(containerClass).toContain("gap-1");
  });

  test("should display all text elements in correct order", async ({ page }) => {
    const titleContainer = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    const welcomeSpan = titleContainer.locator("span").filter({ hasText: "Bem vindo(a) ao" });
    const brandingSpan = titleContainer.locator("span").filter({ hasText: "Waiter" });

    await expect(welcomeSpan).toBeVisible();
    await expect(brandingSpan).toBeVisible();
  });

  test("should have responsive text sizing", async ({ page }) => {
    const titleContainer = page.locator("p").filter({ hasText: "Bem vindo(a) ao" });
    const brandingContainer = titleContainer.locator("span.text-xl");
    await expect(brandingContainer).toBeVisible();

    const containerClass = await brandingContainer.getAttribute("class");
    expect(containerClass).toContain("text-xl");
    expect(containerClass).toContain("sm:text-2xl");
  });

  test("should maintain proper spacing for APP text", async ({ page }) => {
    const appText = page.locator("span.pl-0\\.5").filter({ hasText: /^App$/i });
    await expect(appText).toBeVisible();

    const appClass = await appText.getAttribute("class");
    expect(appClass).toContain("pl-0.5");
  });
});
