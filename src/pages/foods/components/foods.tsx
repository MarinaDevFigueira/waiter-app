import { useCallback } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/shared/schemas/product.schema";
import type { Category } from "@/shared/schemas/category.schema";

interface FoodOptionProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

interface FoodsProps {
  items: Product[];
  onProductClick: (product: Product) => void;
  categories?: Category[];
  showCategoryHeaders?: boolean;
}

export const FoodOption = ({ product, onProductClick }: FoodOptionProps) => {
  const handleClick = useCallback(() => {
    onProductClick(product);
  }, [product, onProductClick]);

  const productImages = product.images ?? [];
  const hasImages = productImages.length > 0;
  const imageSrc = hasImages ? productImages[0] : "/no-image.png";
  const productPrice = product.price;
  const formattedPrice = formatPrice(productPrice);

  const productId = product.id;
  const testId = `product-${productId}`;
  const productName = product.name;
  const productDescription = product.description;

  return (
    <li className="w-full flex items-start justify-start gap-3 min-h-16 sm:flex-col sm:items-stretch sm:gap-0 sm:min-h-0 sm:border sm:rounded-lg sm:overflow-hidden sm:shadow-sm">
      <button
        onClick={handleClick}
        className="contents hover:cursor-pointer"
        data-testid={testId}
      >
        <img
          src={imageSrc}
          alt={productName}
          className="h-16 aspect-video rounded-md object-cover shrink-0 bg-muted sm:h-auto sm:aspect-4/3 sm:rounded-none sm:w-full"
        />
        <div className="w-full flex flex-col items-start justify-between gap-1 py-0.5 h-16 sm:h-auto sm:py-3 sm:px-3 sm:gap-2">
          <span className="font-semibold text-xs sm:text-sm line-clamp-2">
            {productName}
          </span>
          <span className="font-normal text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2">
            {productDescription}
          </span>
          <div className="flex justify-between items-center w-full mt-auto">
            <span className="font-semibold text-xs sm:text-sm">
              {formattedPrice}
            </span>
          </div>
        </div>
      </button>
    </li>
  );
};

export const Foods = ({ items, onProductClick, categories, showCategoryHeaders = false }: FoodsProps) => {
  const { t } = useTranslation();

  const itemsExist = items.length > 0;
  const hasItems = itemsExist;

  if (!hasItems) {
    const noProductsMessage = t("foods.emptyState.noProducts");
    const noProductsDescription = t("foods.emptyState.noProductsDescription");

    return (
      <div className="w-full flex flex-col items-center justify-center gap-2 py-12 text-center">
        <span className="text-base font-semibold text-foreground">
          {noProductsMessage}
        </span>
        <span className="text-sm text-muted-foreground">
          {noProductsDescription}
        </span>
      </div>
    );
  }

  const shouldShowHeaders = showCategoryHeaders;
  if (!shouldShowHeaders) {
    return (
      <ul className="w-full flex flex-col items-start justify-start gap-3 sm:grid sm:grid-cols-3 sm:items-stretch md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
        {items.map((product) => {
          const productId = product.id;
          return (
            <FoodOption
              key={productId}
              product={product}
              onProductClick={onProductClick}
            />
          );
        })}
      </ul>
    );
  }

  const categoryMap = new Map<string, string>();
  const categorySortOrder = new Map<string, number>();

  const categoriesExist = !!categories;
  if (categoriesExist) {
    categories.forEach((cat) => {
      const categoryId = cat.id;
      const categoryName = cat.name;
      const sortOrder = cat.sortOrder;
      categoryMap.set(categoryId, categoryName);
      categorySortOrder.set(categoryId, sortOrder);
    });
  }

  const groupedByCategory = items.reduce(
    (acc, product) => {
      const categoryId = product.categoryId;
      const categoryNotInAcc = !acc[categoryId];
      if (categoryNotInAcc) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  const categoryIds = Object.keys(groupedByCategory);
  const sortedCategoryIds = categoryIds.sort((a, b) => {
    const defaultOrder = 999;
    const orderA = categorySortOrder.get(a) ?? defaultOrder;
    const orderB = categorySortOrder.get(b) ?? defaultOrder;
    const comparison = orderA - orderB;
    return comparison;
  });

  return (
    <div className="w-full flex flex-col items-start justify-start gap-6">
      {sortedCategoryIds.map((categoryId) => {
        const defaultCategoryName = "Outros";
        const categoryName =
          categoryMap.get(categoryId) ?? defaultCategoryName;
        const categoryProducts = groupedByCategory[categoryId];

        return (
          <div
            key={categoryId}
            className="w-full flex flex-col items-start justify-start gap-3"
          >
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
                {categoryName}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <ul className="w-full flex flex-col items-start justify-start gap-3 sm:grid sm:grid-cols-3 sm:items-stretch md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
              {categoryProducts.map((product) => {
                const productId = product.id;
                return (
                  <FoodOption
                    key={productId}
                    product={product}
                    onProductClick={onProductClick}
                  />
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
