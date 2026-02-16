import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../../__tests__/helpers";

test.describe("DashboardLayout Component", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("renders sidebar with logo", async ({ page }) => {
    const logo = page.getByTestId("logo");
    await expect(logo).toBeVisible();

    await expect(logo).toContainText("WaiterApp");
  });

  test("renders navigation menu items", async ({ page }) => {
    const dashboardLink = page.locator("nav a").filter({ hasText: "Dashboard" });
    const reportsLink = page.locator("nav a").filter({ hasText: "Relatórios" });
    const productsLink = page.locator("nav a").filter({ hasText: "Produtos" });

    await expect(dashboardLink).toBeVisible();
    await expect(reportsLink).toBeVisible();
    await expect(productsLink).toBeVisible();
  });

  test("admin sees admin menu items", async ({ page }) => {
    const usersLink = page.locator("nav a").filter({ hasText: "Usuários" });
    const settingsLink = page.locator("nav a").filter({ hasText: "Configurações" });

    await expect(usersLink).toBeVisible();
    await expect(settingsLink).toBeVisible();
  });

  test("sidebar can be minimized and expanded", async ({ page }) => {
    const toggleButton = page.getByTestId("toggle-sidebar");
    const logo = page.getByTestId("logo");

    await expect(logo).toBeVisible();

    await toggleButton.click();
    await expect(logo).toBeHidden();

    await toggleButton.click();
    await expect(logo).toBeVisible();
  });

  test("sidebar minimized state persists", async ({ page }) => {
    const toggleButton = page.getByTestId("toggle-sidebar");

    await toggleButton.click();

    await page.reload();

    const logo = page.locator("h1.font-title");
    await expect(logo).toBeHidden();
  });

  test("displays user info in sidebar footer", async ({ page }) => {
    const userName = page.locator("p.text-sm.font-medium");
    await expect(userName).toBeVisible();

    const userProfile = page.locator("p.text-xs.text-muted-foreground");
    await expect(userProfile).toBeVisible();
  });

  test("logout button works", async ({ page }) => {
    const logoutButton = page.getByTestId("logout-button");
    await expect(logoutButton).toBeVisible();

    await logoutButton.click();

    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
  });

  test("renders theme toggle in header", async ({ page }) => {
    const themeToggle = page.getByTestId("theme-toggle");
    await expect(themeToggle).toBeVisible();
  });

  test("renders breadcrumbs in header", async ({ page }) => {
    const breadcrumb = page.locator("header a").filter({ hasText: "Dashboard" });
    await expect(breadcrumb).toBeVisible();
  });

  test("active menu item is highlighted", async ({ page }) => {
    const dashboardLink = page.locator("nav a").filter({ hasText: "Dashboard" });

    const isActive = await dashboardLink.evaluate((el) =>
      el.getAttribute("data-active") === "true"
    );
    expect(isActive).toBe(true);
  });

  test("sidebar header aligns with main header", async ({ page }) => {
    const sidebarHeader = page.locator("aside > div").first();
    const mainHeader = page.locator("header").first();

    await expect(sidebarHeader).toBeVisible();
    await expect(mainHeader).toBeVisible();

    const sidebarBox = await sidebarHeader.boundingBox();
    const mainBox = await mainHeader.boundingBox();

    expect(sidebarBox.height).toBe(mainBox.height);
  });

  test("content scrolls independently from sidebar", async ({ page }) => {
    const main = page.locator("main");
    await expect(main).toHaveClass(/overflow-y-auto/);
  });
});
