import { useState, useEffect, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { productsService } from "@/services/products/products.service";
import { productsFiltersObservable, type ProductFilters } from "@/shared/subjects/products-filters.subject";
import { ProductsOrderByEnum } from "@/shared/enums/products-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import { ProductStatusEnum } from "@/shared/enums/product-status.enum";
import type { Product } from "@/shared/schemas/product.schema";
import type { GetProductsRequestQuery } from "@/services/products/interfaces/products.interface";
import { useLanguage } from "@/shared/hooks/useLanguage";

interface QueryParams {
  page: number;
  size: number;
  orderBy: ProductsOrderByEnum;
  direction: SortDirection;
  filters: Partial<ProductFilters>;
}

interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseProductsReturn {
  products: Product[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  queryParams: QueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
  updateFilters: (newFilters: ProductFilters) => void;
  resetFilters: () => void;
  updateSorting: (orderBy: ProductsOrderByEnum, direction: SortDirection) => void;
  updatePagination: (page: number, size: number) => void;
}

function mapFiltersToApiQuery(queryParams: QueryParams): GetProductsRequestQuery {
  const { page, size, orderBy, direction, filters } = queryParams;

  const categoryId = filters.categoria?.length ? filters.categoria.join(",") : undefined;
  const hasStatusFilter = filters.status && filters.status.length > 0;
  const activeValues = hasStatusFilter
    ? filters.status!.map((s) => (s === ProductStatusEnum.ACTIVE ? "true" : "false"))
    : undefined;
  const active = activeValues?.length ? activeValues.join(",") : undefined;

  return {
    page,
    size,
    orderBy,
    direction,
    search: filters.search,
    categoryId,
    priceMin: filters.precoMin,
    priceMax: filters.precoMax,
    inStock: filters.somenteEmEstoque,
    stockMin: filters.estoqueMin,
    active,
  };
}

export function useProducts(): UseProductsReturn {
  const { addLanguagePrefix } = useLanguage();

  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    size: 10,
    orderBy: ProductsOrderByEnum.NAME,
    direction: SortDirection.ASC,
    filters: productsFiltersObservable.getValue(),
  });

  useEffect(() => {
    const subscription = productsFiltersObservable.subscribe((filters) => {
      setQueryParams((prev) => {
        const filtersUnchanged = JSON.stringify(prev.filters) === JSON.stringify(filters);
        if (filtersUnchanged) return prev;
        return { ...prev, page: 1, filters };
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const apiQueryParams = useMemo(() => mapFiltersToApiQuery(queryParams), [queryParams]);

  const { data, isLoading, isFetching, error, isError } = useQuery<PaginatedProducts>({
    queryKey: addLanguagePrefix("products", apiQueryParams),
    queryFn: async () => {
      const result = await productsService.getAll(apiQueryParams) as { data?: PaginatedProducts; error?: string };

      if ("error" in result) {
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error("Nenhum dado retornado");
      }

      return result.data;
    },
    placeholderData: keepPreviousData,
    retry: 2,
  });

  useEffect(() => {
    if (isError && error) {
      console.error("[useProducts] Erro ao buscar produtos:", error);
      toast.error(error.message ?? "Erro ao buscar produtos");
      logger.error("Erro ao buscar produtos", error);
    }
  }, [isError, error]);

  const updateFilters = (newFilters: ProductFilters): void => {
    productsFiltersObservable.setFilters(newFilters);
  };

  const resetFilters = (): void => {
    productsFiltersObservable.resetFilters();
  };

  const updateSorting = (orderBy: ProductsOrderByEnum, direction: SortDirection): void => {
    setQueryParams((prev) => ({
      ...prev,
      orderBy,
      direction,
    }));
  };

  const updatePagination = (page: number, size: number): void => {
    setQueryParams((prev) => ({
      ...prev,
      page,
      size,
    }));
  };

  return {
    products: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    size: data?.size ?? 10,
    totalPages: data?.totalPages ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    queryParams,
    setQueryParams,
    updateFilters,
    resetFilters,
    updateSorting,
    updatePagination,
  };
}
