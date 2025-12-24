import { useEffect, useState, useCallback } from "react";
import { categorySubject } from "@/shared/subjects/categories";

export const useCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("pizzas");

  useEffect(() => {
    const subscription = categorySubject.subscribe((category) => {
      setSelectedCategory(category);
    });

    return () => subscription.unsubscribe();
  }, []);

  const changeCategory = useCallback((category) => {
    categorySubject.next(category);
  }, []);

  return {
    selectedCategory,
    changeCategory,
  };
};
