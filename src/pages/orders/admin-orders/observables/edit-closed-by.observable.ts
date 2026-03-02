import { BehaviorSubject, type Subscription } from "rxjs";

interface EditClosedByState {
  open: boolean;
  orderSessionId: string;
}

const initialState: EditClosedByState | null = null;

const editClosedBySubject = new BehaviorSubject<EditClosedByState | null>(
  initialState
);

export const editClosedByObservable = {
  subscribe: (
    callback: (value: EditClosedByState | null) => void
  ): Subscription => editClosedBySubject.subscribe(callback),
  getValue: (): EditClosedByState | null => editClosedBySubject.getValue(),
  open: (orderSessionId: string): void => {
    editClosedBySubject.next({ open: true, orderSessionId });
  },
  close: (): void => {
    editClosedBySubject.next(null);
  },
};

export type { EditClosedByState };
