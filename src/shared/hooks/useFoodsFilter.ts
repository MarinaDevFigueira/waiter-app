import { useEffect, useState } from "react";
import { categoryObservable } from "@/shared/subjects/categories";
import { foodsObservable } from "@/shared/subjects/foods";
import { foodsByCategory, type FoodItem } from "@/shared/mocks/foods";

interface UseFoodsFilterReturn {
  foods: FoodItem[];
  currentCategory: string;
}

export const useFoodsFilter = (): UseFoodsFilterReturn => {
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(
    foodsObservable.getValue()
  );
  const [currentCategory, setCurrentCategory] = useState<string>(
    categoryObservable.getValue()
  );

  useEffect(() => {
    const subscription = categoryObservable.subscribe((category) => {
      setCurrentCategory(category);
      const foods = foodsByCategory[category] ?? [];
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
