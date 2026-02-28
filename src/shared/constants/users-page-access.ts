import { UserProfileEnum } from "./user-profile";

export const USERS_PAGE_ALLOWED_PROFILES = [
  UserProfileEnum.OWNER,
  UserProfileEnum.ADMIN
] as const;
