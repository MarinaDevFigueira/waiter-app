import type { UserRoleEnum } from "@/shared/enums/user-role.enum";

export interface UserSelection {
  id: string;
  name: string;
}

export interface UserSearchComboboxProps {
  value?: UserSelection | null;
  onChange?: (value: UserSelection | null) => void;
  roles?: UserRoleEnum[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
}
