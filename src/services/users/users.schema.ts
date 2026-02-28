import { z } from "zod";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { UsersOrderByEnum } from "@/shared/enums/users-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";

const USER_ROLE_VALUES = Object.values(UserRoleEnum) as [UserRoleEnum, ...UserRoleEnum[]];
const USERS_ORDER_BY_VALUES = Object.values(UsersOrderByEnum) as [UsersOrderByEnum, ...UsersOrderByEnum[]];
const SORT_DIRECTION_VALUES = Object.values(SortDirection) as [SortDirection, ...SortDirection[]];

export const apiUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  role: z.enum(USER_ROLE_VALUES),
  document: z.string().nullable(),
  documentType: z.enum(["cpf", "rg"]).nullable(),
  birthDate: z.string().nullable(),
  businessId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable().optional(),
  deletedBy: z.string().nullable().optional(),
});

export const userQueryParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().positive().max(100).default(10),
  orderBy: z.enum(USERS_ORDER_BY_VALUES).default(UsersOrderByEnum.NAME),
  direction: z.enum(SORT_DIRECTION_VALUES).default(SortDirection.ASC),
  filters: z
    .object({
      role: z.array(z.enum(USER_ROLE_VALUES)).optional(),
      search: z.string().optional(),
      includeDeleted: z.boolean().optional(),
    })
    .optional(),
});

export const apiPaginatedUsersSchema = z.object({
  items: z.array(apiUserSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

export const paginatedUsersSchema = z.object({
  items: z.array(apiUserSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type ApiUser = z.infer<typeof apiUserSchema>;
export type ApiPaginatedUsers = z.infer<typeof apiPaginatedUsersSchema>;
export type UserQueryParams = z.infer<typeof userQueryParamsSchema>;
export type PaginatedUsers = z.infer<typeof paginatedUsersSchema>;
