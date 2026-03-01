import type { UserRoleEnum } from "@/shared/enums/user-role.enum";
import type { UsersOrderByEnum } from "@/shared/enums/users-order-by.enum";
import type { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { User } from "@/shared/schemas/user.schema";

export interface GetUserResponse {
  id: string;
  name: string;
  username: string;
  email: string | null;
  role: UserRoleEnum;
  document: string | null;
  documentType: "cpf" | "rg" | null;
  birthDate: string | null;
  businessId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  permissions?: string[];
}

export interface GetUsersApiResponse {
  items: GetUserResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface GetUsersRequestFilters {
  role?: UserRoleEnum[];
  search?: string;
  includeDeleted?: boolean;
}

export interface GetUsersRequestQuery {
  page: number;
  size: number;
  orderBy: UsersOrderByEnum;
  direction: SortDirection;
  filters?: GetUsersRequestFilters;
}

export interface GetUsersResponse {
  items: User[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UpdateMeRequestBody {
  name?: string;
  email?: string;
  password?: string;
}

export interface UpdateUserRequestBody {
  name?: string;
  email?: string;
  role?: string;
  document?: string;
  documentType?: "cpf" | "rg";
  birthDate?: string;
}
