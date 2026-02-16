import { ProductsTable } from "@/pages/products/components/products-table";
import { ProductsTableSkeleton } from "@/pages/products/components/products-table-skeleton";
import { ProductsFilters } from "@/pages/products/components/products-filters";
import { useProducts } from "@/shared/hooks/useProducts";

export function ProductsPage() {
  const {
    products,
    isLoading,
    isError,
    error,
    queryParams,
    updateSorting,
  } = useProducts();

  const pageHeader = (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
      <p className="text-muted-foreground">
        Gerencie o catálogo de produtos do restaurante
      </p>
    </div>
  );

  const hasError = isError;
  const isLoadingData = isLoading;
  const hasNoProducts = products.length === 0;
  const errorMessage = error?.message;

  const errorContent = (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <p className="text-sm text-destructive">
        Erro ao carregar produtos: {errorMessage}
      </p>
    </div>
  );

  const emptyContent = (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">Nenhum produto cadastrado</p>
    </div>
  );

  const sortingState = {
    orderBy: queryParams.orderBy,
    direction: queryParams.direction,
  };

  return (
    <div className="space-y-6">
      {pageHeader}

      <ProductsFilters />

      {hasError && errorContent}
      {!hasError && isLoadingData && <ProductsTableSkeleton />}
      {!hasError && !isLoadingData && hasNoProducts && emptyContent}
      {!hasError && !isLoadingData && !hasNoProducts && (
        <ProductsTable
          products={products}
          sorting={sortingState}
          onSortingChange={updateSorting}
        />
      )}
    </div>
  );
}
