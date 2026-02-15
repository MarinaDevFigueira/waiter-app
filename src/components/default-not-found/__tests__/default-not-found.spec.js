import { test, expect } from "@playwright/test";
import { disableSplashScreen } from "../../__tests__/helpers";

test.describe("DefaultNotFound Component", () => {
  test("404 page renders when route not found", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/this-route-does-not-exist");

    const title = page.locator("h3").filter({ hasText: "404" });
    await expect(title).toBeVisible();
  });

  test("displays 'Página não encontrada' message", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/invalid-route");

    const heading = page.locator("h3").filter({ hasText: "Página não encontrada" });
    await expect(heading).toBeVisible();
  });

  test("shows descriptive error message", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/some-random-path");

    const description = page.locator("p").filter({
      hasText: "A página que você está procurando não existe ou foi removida",
    });
    await expect(description).toBeVisible();
  });

  test("has button to return home", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/non-existent");

    const homeButton = page.getByTestId("go-home-button");
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toContainText("Voltar para a página inicial");
  });

  test("clicking home button navigates to root", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/does-not-exist");

    const homeButton = page.getByTestId("go-home-button");
    await homeButton.click();

    await page.waitForURL("/");
    expect(page.url()).toContain("/");
  });

  test("home button has house icon", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/404");

    const homeButton = page.getByTestId("go-home-button");
    const icon = homeButton.locator("svg");

    await expect(icon).toBeVisible();
  });
});
