import { BehaviorSubject, type Subscription } from "rxjs";
import { cookies } from "@/lib/cookies";
import { StorageKeys } from "@/shared/constants/storage-keys";

export interface BusinessData {
  id: string;
  name: string;
  address: string | null;
}

const getInitialBusiness = (): BusinessData | null => {
  const storedId = cookies.get(StorageKeys.BUSINESS_ID);
  const storedName = cookies.get(StorageKeys.BUSINESS_NAME);
  const hasBothValues = storedId !== null && storedName !== null;
  if (!hasBothValues) return null;

  const storedAddress = cookies.get(StorageKeys.BUSINESS_ADDRESS);
  return { id: storedId, name: storedName, address: storedAddress };
};

const initialBusiness = getInitialBusiness();

const businessSubject = new BehaviorSubject<BusinessData | null>(initialBusiness);

export const businessObservable = {
  subscribe: (callback: (value: BusinessData | null) => void): Subscription =>
    businessSubject.subscribe(callback),
  getValue: (): BusinessData | null => businessSubject.getValue(),
  setBusiness: (business: BusinessData): void => {
    cookies.set(StorageKeys.BUSINESS_ID, business.id);
    cookies.set(StorageKeys.BUSINESS_NAME, business.name);
    const hasAddress = business.address !== null && business.address !== undefined;
    if (hasAddress) {
      cookies.set(StorageKeys.BUSINESS_ADDRESS, business.address!);
    }
    businessSubject.next(business);
  },
  clearBusiness: (): void => {
    cookies.remove(StorageKeys.BUSINESS_ID);
    cookies.remove(StorageKeys.BUSINESS_NAME);
    cookies.remove(StorageKeys.BUSINESS_ADDRESS);
    businessSubject.next(null);
  },
};
