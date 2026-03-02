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
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetUsersRequestFilters {
  role?: UserRoleEnum[];
  search?: string;
  includeDeleted?: boolean;
}

export interface GetUsersRequestQuery {
  page: number;
  size: number;
  orderBy?: UsersOrderByEnum;
  direction?: SortDirection;
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

export interface CreateUserRequestBody {
  name: string;
  username: string;
  password: string;
  role: "table" | "waiter" | "kitchen" | "attendant" | "customer";
  email?: string;
  document?: string;
  documentType?: "cpf" | "rg";
  birthDate?: string;
}

export interface UpdateMeRequestBody {
  name?: string;
  email?: string;
  password?: string;
}

export interface UpdateUserRequestBody {
  name?: string;
  username?: string;
  email?: string;
  role?: UserRoleEnum;
  document?: string;
  documentType?: "cpf" | "rg";
  birthDate?: string;
  active?: boolean;
}
