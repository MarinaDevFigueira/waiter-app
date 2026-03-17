import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { categoriesSwiperObservable } from "./observables/categories-swiper.subject";
import type { Category } from "@/shared/schemas/category.schema";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";

interface CategoryTabProps {
  label: string;
  categoryId: string;
  selected: boolean;
  onSelect: (categoryId: string) => void;
}

interface CategoriesProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

function CategoryTab({
  label,
  categoryId,
  selected,
  onSelect,
}: CategoryTabProps) {
  const handleSelect = useCallback(() => {
    onSelect(categoryId);
  }, [categoryId, onSelect]);

  return (
    <li
      data-selected={selected}
      data-testid={`category-tab-${categoryId}`}
      onClick={handleSelect}
      className="flex flex-col select-none items-center justify-center gap-1 cursor-pointer hover:cursor-pointer shrink-0"
    >
      <span
        data-selected={selected}
        className="text-sm font-semibold px-3 py-1.5 rounded-full transition-colors data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=false]:text-muted-foreground data-[selected=false]:hover:text-foreground"
      >
        {label}
      </span>
    </li>
  );
}

const ALL_CATEGORY_ID = "__all__";
const SPACE_BETWEEN = 4;

const Categories = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
}: CategoriesProps) => {
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperType | null>(null);
  const [swiperState, setSwiperState] = useState(
    categoriesSwiperObservable.getValue(),
  );

  useEffect(() => {
    const subscription = categoriesSwiperObservable.subscribe((newState) => {
      setSwiperState(newState);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const sortedCategories = useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    return sorted;
  }, [categories]);

  const handleSelect = useCallback(
    (categoryId: string) => {
      const isAll = categoryId === ALL_CATEGORY_ID;
      onCategoryChange(isAll ? null : categoryId);
    },
    [onCategoryChange],
  );

  const handleSwiperRef = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  const handleInit = useCallback((swiper: SwiperType) => {
    setTimeout(() => {
      categoriesSwiperObservable.updateState({
        isBeginning: swiper.isBeginning,
        isEnd: swiper.isEnd,
      });
    }, 0);
  }, []);

  const handleProgress = useCallback((swiper: SwiperType) => {
    categoriesSwiperObservable.updateState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }, []);

  const handlePrevClick = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNextClick = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const allSelected = selectedCategoryId === null;
  const scrollLeftLabel = t("foods.categories.scrollLeft");
  const scrollRightLabel = t("foods.categories.scrollRight");
  const iconSize = 16;
  const isBeginning = swiperState.isBeginning;
  const isEnd = swiperState.isEnd;
  const shouldShowPrevButton = !isBeginning;
  const shouldShowNextButton = !isEnd;

  const freeModeConfig = {
    enabled: true,
    momentum: true,
    momentumRatio: 0.5,
    momentumBounce: false,
  };

  const prevButton = (
    <button
      aria-label={scrollLeftLabel}
      onClick={handlePrevClick}
      className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-background/90 border border-border shadow-sm text-foreground hover:cursor-pointer hover:bg-muted active:scale-95 transition-all"
    >
      <CaretLeftIcon size={iconSize} weight="bold" />
    </button>
  );

  const nextButton = (
    <button
      aria-label={scrollRightLabel}
      onClick={handleNextClick}
      className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-background/90 border border-border shadow-sm text-foreground hover:cursor-pointer hover:bg-muted active:scale-95 transition-all"
    >
      <CaretRightIcon size={iconSize} weight="bold" />
    </button>
  );

  return (
    <div className="w-full flex items-center gap-2">
      {shouldShowPrevButton && prevButton}

      <div className="flex-1 min-w-0">
        <Swiper
          modules={[FreeMode]}
          freeMode={freeModeConfig}
          slidesPerView="auto"
          spaceBetween={SPACE_BETWEEN}
          grabCursor
          onSwiper={handleSwiperRef}
          onInit={handleInit}
          onProgress={handleProgress}
          className="w-full"
        >
          <SwiperSlide className="w-auto!">
            <CategoryTab
              label={t("foods.categories.all")}
              categoryId={ALL_CATEGORY_ID}
              selected={allSelected}
              onSelect={handleSelect}
            />
          </SwiperSlide>
          {sortedCategories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            const slideKey = category.id;
            return (
              <SwiperSlide key={slideKey} className="w-auto!">
                <CategoryTab
                  label={category.name}
                  categoryId={category.id}
                  selected={isSelected}
                  onSelect={handleSelect}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {shouldShowNextButton && nextButton}
    </div>
  );
};

export { Categories };
