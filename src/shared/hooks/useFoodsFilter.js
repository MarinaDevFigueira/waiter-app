import { useEffect, useState } from "react";
import { categoryObservable } from "@/shared/subjects/categories";
import { foodsObservable } from "@/shared/subjects/foods";
import { foodsByCategory } from "@/shared/mocks/foods";

export const useFoodsFilter = () => {
  const [filteredFoods, setFilteredFoods] = useState(foodsObservable.getValue());
  const [currentCategory, setCurrentCategory] = useState(categoryObservable.getValue());

  useEffect(() => {
    const subscription = categoryObservable.subscribe((category) => {
      setCurrentCategory(category);
      const foods = foodsByCategory[category] || [];
      foodsObservable.setFoods(foods);
      setFilteredFoods(foods);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    foods: filteredFoods,
    currentCategory,
  };
};
