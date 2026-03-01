import { useUserPermissions } from "./useUserPermissions";
import { PermissionEnum } from "@/shared/enums/permission.enum";
import type { Permission } from "@/shared/schemas/permission.schema";

interface UsePermissionsReturn {
  permissions: Permission[];
  role: string | null;
  isLoading: boolean;
  hasPermissionTo: (permission: PermissionEnum) => boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { permissions, role, isLoading, hasPermissionTo } = useUserPermissions();

  return {
    permissions,
    role,
    isLoading,
    hasPermissionTo,
  };
}
