import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { permissionsService } from "@/services/permissions/permissions.service";
import { PermissionEnum } from "@/shared/enums/permission.enum";
import type { Permission } from "@/shared/schemas/permission.schema";
import { useAuth } from "./useAuth";
import { useRoles } from "./useRoles";

const PERMISSIONS_QUERY_KEY = ["user-permissions"] as const;
const THIRTY_MINUTES = 1000 * 60 * 30;

interface UseUserPermissionsReturn {
  permissions: Permission[];
  role: string | null;
  isLoading: boolean;
  hasPermissionTo: (permission: PermissionEnum) => boolean;
  clearPermissionsCache: () => void;
}

export function useUserPermissions(): UseUserPermissionsReturn {
  const queryClient = useQueryClient();
  const { isAuthenticated, profile } = useAuth();
  const { hasAdminPrivileges } = useRoles();

  const { data, isLoading } = useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: async () => {
      const result = await permissionsService.getMyPermissions();

      const hasError = "error" in result;
      if (hasError) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: isAuthenticated,
    staleTime: THIRTY_MINUTES,
    gcTime: THIRTY_MINUTES,
  });

  const clearPermissionsCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: PERMISSIONS_QUERY_KEY });
  }, [queryClient]);

  const permissions = data?.permissions ?? [];
  const permissionsNames = permissions.map((p) => p.name).join(",");

  const hasPermissionTo = useCallback(
    (permission: PermissionEnum): boolean => {
      if (!isAuthenticated) return false;
      if (hasAdminPrivileges) return true;
      return permissions.some((p) => p.name === permission);
    },
    [permissionsNames, hasAdminPrivileges, isAuthenticated]
  );

  const notAuthenticated = !isAuthenticated;
  if (notAuthenticated) {
    return {
      permissions: [],
      role: null,
      isLoading: false,
      hasPermissionTo,
      clearPermissionsCache,
    };
  }

  return {
    permissions,
    role: data?.role ?? profile ?? null,
    isLoading,
    hasPermissionTo,
    clearPermissionsCache,
  };
}

export { PERMISSIONS_QUERY_KEY };
