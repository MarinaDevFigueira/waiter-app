import { useCallback } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Category } from "@/shared/schemas/category.schema";

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

const Categories = ({ categories, selectedCategoryId, onCategoryChange }: CategoriesProps) => {
  const { t } = useTranslation();

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSelect = useCallback((categoryId: string) => {
    const isAll = categoryId === ALL_CATEGORY_ID;
    onCategoryChange(isAll ? null : categoryId);
  }, [onCategoryChange]);

  const allSelected = selectedCategoryId === null;

  return (
    <ul className="w-full flex flex-row items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      <CategoryTab
        label={t("foods.categories.all")}
        categoryId={ALL_CATEGORY_ID}
        selected={allSelected}
        onSelect={handleSelect}
      />
      {sortedCategories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <CategoryTab
            key={category.id}
            label={category.name}
            categoryId={category.id}
            selected={isSelected}
            onSelect={handleSelect}
          />
        );
      })}
    </ul>
  );
};

export default Categories;
