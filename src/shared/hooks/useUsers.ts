import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { usersFiltersObservable, type UserFilters } from "@/shared/subjects/users-filters.subject";
import { UsersOrderByEnum } from "@/shared/enums/users-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { User } from "@/shared/schemas/user.schema";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { usersService } from "@/services/users/users.service";

interface UsersQueryParams {
  page: number;
  size: number;
  orderBy: UsersOrderByEnum;
  direction: SortDirection;
  filters: Partial<UserFilters>;
}

interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseUsersReturn {
  users: User[];
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
  queryParams: UsersQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<UsersQueryParams>>;
  updateFilters: (newFilters: UserFilters) => void;
  resetFilters: () => void;
  updateSorting: (orderBy: UsersOrderByEnum, direction: SortDirection) => void;
  updatePagination: (page: number, size: number) => void;
  refetch: () => void;
}

export function useUsers(): UseUsersReturn {
  const { addLanguagePrefix } = useLanguage();

  const [queryParams, setQueryParams] = useState<UsersQueryParams>({
    page: 1,
    size: 10,
    orderBy: UsersOrderByEnum.NAME,
    direction: SortDirection.ASC,
    filters: usersFiltersObservable.getValue(),
  });

  useEffect(() => {
    const subscription = usersFiltersObservable.subscribe((filters) => {
      setQueryParams((prev) => {
        const filtersUnchanged = JSON.stringify(prev.filters) === JSON.stringify(filters);
        if (filtersUnchanged) return prev;
        return { ...prev, page: 1, filters };
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data, isLoading, isFetching, error, isError, refetch } = useQuery<PaginatedUsers>({
    queryKey: addLanguagePrefix("users", queryParams),
    queryFn: async () => {
      const result = await usersService.getAll({
        page: queryParams.page,
        size: queryParams.size,
        orderBy: queryParams.orderBy,
        direction: queryParams.direction,
        filters: queryParams.filters,
      });

      const hasError = "error" in result;
      if (hasError) {
        throw new Error(result.error);
      }

      return {
        items: result.data.items,
        total: result.data.total,
        page: result.data.page,
        size: result.data.size,
        totalPages: result.data.totalPages,
        hasNextPage: result.data.hasNextPage,
        hasPreviousPage: result.data.hasPreviousPage,
      };
    },
    placeholderData: keepPreviousData,
    retry: 2,
  });

  useEffect(() => {
    if (isError && error) {
      console.error("[useUsers] Erro ao buscar usuários:", error);
      toast.error(error.message ?? "Erro ao buscar usuários");
      logger.error("Erro ao buscar usuários", error);
    }
  }, [isError, error]);

  const updateFilters = (newFilters: UserFilters): void => {
    usersFiltersObservable.setFilters(newFilters);
  };

  const resetFilters = (): void => {
    usersFiltersObservable.resetFilters();
  };

  const updateSorting = (orderBy: UsersOrderByEnum, direction: SortDirection): void => {
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
    users: data?.items ?? [],
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
    refetch,
  };
}
