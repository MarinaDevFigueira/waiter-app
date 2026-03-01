import { BehaviorSubject } from "rxjs";

interface OrderStatusUpdateState {
  updatingOrderId: string | null;
}

const initialState: OrderStatusUpdateState = {
  updatingOrderId: null,
};

const subject = new BehaviorSubject<OrderStatusUpdateState>(initialState);

export const orderStatusUpdateObservable = {
  subscribe: (callback: (state: OrderStatusUpdateState) => void) => subject.subscribe(callback),
  getValue: () => subject.getValue(),
  setUpdating: (orderId: string | null) => {
    subject.next({ updatingOrderId: orderId });
  },
  reset: () => {
    subject.next(initialState);
  },
};
