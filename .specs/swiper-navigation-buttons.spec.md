# Swiper Navigation Buttons Pattern

## When to Use

Use this pattern when implementing navigation buttons for Swiper sliders with conditional visibility based on scroll position.

**Use this pattern for:**
- Horizontal scrollable lists with navigation arrows
- Category sliders, image carousels, product galleries
- Any Swiper instance that needs prev/next buttons
- Responsive sliders that hide arrows when content fits

## Architecture

### File Structure

For component-specific observables:
```
src/pages/{feature}/components/{component}/
├── {component}.tsx
├── {component}.interface.ts
├── observables/
│   └── {component}.subject.ts
└── __tests__/
    └── {component}.spec.js
```

Example:
```
src/pages/foods/components/categories/
├── categories.tsx
├── categories.interface.ts
├── observables/
│   └── categories-swiper.subject.ts
└── __tests__/
    └── categories.spec.js
```

### Observable State

```typescript
// observables/component-swiper.subject.ts
import { BehaviorSubject } from "rxjs";

interface SwiperState {
  isBeginning: boolean; // True when at start (hide left arrow)
  isEnd: boolean;       // True when at end (hide right arrow)
}

const initialState: SwiperState = {
  isBeginning: true,  // Start at beginning
  isEnd: false,       // Assume there's content to scroll
};

const subject = new BehaviorSubject<SwiperState>(initialState);

export const componentSwiperObservable = {
  subscribe: (callback: (state: SwiperState) => void) =>
    subject.subscribe(callback),
  getValue: (): SwiperState => subject.getValue(),
  updateState: (newState: Partial<SwiperState>): void => {
    subject.next({ ...subject.getValue(), ...newState });
  },
  resetState: (): void => {
    subject.next(initialState);
  },
};
```

## Component Implementation

### 1. State Management

```tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { componentSwiperObservable } from "./observables/component-swiper.subject";

function MySlider() {
  // Subscribe to swiper state
  const [swiperState, setSwiperState] = useState(
    componentSwiperObservable.getValue()
  );

  useEffect(() => {
    const subscription = componentSwiperObservable.subscribe(setSwiperState);
    return () => subscription.unsubscribe();
  }, []);

  // Extract values
  const { isBeginning, isEnd } = swiperState;

  // Derive button visibility with useMemo
  const shouldShowPrevButton = useMemo(() => !isBeginning, [isBeginning]);
  const shouldShowNextButton = useMemo(() => !isEnd, [isEnd]);
}
```

### 2. Swiper Event Handlers

```tsx
const handleSwiperInit = useCallback((swiper: SwiperType) => {
  // Initialize navigation
  const navigationParams = swiper.params.navigation;
  const isObject = typeof navigationParams === "object" && navigationParams !== null;
  if (isObject) {
    navigationParams.prevEl = prevButtonRef.current;
    navigationParams.nextEl = nextButtonRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }

  // Update state with setTimeout to ensure Swiper is fully initialized
  setTimeout(() => {
    componentSwiperObservable.updateState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }, 0);
}, []);

const handleSlideChange = useCallback((swiper: SwiperType) => {
  componentSwiperObservable.updateState({
    isBeginning: swiper.isBeginning,
    isEnd: swiper.isEnd,
  });
}, []);
```

### 3. Layout Structure

```tsx
// Flexbox layout without position absolute
<div className="w-full flex items-center gap-2">
  {/* Left arrow - conditionally rendered */}
  {shouldShowPrevButton && (
    <button
      ref={prevButtonRef}
      aria-label="Scroll left"
      className="shrink-0 w-7 h-7 rounded-full bg-background/90 border border-border"
    >
      <CaretLeftIcon size={16} weight="bold" />
    </button>
  )}

  {/* Swiper container */}
  <div className="flex-1 min-w-0">
    <Swiper
      modules={[Navigation, FreeMode]}
      navigation={{
        prevEl: `.swiper-prev`,
        nextEl: `.swiper-next`,
      }}
      freeMode={{
        enabled: true,
        momentum: true,
      }}
      slidesPerView="auto"
      spaceBetween={4}
      grabCursor
      onInit={handleSwiperInit}
      onSlideChange={handleSlideChange}
    >
      {/* Slides */}
    </Swiper>
  </div>

  {/* Right arrow - conditionally rendered */}
  {shouldShowNextButton && (
    <button
      ref={nextButtonRef}
      aria-label="Scroll right"
      className="shrink-0 w-7 h-7 rounded-full bg-background/90 border border-border"
    >
      <CaretRightIcon size={16} weight="bold" />
    </button>
  )}
</div>
```

## Best Practices

### ✅ DO

- **Use flexbox layout** - `flex items-center gap-2` for natural spacing
- **Conditional rendering** - Use `{condition && <button />}` for show/hide
- **Observable state** - Use BehaviorSubject for reactive state
- **useMemo for visibility** - Memoize `shouldShowPrevButton` and `shouldShowNextButton`
- **setTimeout in onInit** - Ensure Swiper calculations are complete
- **Cleanup subscriptions** - Always unsubscribe in useEffect cleanup
- **Use refs for buttons** - `useRef` for prev/next button refs
- **Accessible labels** - Use `aria-label` for navigation buttons

### ❌ DON'T

- **Don't use position absolute** - Use flexbox instead for cleaner layout
- **Don't use padding to compensate** - No artificial padding to make space for absolute buttons
- **Don't forget setTimeout** - `onInit` may fire before Swiper is ready
- **Don't use useState for derived values** - Use useMemo for `shouldShow*` values
- **Don't expose BehaviorSubject** - Always encapsulate in observable object
- **Don't hardcode visibility** - Always derive from `isBeginning`/`isEnd`

## Button Visibility Logic

| Scroll Position | Left Arrow `<` | Right Arrow `>` | State |
|----------------|----------------|-----------------|-------|
| **Start** | ❌ Hidden | ✅ Visible | `isBeginning: true, isEnd: false` |
| **Middle** | ✅ Visible | ✅ Visible | `isBeginning: false, isEnd: false` |
| **End** | ✅ Visible | ❌ Hidden | `isBeginning: false, isEnd: true` |
| **No scroll needed** | ❌ Hidden | ❌ Hidden | `isBeginning: true, isEnd: true` |

## Responsive Behavior

```tsx
// Swiper config for responsive slides
<Swiper
  slidesPerView="auto" // Auto width based on content
  spaceBetween={4}     // Small gap between slides
  breakpoints={{
    640: { spaceBetween: 8 },  // sm: larger gap
    1024: { spaceBetween: 12 }, // lg: even larger gap
  }}
>
  <SwiperSlide className="w-auto!"> {/* Important: w-auto for auto width */}
    <Content />
  </SwiperSlide>
</Swiper>
```

## Testing

### Component Tests

```javascript
test("left arrow is hidden at start", async ({ page }) => {
  await page.goto("/");

  const leftArrow = page.getByRole("button", { name: "Scroll left" });
  await expect(leftArrow).not.toBeVisible();
});

test("right arrow is visible at start", async ({ page }) => {
  await page.goto("/");

  const rightArrow = page.getByRole("button", { name: "Scroll right" });
  await expect(rightArrow).toBeVisible();
});

test("both arrows visible in middle", async ({ page }) => {
  await page.goto("/");

  // Simulate slide to middle
  await page.evaluate(() => {
    const swiper = document.querySelector(".swiper").swiper;
    swiper.slideTo(2);
  });

  const leftArrow = page.getByRole("button", { name: "Scroll left" });
  const rightArrow = page.getByRole("button", { name: "Scroll right" });

  await expect(leftArrow).toBeVisible();
  await expect(rightArrow).toBeVisible();
});
```

## Common Issues

### Issue: Arrows don't appear on initial load

**Cause:** `onInit` fires before Swiper calculates dimensions

**Solution:** Use `setTimeout` in `handleSwiperInit`:
```tsx
setTimeout(() => {
  componentSwiperObservable.updateState({
    isBeginning: swiper.isBeginning,
    isEnd: swiper.isEnd,
  });
}, 0);
```

### Issue: Arrows overlap content

**Cause:** Using `position: absolute` without proper spacing

**Solution:** Use flexbox layout:
```tsx
<div className="w-full flex items-center gap-2">
  {shouldShowPrevButton && <button className="shrink-0" />}
  <div className="flex-1 min-w-0">{/* Swiper */}</div>
  {shouldShowNextButton && <button className="shrink-0" />}
</div>
```

### Issue: Arrows still visible when no scroll needed

**Cause:** State not updating when content fits in viewport

**Solution:** Ensure `handleSwiperInit` runs with setTimeout and checks `isEnd`:
```tsx
setTimeout(() => {
  const needsScroll = !swiper.isBeginning || !swiper.isEnd;
  if (needsScroll) {
    componentSwiperObservable.updateState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }
}, 0);
```

## Examples from Codebase

### Categories Slider
`/src/pages/foods/components/categories/categories.tsx`
- Horizontal category pills with prev/next arrows
- Observable: `categories-swiper.subject.ts`
- Flexbox layout with conditional rendering
- Responsive breakpoints for mobile/desktop
