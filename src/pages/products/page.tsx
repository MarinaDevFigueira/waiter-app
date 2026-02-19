import { useState, useCallback } from "react";
import { ProductsTable } from "@/pages/products/components/products-table";
import { ProductsTableSkeleton } from "@/pages/products/components/products-table-skeleton";
import { ProductsFilters } from "@/pages/products/components/products-filters";
import { ProductFormDialog } from "@/pages/products/components/product-form-dialog";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Button } from "@/components/ui/button/button";
import { useProducts } from "@/shared/hooks/useProducts";
import { usePagination } from "@/shared/hooks/usePagination";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Product } from "@/shared/schemas/product.schema";

export function ProductsPage() {
  const {
    products,
    total,
    page,
    size,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isError,
    error,
    queryParams,
    updateSorting,
    updatePagination,
  } = useProducts();
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const handleNewProduct = useCallback(() => {
    setSelectedProduct(undefined);
    setFormOpen(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  }, []);

  const pagination = usePagination({
    page,
    size,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    onPageChange: updatePagination,
  });

  const pageHeader = (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("products.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("products.pageSubtitle")}
        </p>
      </div>
      <Button onClick={handleNewProduct} data-testid="new-product-button">
        {t("common.buttons.new")} {t("products.pageTitle")}
      </Button>
    </div>
  );

  const hasError = isError;
  const isLoadingData = isLoading;
  const hasNoProducts = products.length === 0;
  const errorMessage = error?.message;

  const errorContent = (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <p className="text-sm text-destructive">
        {t("products.errors.loadProducts")} {errorMessage}
      </p>
    </div>
  );

  const emptyContent = (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">
        {t("products.emptyState.title")}
      </p>
    </div>
  );

  const sortingState = {
    orderBy: queryParams.orderBy,
    direction: queryParams.direction,
  };

  const showTable = !hasError && !isLoadingData && !hasNoProducts;
  const showSkeleton = !hasError && isLoadingData;
  const showEmpty = !hasError && !isLoadingData && hasNoProducts;

  return (
    <div className="flex flex-col h-full gap-6">
      {pageHeader}

      <ProductsFilters />

      {hasError && errorContent}

      {showSkeleton && <ProductsTableSkeleton />}

      {showEmpty && emptyContent}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
      />

      {showTable && (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <ProductsTable
              products={products}
              sorting={sortingState}
              onSortingChange={updateSorting}
              onEdit={handleEditProduct}
            />
          </div>

          <Pagination>
            <div className="flex items-center gap-4">
              <Pagination.Info
                startItem={pagination.startItem}
                endItem={pagination.endItem}
                total={pagination.total}
              />
              <Pagination.SizeSelect
                size={pagination.size}
                setPageSize={pagination.setPageSize}
              />
            </div>
            <Pagination.Controls
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              pageRange={pagination.pageRange}
              nextPage={pagination.nextPage}
              prevPage={pagination.prevPage}
              goToPage={pagination.goToPage}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}
