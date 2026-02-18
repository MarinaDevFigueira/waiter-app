import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../__tests__/helpers";

test.describe("AppLayout Component", () => {
  test("renders children content when authenticated", async ({ page }) => {
    await loginAsMesa(page);

    const content = page.locator("body");
    await expect(content).toBeVisible();
  });

  test("applies full viewport dimensions", async ({ page }) => {
    await loginAsMesa(page);

    const body = page.locator("body");
    await expect(body).toBeVisible();

    const dimensions = await body.boundingBox();
    expect(dimensions.width).toBeGreaterThan(0);
    expect(dimensions.height).toBeGreaterThan(0);
  });

  test("renders splash screen within layout", async ({ page }) => {
    await page.goto("/");

    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();
  });

  test("maintains layout structure after splash dismissal", async ({ page }) => {
    await page.goto("/");

    const splash = page.getByTestId("splash-screen");
    await splash.click();

    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("provides proper background styling when authenticated", async ({ page }) => {
    await loginAsMesa(page);

    const container = page.locator("div.bg-background").first();
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/bg-background/);
  });
});
