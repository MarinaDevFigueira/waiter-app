import { useEffect, useState } from "react";
import { businessObservable, type BusinessData } from "@/shared/subjects/business.subject";

interface UseBusinessReturn {
  selectedBusiness: BusinessData | null;
  setBusiness: (business: BusinessData) => void;
  clearBusiness: () => void;
}

interface UseBusinessOptions {
  urlBusinessId?: string;
}

export function useBusiness(options?: UseBusinessOptions): UseBusinessReturn {
  const urlBusinessId = options?.urlBusinessId;

  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>(
    businessObservable.getValue()
  );

  useEffect(() => {
    const subscription = businessObservable.subscribe(setSelectedBusiness);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const hasUrlBusinessId = Boolean(urlBusinessId);
    if (hasUrlBusinessId) {
      businessObservable.setBusiness({ id: urlBusinessId!, name: "" });
    }
  }, [urlBusinessId]);

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
