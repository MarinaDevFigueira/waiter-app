import { useEffect, useState, useCallback } from "react";
import { categoryObservable } from "@/shared/subjects/categories";

interface UseCategoryReturn {
  selectedCategory: string;
  changeCategory: (category: string) => void;
}

export const useCategory = (): UseCategoryReturn => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryObservable.getValue()
  );

  useEffect(() => {
    const subscription = categoryObservable.subscribe((category) => {
      setSelectedCategory(category);
    });

    return () => subscription.unsubscribe();
  }, []);

  const changeCategory = useCallback((category: string) => {
    categoryObservable.setCategory(category);
  }, []);

  return {
    selectedCategory,
    changeCategory,
  };
};
