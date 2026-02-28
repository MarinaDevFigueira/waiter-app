import { BehaviorSubject, type Subscription } from "rxjs";
import { cookies } from "@/lib/cookies";

export interface BusinessData {
  id: string;
  name: string;
}

const getStoredBusinessId = (): string | null => {
  const cookieValue = cookies.get("business_id");
  return cookieValue;
};

const getStoredBusinessName = (): string | null => {
  const cookieValue = cookies.get("business_name");
  return cookieValue;
};

const getInitialBusiness = (): BusinessData | null => {
  const storedId = getStoredBusinessId();
  const storedName = getStoredBusinessName();
  const hasBothValues = storedId !== null && storedName !== null;
  if (hasBothValues) {
    return { id: storedId, name: storedName };
  }
  return null;
};

const initialBusiness = getInitialBusiness();

const businessSubject = new BehaviorSubject<BusinessData | null>(initialBusiness);

export const businessObservable = {
  subscribe: (callback: (value: BusinessData | null) => void): Subscription =>
    businessSubject.subscribe(callback),
  getValue: (): BusinessData | null => businessSubject.getValue(),
  setBusiness: (business: BusinessData): void => {
    cookies.set("business_id", business.id);
    cookies.set("business_name", business.name);
    businessSubject.next(business);
  },
  clearBusiness: (): void => {
    cookies.remove("business_id");
    cookies.remove("business_name");
    businessSubject.next(null);
  },
};
