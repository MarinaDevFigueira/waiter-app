import { UserRoleEnum } from "@/shared/enums/user-role.enum";

export const USERS_PAGE_ALLOWED_PROFILES = [
  UserRoleEnum.OWNER,
  UserRoleEnum.ADMIN
] as const;
