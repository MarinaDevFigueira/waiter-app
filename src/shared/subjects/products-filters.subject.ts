import { BehaviorSubject, type Subscription } from "rxjs";
import { ProductStatusEnum } from "@/shared/enums/product-status.enum";

interface ProductFilters {
  search: string;
  categoria: string[];
  precoMin?: number;
  precoMax?: number;
  somenteEmEstoque: boolean;
  estoqueMin?: number;
  status: ProductStatusEnum[];
  dataInicio?: Date;
  dataFim?: Date;
}

const initialFilters: ProductFilters = {
  search: "",
  categoria: [],
  somenteEmEstoque: false,
  status: [ProductStatusEnum.ACTIVE, ProductStatusEnum.INACTIVE],
};

const filtersSubject = new BehaviorSubject<ProductFilters>(initialFilters);

export const productsFiltersObservable = {
  subscribe: (callback: (value: ProductFilters) => void): Subscription =>
    filtersSubject.subscribe(callback),
  getValue: (): ProductFilters => filtersSubject.getValue(),
  setFilters: (filters: ProductFilters): void => filtersSubject.next(filters),
  resetFilters: (): void => filtersSubject.next(initialFilters),
  updateFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]): void => {
    const current = filtersSubject.getValue();
    filtersSubject.next({ ...current, [key]: value });
  },
};

export type { ProductFilters };
