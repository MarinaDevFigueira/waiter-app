import { UserRoleEnum } from "@/shared/enums/user-role.enum";

export const USERS_PAGE_ALLOWED_PROFILES = [
  UserRoleEnum.OWNER,
  UserRoleEnum.ADMIN,
  UserRoleEnum.SYSTEM_MANAGER
] as const;
