import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { productsService } from "@/services/products/products.service";
import { productsFiltersObservable } from "@/shared/subjects/products-filters.subject";

export function useProducts() {
  const [queryParams, setQueryParams] = useState({
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

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const result = await productsService.getAll(queryParams);
      const hasError = Boolean(result.error);

      if (hasError) {
        toast.error(result.error);
        return null;
      }

      return result.data;
    },
    keepPreviousData: true,
  });

  const updateFilters = (newFilters) => {
    productsFiltersObservable.setFilters(newFilters);
  };

  const resetFilters = () => {
    productsFiltersObservable.resetFilters();
  };

  const updateSorting = (orderBy, direction) => {
    setQueryParams((prev) => ({
      ...prev,
      orderBy,
      direction,
    }));
  };

  const updatePagination = (page, size) => {
    setQueryParams((prev) => ({
      ...prev,
      page,
      size,
    }));
  };

  return {
    products: data?.items || [],
    total: data?.total || 0,
    page: data?.page || 1,
    size: data?.size || 10,
    totalPages: data?.totalPages || 0,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
    isLoading,
    isError,
    error,
    queryParams,
    setQueryParams,
    updateFilters,
    resetFilters,
    updateSorting,
    updatePagination,
  };
}
