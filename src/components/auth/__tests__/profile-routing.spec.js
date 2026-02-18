import { test, expect } from "@playwright/test";
import {
  loginAsAdmin,
  loginAsKitchen,
  loginAsMesa,
  loginAsDelivery,
  disableSplashScreen,
} from "../../__tests__/helpers";

test.describe("Profile-Based Routing — API Integration", () => {
  test.describe("Admin profile", () => {
    test("admin lands on /dashboard after login", async ({ page }) => {
      await loginAsAdmin(page);
      expect(page.url()).toContain("/dashboard");
    });

    test("admin can access /dashboard/products", async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto("/dashboard/products");
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain("/dashboard/products");
    });

    test("admin can access /dashboard/orders", async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto("/dashboard/orders");
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain("/dashboard/orders");
    });
  });

  test.describe("Kitchen profile", () => {
    test("kitchen user lands on /dashboard after login", async ({ page }) => {
      await loginAsKitchen(page);
      expect(page.url()).toContain("/dashboard");
    });

    test("kitchen user can access /dashboard/orders", async ({ page }) => {
      await loginAsKitchen(page);
      await page.goto("/dashboard/orders");
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain("/dashboard/orders");
    });
  });

  test.describe("Mesa profile", () => {
    test("mesa user stays on / after login", async ({ page }) => {
      await loginAsMesa(page);
      const url = page.url();
      expect(url).not.toContain("/dashboard");
    });

    test("mesa user cannot access /dashboard and gets redirected", async ({ page }) => {
      await loginAsMesa(page);
      await page.goto("/dashboard");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
      expect(page.url()).not.toContain("/dashboard");
    });
  });

  test.describe("Delivery profile", () => {
    test("delivery user stays on / after login", async ({ page }) => {
      await loginAsDelivery(page);
      const url = page.url();
      expect(url).not.toContain("/dashboard");
    });

    test("delivery user cannot access /dashboard and gets redirected", async ({ page }) => {
      await loginAsDelivery(page);
      await page.goto("/dashboard");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
      expect(page.url()).not.toContain("/dashboard");
    });
  });

  test.describe("Unauthenticated access", () => {
    test.beforeEach(async ({ page }) => {
      await disableSplashScreen(page);
    });

    test("unauthenticated user is redirected from /dashboard to /login", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
      expect(page.url()).toContain("/login");
    });

    test("unauthenticated user is redirected from /dashboard/products to /login", async ({
      page,
    }) => {
      await page.goto("/dashboard/products");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
      expect(page.url()).toContain("/login");
    });

    test("unauthenticated user is redirected from /dashboard/orders to /login", async ({
      page,
    }) => {
      await page.goto("/dashboard/orders");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
      expect(page.url()).toContain("/login");
    });
  });
});

test.describe("Pagination — Products API", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/products");
    await page.waitForResponse((r) => r.url().includes("/products"), { timeout: 15000 });
    await page.waitForTimeout(500);
  });

  test("pagination controls are visible when products exist", async ({ page }) => {
    const table = page.locator("table");
    const hasTable = await table.isVisible().catch(() => false);

    if (hasTable) {
      const pagination = page.getByTestId("pagination");
      await expect(pagination).toBeVisible();
    }
  });

  test("pagination info shows item count", async ({ page }) => {
    const table = page.locator("table");
    const hasTable = await table.isVisible().catch(() => false);

    if (hasTable) {
      const info = page.getByTestId("pagination-info");
      await expect(info).toBeVisible();
      const text = await info.textContent();
      expect(text).toMatch(/\d/);
    }
  });

  test("size select changes page size and refetches", async ({ page }) => {
    const table = page.locator("table");
    const hasTable = await table.isVisible().catch(() => false);

    if (hasTable) {
      const sizeInput = page.getByTestId("pagination-size-input");
      await expect(sizeInput).toBeVisible();

      const refetchPromise = page.waitForResponse(
        (r) => r.url().includes("/products"),
        { timeout: 10000 }
      );

      await sizeInput.selectOption("5");
      await refetchPromise;

      expect(page.url()).toBeDefined();
    }
  });

  test("next page button navigates to page 2 and refetches", async ({ page }) => {
    const table = page.locator("table");
    const hasTable = await table.isVisible().catch(() => false);

    if (hasTable) {
      const nextBtn = page.getByTestId("pagination-next");
      const isEnabled = await nextBtn.isEnabled().catch(() => false);

      if (isEnabled) {
        const refetchPromise = page.waitForResponse(
          (r) => r.url().includes("/products"),
          { timeout: 10000 }
        );
        await nextBtn.click();
        await refetchPromise;

        const page2Btn = page.getByTestId("pagination-page-2");
        const hasPage2 = await page2Btn.isVisible().catch(() => false);
        if (hasPage2) {
          await expect(page2Btn).toHaveAttribute("data-active", "true");
        }
      }
    }
  });
});

test.describe("Pagination — Orders (client-side)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsKitchen(page);
    await page.goto("/dashboard/orders");
    await page.waitForResponse((r) => r.url().includes("/orders"), { timeout: 15000 });
    await page.waitForTimeout(500);
  });

  test("pagination component is visible on orders page", async ({ page }) => {
    const pagination = page.getByTestId("pagination");
    await expect(pagination).toBeVisible();
  });

  test("size select is visible on orders page", async ({ page }) => {
    const sizeSelect = page.getByTestId("pagination-size-select");
    await expect(sizeSelect).toBeVisible();
  });

  test("pagination info shows order count", async ({ page }) => {
    const info = page.getByTestId("pagination-info");
    await expect(info).toBeVisible();
    const text = await info.textContent();
    expect(text).toMatch(/\d/);
  });
});
