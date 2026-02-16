import React, { useCallback } from "react";
import { useCategory } from "@/shared/hooks/useCategory";
import { useTranslation } from "@/shared/hooks/useTranslation";

function Category({
  icon: IconComponent,
  label = "",
  selected = false,
  value = "",
}) {
  const { changeCategory } = useCategory();
  const { t } = useTranslation();

  const categoryLabels = {
    pizzas: t("foods.categories.pizzas"),
    drinks: t("foods.categories.drinks"),
    snacks: t("foods.categories.snacks"),
    promotions: t("foods.categories.promotions"),
  };

  const translatedLabel = categoryLabels[value] || label;

  const handleSelect = useCallback(() => {
    changeCategory(value);
  }, [value, changeCategory]);

  const hasIcon = Boolean(IconComponent);
  const iconElement = hasIcon ? (
    <IconComponent
      size={18}
      weight="fill"
      data-category={value}
      className="text-primary data-[category=pizzas]:text-orange-600 data-[category=drinks]:text-blue-600 data-[category=snacks]:text-amber-700 data-[category=promotions]:text-pink-600"
    />
  ) : null;

  return (
    <li
      data-selected={selected}
      data-category={value}
      onClick={handleSelect}
      className="group flex justify-between items-center gap-2 sm:gap-3 data-[selected=true]:pointer-events-none data-[selected=false]:opacity-40 transition-opacity cursor-pointer"
    >
      <div className="flex justify-center items-center flex-col gap-1 sm:gap-1.5">
        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center shadow-xs p-1.5 sm:p-2 bg-white data-[category=pizzas]:bg-orange-100 data-[category=drinks]:bg-blue-100 data-[category=snacks]:bg-amber-100 data-[category=promotions]:bg-pink-100">
          {iconElement}
        </div>
        <span className="font-semibold text-xs sm:text-sm group-data-[selected=false]:opacity-30 text-center max-w-[50px] sm:max-w-none">
          {translatedLabel}
        </span>
      </div>
    </li>
  );
}

const Categories = ({
  lista = [],
  selectedCategory = "pizzas",
  onCategoryChange = () => {},
}) => {
  return (
    <ul className="w-full flex flex-row justify-start sm:justify-between items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
      {lista?.map((item) => {
        return (
          <Category
            key={item?.value}
            icon={item?.icon}
            label={item?.label}
            selected={selectedCategory === item?.value}
            value={item?.value}
            onSelect={onCategoryChange}
          />
        );
      })}
    </ul>
  );
};

export default Categories;
