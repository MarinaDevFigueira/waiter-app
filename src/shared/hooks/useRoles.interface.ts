import { UserRoleEnum } from "@/shared/enums/user-role.enum";

export type BusinessRole =
  | UserRoleEnum.OWNER
  | UserRoleEnum.TABLE
  | UserRoleEnum.KITCHEN
  | UserRoleEnum.CUSTOMER
  | UserRoleEnum.ATTENDANT
  | UserRoleEnum.WAITER;

export type SystemRole = UserRoleEnum.SYSTEM_MANAGER | UserRoleEnum.ADMIN;

export interface UseRolesReturn {
  currentRole: UserRoleEnum | undefined;

  isBusinessRole: boolean;
  isSystemRole: boolean;

  isOwner: boolean;
  isAdmin: boolean;
  isTable: boolean;
  isKitchen: boolean;
  isCustomer: boolean;
  isAttendant: boolean;
  isWaiter: boolean;
  isSystemManager: boolean;

  hasFullMenuAccess: boolean;
  shouldShowBusinessSelector: boolean;
  canAccessDashboard: boolean;
  canManageUsers: boolean;
  requiresBusinessSelection: boolean;
  hasAdminPrivileges: boolean;

  hasRole: (role: UserRoleEnum) => boolean;
  hasAnyRole: (roles: UserRoleEnum[]) => boolean;
}
