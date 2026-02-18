import { BehaviorSubject, type Subscription } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";
import { OrdersViewEnum, type OrdersView } from "@/shared/enums/orders-view.enum";

const getStoredView = (): OrdersView | null => {
  const stored = localStorage.getItem(StorageKeys.ORDERS_VIEW);
  const validViews = Object.values(OrdersViewEnum) as string[];
  const isValidView = stored !== null && validViews.includes(stored);
  if (isValidView) {
    return stored as OrdersView;
  }
  return null;
};

const getInitialView = (): OrdersView => {
  const storedView = getStoredView();
  const hasStoredView = storedView !== null;
  if (hasStoredView) {
    return storedView;
  }
  return OrdersViewEnum.TABLE;
};

const initialView = getInitialView();

const ordersViewSubject = new BehaviorSubject<OrdersView>(initialView);

export const ordersViewObservable = {
  subscribe: (callback: (value: OrdersView) => void): Subscription =>
    ordersViewSubject.subscribe(callback),
  getValue: (): OrdersView => ordersViewSubject.getValue(),
  setView: (view: OrdersView): void => {
    localStorage.setItem(StorageKeys.ORDERS_VIEW, view);
    ordersViewSubject.next(view);
  },
};
