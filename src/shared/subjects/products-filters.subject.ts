import { BehaviorSubject, type Subscription } from "rxjs";

interface ProductFilters {
  search: string;
  categoria: string[];
  precoMin: number | null;
  precoMax: number | null;
  somenteEmEstoque: boolean;
  estoqueMin: number | null;
  status: string[];
  dataInicio: string | null;
  dataFim: string | null;
}

const initialFilters: ProductFilters = {
  search: "",
  categoria: [],
  precoMin: null,
  precoMax: null,
  somenteEmEstoque: false,
  estoqueMin: null,
  status: ["ativo", "inativo"],
  dataInicio: null,
  dataFim: null,
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
