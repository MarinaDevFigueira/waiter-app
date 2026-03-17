import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { categoriesService } from "@/services/categories/categories.service";
import { CategoriesOrderByEnum } from "@/shared/enums/categories-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { Category } from "@/shared/schemas/category.schema";
import type {
  GetCategoriesResponse,
  GetCategoriesRequestQuery,
} from "@/services/categories/interfaces/categories.interface";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { useTranslation } from "@/shared/hooks/useTranslation";

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
  queryParams: GetCategoriesRequestQuery;
  setQueryParams: React.Dispatch<
    React.SetStateAction<GetCategoriesRequestQuery>
  >;
  updateSearch: (search: string) => void;
  updateSorting: (
    orderBy: CategoriesOrderByEnum,
    direction: SortDirection,
  ) => void;
  updatePagination: (page: number, size: number) => void;
}

interface UseCategoriesOptions {
  errorMessage?: string;
  initialSize?: number;
}

export function useCategories(
  options?: UseCategoriesOptions | string,
): UseCategoriesReturn {
  const { addLanguagePrefix } = useLanguage();
  const { t } = useTranslation();

  const resolvedErrorMessage =
    typeof options === "string" ? options : options?.errorMessage;
  const resolvedInitialSize =
    typeof options === "string" ? 10 : (options?.initialSize ?? 10);

  const [queryParams, setQueryParams] = useState<GetCategoriesRequestQuery>({
    page: 1,
    size: resolvedInitialSize,
    orderBy: CategoriesOrderByEnum.NAME,
    direction: SortDirection.ASC,
    search: undefined,
  });

  const { data, isLoading, error, isError } = useQuery<GetCategoriesResponse>({
    queryKey: addLanguagePrefix("categories", queryParams),
    queryFn: async () => {
      const result = (await categoriesService.getAll(queryParams)) as {
        data?: GetCategoriesResponse;
        error?: string;
      };

      if ("error" in result) {
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error(t("common.errors.noData"));
      }

      return result.data;
    },
    placeholderData: keepPreviousData,
    retry: 2,
  });

  useEffect(() => {
    if (isError && error) {
      const message =
        resolvedErrorMessage ??
        error.message ??
        t("categories.errors.loadCategories");
      toast.error(message);
      logger.error("Erro ao buscar categorias", error);
    }
  }, [isError, error, resolvedErrorMessage]);

  const updateSearch = (search: string): void => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      search: search || undefined,
    }));
  };

  const updateSorting = (
    orderBy: CategoriesOrderByEnum,
    direction: SortDirection,
  ): void => {
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
