import { useEffect, useState, useCallback } from "react";
import { categoryObservable } from "@/shared/subjects/categories";

export const useCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(categoryObservable.getValue());

  useEffect(() => {
    const subscription = categoryObservable.subscribe((category) => {
      setSelectedCategory(category);
    });

    return () => subscription.unsubscribe();
  }, []);

  const changeCategory = useCallback((category) => {
    categoryObservable.setCategory(category);
  }, []);

  return {
    selectedCategory,
    changeCategory,
  };
};
