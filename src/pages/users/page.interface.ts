import type { User } from "@/shared/schemas/user.schema";
import { UsersOrderByEnum } from "@/shared/enums/users-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";

export interface UsersPageProps {}

export interface UsersTableProps {
  users: User[];
  sorting: SortingConfig;
  onSortingChange: (orderBy: UsersOrderByEnum, direction: SortDirection) => void;
  onEdit: (user: User) => void;
  onDisable: (user: User) => void;
  canEdit: boolean;
  canDisable: boolean;
}

export interface SortingConfig {
  orderBy: UsersOrderByEnum;
  direction: SortDirection;
}
