import { useCallback } from "react";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Product } from "@/shared/schemas/product.schema";
import type { Category } from "@/shared/schemas/category.schema";

interface FoodOptionProps {
  product: Product;
  onAddClick: (product: Product) => void;
}

interface FoodsProps {
  items: Product[];
  onAddItem: (product: Product) => void;
  categories?: Category[];
  showCategoryHeaders?: boolean;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export const FoodOption = ({ product, onAddClick }: FoodOptionProps) => {
  const { t } = useTranslation();

  const handleAddClick = useCallback(() => {
    onAddClick(product);
  }, [product, onAddClick]);

  const hasImage = Boolean(product.imageUrl);
  const imageSrc = hasImage ? product.imageUrl : "/no-image.png";
  const formattedPrice = formatPrice(product.price);

  return (
    <li className="w-full flex items-start justify-start gap-3 min-h-16 sm:flex-col sm:items-stretch sm:gap-0 sm:min-h-0 sm:border sm:rounded-lg sm:overflow-hidden sm:shadow-sm">
      <img
        src={imageSrc}
        alt={product.name}
        className="h-16 aspect-video rounded-md object-cover shrink-0 bg-muted sm:h-auto sm:aspect-[4/3] sm:rounded-none sm:w-full"
      />
      <div className="w-full flex flex-col items-start justify-between gap-1 py-0.5 h-16 sm:h-auto sm:py-3 sm:px-3 sm:gap-2">
        <span className="font-semibold text-xs sm:text-sm line-clamp-2">
          {product.name}
        </span>
        <span className="font-normal text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2">
          {product.description}
        </span>
        <div className="flex justify-between items-center w-full mt-auto">
          <span className="font-semibold text-xs sm:text-sm">{formattedPrice}</span>
          <button
            onClick={handleAddClick}
            className="hover:opacity-80 active:opacity-60 transition-opacity p-1 hover:cursor-pointer"
            aria-label={t("foods.actions.addToOrder", { name: product.name })}
            data-testid={`add-product-${product.id}`}
          >
            <PlusCircle className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </li>
  );
};

export const Foods = ({ items, onAddItem, categories, showCategoryHeaders = false }: FoodsProps) => {
  const { t } = useTranslation();

  const hasItems = items.length > 0;

  if (!hasItems) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-2 py-12 text-center">
        <span className="text-base font-semibold text-foreground">
          {t("foods.emptyState.noProducts")}
        </span>
        <span className="text-sm text-muted-foreground">
          {t("foods.emptyState.noProductsDescription")}
        </span>
      </div>
    );
  }

  if (!showCategoryHeaders) {
    return (
      <ul className="w-full flex flex-col items-start justify-start gap-3 sm:grid sm:grid-cols-3 sm:items-stretch md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
        {items.map((product) => (
          <FoodOption
            key={product.id}
            product={product}
            onAddClick={onAddItem}
          />
        ))}
      </ul>
    );
  }

  const categoryMap = new Map<string, string>();
  const categorySortOrder = new Map<string, number>();

  if (categories) {
    categories.forEach((cat) => {
      categoryMap.set(cat.id, cat.name);
      categorySortOrder.set(cat.id, cat.sortOrder);
    });
  }

  const groupedByCategory = items.reduce((acc, product) => {
    const categoryId = product.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const sortedCategoryIds = Object.keys(groupedByCategory).sort((a, b) => {
    const orderA = categorySortOrder.get(a) ?? 999;
    const orderB = categorySortOrder.get(b) ?? 999;
    return orderA - orderB;
  });

  return (
    <div className="w-full flex flex-col items-start justify-start gap-6">
      {sortedCategoryIds.map((categoryId) => {
        const categoryName = categoryMap.get(categoryId) ?? "Outros";
        const categoryProducts = groupedByCategory[categoryId];

        return (
          <div key={categoryId} className="w-full flex flex-col items-start justify-start gap-3">
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">{categoryName}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <ul className="w-full flex flex-col items-start justify-start gap-3 sm:grid sm:grid-cols-3 sm:items-stretch md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
              {categoryProducts.map((product) => (
                <FoodOption
                  key={product.id}
                  product={product}
                  onAddClick={onAddItem}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
