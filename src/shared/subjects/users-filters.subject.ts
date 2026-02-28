import { BehaviorSubject, type Subscription } from "rxjs";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";

interface UserFilters {
  search: string;
  role: UserRoleEnum[];
  includeDeleted: boolean;
}

const initialFilters: UserFilters = {
  search: "",
  role: [],
  includeDeleted: false,
};

const filtersSubject = new BehaviorSubject<UserFilters>(initialFilters);

export const usersFiltersObservable = {
  subscribe: (callback: (value: UserFilters) => void): Subscription =>
    filtersSubject.subscribe(callback),
  getValue: (): UserFilters => filtersSubject.getValue(),
  setFilters: (filters: UserFilters): void => filtersSubject.next(filters),
  resetFilters: (): void => filtersSubject.next(initialFilters),
  updateFilter: <K extends keyof UserFilters>(key: K, value: UserFilters[K]): void => {
    const current = filtersSubject.getValue();
    filtersSubject.next({ ...current, [key]: value });
  },
};

export type { UserFilters };
