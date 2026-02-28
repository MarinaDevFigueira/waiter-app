import { useEffect, useState } from "react";
import { businessObservable, type BusinessData } from "@/shared/subjects/business.subject";

interface UseBusinessReturn {
  selectedBusiness: BusinessData | null;
  setBusiness: (business: BusinessData) => void;
  clearBusiness: () => void;
}

export function useBusiness(): UseBusinessReturn {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>(
    businessObservable.getValue()
  );

  useEffect(() => {
    const subscription = businessObservable.subscribe(setSelectedBusiness);
    return () => subscription.unsubscribe();
  }, []);

  const setBusiness = (business: BusinessData): void => {
    businessObservable.setBusiness(business);
  };

  const clearBusiness = (): void => {
    businessObservable.clearBusiness();
  };

  return {
    selectedBusiness,
    setBusiness,
    clearBusiness,
  };
}
