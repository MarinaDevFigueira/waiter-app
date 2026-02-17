import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { productsService } from "@/services/products/products.service";
import { productsFiltersObservable, type ProductFilters } from "@/shared/subjects/products-filters.subject";
import type { Product } from "@/shared/schemas/product.schema";

interface QueryParams {
  page: number;
  size: number;
  orderBy: string;
  direction: string;
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
  isError: boolean;
  error: Error | null;
  queryParams: QueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
  updateFilters: (newFilters: ProductFilters) => void;
  resetFilters: () => void;
  updateSorting: (orderBy: string, direction: string) => void;
  updatePagination: (page: number, size: number) => void;
}

export function useProducts(): UseProductsReturn {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    size: 10,
    orderBy: "nome",
    direction: "ASC",
    filters: {},
  });

  useEffect(() => {
    const subscription = productsFiltersObservable.subscribe((filters) => {
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        filters,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data, isLoading, error, isError } = useQuery<PaginatedProducts | null>({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const result = await productsService.getAll(queryParams) as { data?: PaginatedProducts; error?: string };
      const hasError = Boolean(result.error);

      if (hasError) {
        toast.error(result.error);
        return null;
      }

      return result.data ?? null;
    },
    keepPreviousData: true,
  });

  const updateFilters = (newFilters: ProductFilters): void => {
    productsFiltersObservable.setFilters(newFilters);
  };

  const resetFilters = (): void => {
    productsFiltersObservable.resetFilters();
  };

  const updateSorting = (orderBy: string, direction: string): void => {
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
