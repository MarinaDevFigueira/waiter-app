import { useCallback, useMemo } from "react";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { useAuth } from "@/shared/hooks/useAuth";
import type { BusinessRole, SystemRole, UseRolesReturn } from "@/shared/hooks/useRoles.interface";

export const BUSINESS_ROLES: readonly UserRoleEnum[] = [
  UserRoleEnum.OWNER,
  UserRoleEnum.TABLE,
  UserRoleEnum.KITCHEN,
  UserRoleEnum.CUSTOMER,
  UserRoleEnum.ATTENDANT,
  UserRoleEnum.WAITER,
] as const;

export const SYSTEM_ROLES: readonly UserRoleEnum[] = [
  UserRoleEnum.SYSTEM_MANAGER,
  UserRoleEnum.ADMIN,
] as const;

export const FULL_MENU_PROFILES: readonly UserRoleEnum[] = [
  UserRoleEnum.OWNER,
  UserRoleEnum.ADMIN,
] as const;

export const DASHBOARD_PROFILES: readonly UserRoleEnum[] = [
  UserRoleEnum.OWNER,
  UserRoleEnum.ADMIN,
  UserRoleEnum.ATTENDANT,
  UserRoleEnum.KITCHEN,
  UserRoleEnum.SYSTEM_MANAGER,
  UserRoleEnum.WAITER,
] as const;

export const USER_MANAGEMENT_PROFILES: readonly UserRoleEnum[] = [
  UserRoleEnum.OWNER,
  UserRoleEnum.ADMIN,
  UserRoleEnum.SYSTEM_MANAGER,
] as const;

export const BUSINESS_SELECTOR_PROFILES: readonly UserRoleEnum[] = [
  UserRoleEnum.ADMIN,
  UserRoleEnum.SYSTEM_MANAGER,
] as const;

export const BUSINESS_SELECTION_REQUIRED_PROFILES: readonly UserRoleEnum[] = [
  UserRoleEnum.ADMIN,
  UserRoleEnum.SYSTEM_MANAGER,
] as const;

export function isBusinessRoleCheck(role: UserRoleEnum | undefined): role is BusinessRole {
  const hasRole = role !== undefined;
  const roleInBusinessRoles = (BUSINESS_ROLES as readonly UserRoleEnum[]).includes(role!);
  return hasRole && roleInBusinessRoles;
}

export function isSystemRoleCheck(role: UserRoleEnum | undefined): role is SystemRole {
  const hasRole = role !== undefined;
  const roleInSystemRoles = (SYSTEM_ROLES as readonly UserRoleEnum[]).includes(role!);
  return hasRole && roleInSystemRoles;
}

export function useRoles(): UseRolesReturn {
  const { profile } = useAuth();

  const roles = useMemo(() => {
    const isOwner = profile === UserRoleEnum.OWNER;
    const isAdmin = profile === UserRoleEnum.ADMIN;
    const isTable = profile === UserRoleEnum.TABLE;
    const isKitchen = profile === UserRoleEnum.KITCHEN;
    const isCustomer = profile === UserRoleEnum.CUSTOMER;
    const isAttendant = profile === UserRoleEnum.ATTENDANT;
    const isWaiter = profile === UserRoleEnum.WAITER;
    const isSystemManager = profile === UserRoleEnum.SYSTEM_MANAGER;

    const isBusinessRole = isBusinessRoleCheck(profile);
    const isSystemRole = isSystemRoleCheck(profile);

    const hasProfile = profile !== undefined;
    const hasFullMenuAccess = hasProfile && (FULL_MENU_PROFILES as readonly UserRoleEnum[]).includes(profile);
    const shouldShowBusinessSelector = hasProfile && (BUSINESS_SELECTOR_PROFILES as readonly UserRoleEnum[]).includes(profile);
    const canAccessDashboard = hasProfile && (DASHBOARD_PROFILES as readonly UserRoleEnum[]).includes(profile);
    const canManageUsers = hasProfile && (USER_MANAGEMENT_PROFILES as readonly UserRoleEnum[]).includes(profile);
    const requiresBusinessSelection = hasProfile && (BUSINESS_SELECTION_REQUIRED_PROFILES as readonly UserRoleEnum[]).includes(profile);
    const hasAdminPrivileges = isAdmin || isSystemManager;

    return {
      isOwner,
      isAdmin,
      isTable,
      isKitchen,
      isCustomer,
      isAttendant,
      isWaiter,
      isSystemManager,
      isBusinessRole,
      isSystemRole,
      hasFullMenuAccess,
      shouldShowBusinessSelector,
      canAccessDashboard,
      canManageUsers,
      requiresBusinessSelection,
      hasAdminPrivileges,
    };
  }, [profile]);

  const hasRole = useCallback(
    (role: UserRoleEnum) => profile === role,
    [profile],
  );

  const hasAnyRole = useCallback(
    (roles: UserRoleEnum[]) => {
      const hasProfile = profile !== undefined;
      const roleIsIncluded = roles.includes(profile!);
      return hasProfile && roleIsIncluded;
    },
    [profile],
  );

  return {
    currentRole: profile,
    ...roles,
    hasRole,
    hasAnyRole,
  };
}
