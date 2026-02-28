export type DropdownPosition = "top" | "bottom";

export interface BusinessSelection {
  id: string;
  name: string;
}

export interface BusinessComboboxProps {
  value?: string;
  onChange?: (business: BusinessSelection) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  dropdownPosition?: DropdownPosition;
  maxHeight?: string;
}
