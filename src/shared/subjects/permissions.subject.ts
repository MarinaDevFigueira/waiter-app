import { BehaviorSubject, type Subscription } from "rxjs";
import type { Permission } from "@/shared/schemas/permission.schema";

interface PermissionsData {
  userId: string | null;
  role: string | null;
  permissions: Permission[];
}

const initialState: PermissionsData = {
  userId: null,
  role: null,
  permissions: [],
};

const permissionsSubject = new BehaviorSubject<PermissionsData>(initialState);

export const permissionsObservable = {
  subscribe: (callback: (value: PermissionsData) => void): Subscription =>
    permissionsSubject.subscribe(callback),
  getValue: (): PermissionsData => permissionsSubject.getValue(),
  setPermissions: (data: PermissionsData): void => permissionsSubject.next(data),
  clear: (): void => permissionsSubject.next(initialState),
};
