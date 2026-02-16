import { BehaviorSubject } from "rxjs";

const initialFilters = {
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

const filtersSubject = new BehaviorSubject(initialFilters);

export const productsFiltersObservable = {
  subscribe: (callback) => filtersSubject.subscribe(callback),
  getValue: () => filtersSubject.getValue(),
  setFilters: (filters) => filtersSubject.next(filters),
  resetFilters: () => filtersSubject.next(initialFilters),
  updateFilter: (key, value) => {
    const current = filtersSubject.getValue();
    filtersSubject.next({ ...current, [key]: value });
  },
};
