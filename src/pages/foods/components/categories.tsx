import { useCallback, useRef, useMemo } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Category } from "@/shared/schemas/category.schema";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
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

function CategoryTab({ label, categoryId, selected, onSelect }: CategoryTabProps) {
  const handleSelect = useCallback(() => {
    onSelect(categoryId);
  }, [categoryId, onSelect]);

  return (
    <li
      data-selected={selected}
      onClick={handleSelect}
      className="flex flex-col items-center justify-center gap-1 cursor-pointer hover:cursor-pointer shrink-0"
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
const NAV_PREV_CLASS = "categories-swiper-prev";
const NAV_NEXT_CLASS = "categories-swiper-next";
const SPACE_BETWEEN = 4;

const Categories = ({ categories, selectedCategoryId, onCategoryChange }: CategoriesProps) => {
  const { t } = useTranslation();
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const sortedCategories = useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    return sorted;
  }, [categories]);

  const handleSelect = useCallback((categoryId: string) => {
    const isAll = categoryId === ALL_CATEGORY_ID;
    onCategoryChange(isAll ? null : categoryId);
  }, [onCategoryChange]);

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    const navigationParams = swiper.params.navigation;
    const isObject = typeof navigationParams === "object" && navigationParams !== null;
    if (!isObject) return;

    navigationParams.prevEl = prevButtonRef.current;
    navigationParams.nextEl = nextButtonRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  const allSelected = selectedCategoryId === null;
  const scrollLeftLabel = t("foods.categories.scrollLeft");
  const scrollRightLabel = t("foods.categories.scrollRight");
  const iconSize = 16;

  const navigationConfig = {
    prevEl: `.${NAV_PREV_CLASS}`,
    nextEl: `.${NAV_NEXT_CLASS}`,
  };

  const freeModeConfig = {
    enabled: true,
    momentum: true,
    momentumRatio: 0.5,
    momentumBounce: false,
  };

  return (
    <div className="w-full relative group/categories">
      <button
        ref={prevButtonRef}
        aria-label={scrollLeftLabel}
        className={`${NAV_PREV_CLASS} absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-background/90 border border-border shadow-sm text-foreground hover:cursor-pointer hover:bg-muted active:scale-95 transition-all`}
      >
        <CaretLeftIcon size={iconSize} weight="bold" />
      </button>

      <div className="">
        <Swiper
          modules={[Navigation, FreeMode]}
          navigation={navigationConfig}
          freeMode={freeModeConfig}
          slidesPerView="auto"
          spaceBetween={SPACE_BETWEEN}
          grabCursor
          onInit={handleSwiperInit}
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

      <button
        ref={nextButtonRef}
        aria-label={scrollRightLabel}
        className={`${NAV_NEXT_CLASS} absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-background/90 border border-border shadow-sm text-foreground hover:cursor-pointer hover:bg-muted active:scale-95 transition-all`}
      >
        <CaretRightIcon size={iconSize} weight="bold" />
      </button>
    </div>
  );
};

export default Categories;
