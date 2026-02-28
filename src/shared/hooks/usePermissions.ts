import { useEffect, useState, useCallback, useMemo } from "react";
import { permissionsObservable } from "@/shared/subjects/permissions.subject";
import { PermissionEnum } from "@/shared/enums/permission.enum";
import type { Permission } from "@/shared/schemas/permission.schema";
import { useAuth } from "./useAuth";
import { UserProfileEnum } from "../constants/user-profile";

interface UsePermissionsReturn {
  permissions: Permission[];
  role: string | null;
  isLoading: boolean;
  hasPermissionTo: (permission: PermissionEnum) => boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const [state, setState] = useState(permissionsObservable.getValue());
  const [isLoading, setIsLoading] = useState(true);

  const { profile, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return {
      permissions: [],
      role: "",
      isLoading: false,
      hasPermissionTo: () => false,
    };
  }

  const role = useMemo(() => {
    return profile!;
  }, [profile]);

  useEffect(() => {
    const subscription = permissionsObservable.subscribe((data) => {
      setState(data);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const permissionsStringified = state.permissions.join(',')

  const hasPermissionTo = useCallback(
    (permission: PermissionEnum): boolean => {
      const isAdmin = role === UserProfileEnum.ADMIN;

      const hasToBypassPermission = isAdmin;

      if (hasToBypassPermission) return true;
      return state.permissions.some((p) => p.name === permission);
    },
    [permissionsStringified],
  );

  return {
    permissions: state.permissions,
    role: state.role,
    isLoading,
    hasPermissionTo,
  };
}
