import { useEffect, useState } from "react";
import { businessObservable, type BusinessData } from "@/shared/subjects/business.subject";
import { businessService } from "@/services/business/business.service";

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
    if (!hasUrlBusinessId) return;

    const fetchAndSetBusiness = async () => {
      const result = await businessService.getPublicById(urlBusinessId!);
      const hasError = "error" in result;
      if (hasError) {
        businessObservable.clearBusiness();
        return;
      }
      businessObservable.setBusiness({ id: result.data.id, name: result.data.name });
    };

    fetchAndSetBusiness();
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
