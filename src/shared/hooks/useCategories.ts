import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { categoriesService } from "@/services/categories/categories.service";
import { CategoriesOrderByEnum } from "@/shared/enums/categories-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { Category } from "@/shared/schemas/category.schema";
import type { PaginatedCategories, CategoryQueryParams } from "@/services/categories/categories.schema";

interface UseCategoriesReturn {
  categories: Category[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  queryParams: CategoryQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<CategoryQueryParams>>;
  updateSearch: (search: string) => void;
  updateSorting: (orderBy: CategoriesOrderByEnum, direction: SortDirection) => void;
  updatePagination: (page: number, size: number) => void;
}

export function useCategories(errorMessage?: string): UseCategoriesReturn {
  const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
    page: 1,
    size: 10,
    orderBy: CategoriesOrderByEnum.NAME,
    direction: SortDirection.ASC,
    search: undefined,
  });

  const { data, isLoading, error, isError } = useQuery<PaginatedCategories | null>({
    queryKey: ["categories", queryParams],
    queryFn: async () => {
      const result = await categoriesService.getAll(queryParams) as { data?: PaginatedCategories; error?: string };
      const hasError = Boolean(result.error);

      if (hasError) {
        const queryError = new Error(result.error);
        const message = errorMessage ?? result.error;
        toast.error(message);
        logger.error("Erro ao buscar categorias", queryError);
        return null;
      }

      return result.data ?? null;
    },
    placeholderData: keepPreviousData,
  });

  const updateSearch = (search: string): void => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      search: search || undefined,
    }));
  };

  const updateSorting = (orderBy: CategoriesOrderByEnum, direction: SortDirection): void => {
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
    categories: data?.items ?? [],
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
    updateSearch,
    updateSorting,
    updatePagination,
  };
}
