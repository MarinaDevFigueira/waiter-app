import { test, expect } from "@playwright/test";
import { loginAsMesa } from "../../../../components/__tests__/helpers";

test.describe("Categories Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMesa(page);
    await page.waitForTimeout(2000);
  });

  test("should render navigation buttons when swiper has scroll", async ({ page }) => {
    const swiperContainer = page.locator(".swiper").first();
    await expect(swiperContainer).toBeVisible();

    const swiperInfo = await swiperContainer.evaluate((el) => {
      const swiper = el.swiper;
      const wrapperEl = swiper.wrapperEl;
      return {
        isBeginning: swiper.isBeginning,
        isEnd: swiper.isEnd,
        width: swiper.width,
        scrollWidth: wrapperEl.scrollWidth,
        hasScroll: wrapperEl.scrollWidth > swiper.width,
      };
    });

    console.log("Swiper Info:", swiperInfo);

    const containerDiv = page.locator("div.w-full.flex.items-center.gap-2");
    const childrenCount = await containerDiv.locator("> *").count();

    console.log("Container children:", childrenCount);

    const hasScroll = swiperInfo.hasScroll;
    if (hasScroll) {
      const isAtEnd = swiperInfo.isEnd;
      if (!isAtEnd) {
        const nextButton = page.locator("button.categories-swiper-next");
        const nextCount = await nextButton.count();
        expect(nextCount).toBe(1);
        await expect(nextButton).toBeVisible();
      }

      const isAtBeginning = swiperInfo.isBeginning;
      if (!isAtBeginning) {
        const prevButton = page.locator("button.categories-swiper-prev");
        const prevCount = await prevButton.count();
        expect(prevCount).toBe(1);
        await expect(prevButton).toBeVisible();
      }
    }
  });

  test("should hide prev button at beginning", async ({ page }) => {
    const prevButton = page.locator("button.categories-swiper-prev[data-visible='true']");
    const prevCount = await prevButton.count();
    expect(prevCount).toBe(0);
  });

  test("should show next button when not at end", async ({ page }) => {
    await page.waitForTimeout(500);

    const swiperContainer = page.locator(".swiper").first();
    const swiperInfo = await swiperContainer.evaluate((el) => {
      const swiper = el.swiper;
      return {
        isEnd: swiper.isEnd,
        hasScroll: swiper.wrapperEl.scrollWidth > swiper.width,
      };
    });

    const hasScrollableContent = swiperInfo.hasScroll;
    if (hasScrollableContent) {
      const isAtEnd = swiperInfo.isEnd;
      const shouldShowNextButton = !isAtEnd;

      const nextButton = page.locator("button.categories-swiper-next");
      const nextCount = await nextButton.count();

      if (shouldShowNextButton) {
        expect(nextCount).toBe(1);
        await expect(nextButton).toBeVisible();
      } else {
        expect(nextCount).toBe(0);
      }
    }
  });
});
