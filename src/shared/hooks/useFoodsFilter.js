import { useEffect, useState } from "react";
import { switchMap } from "rxjs";
import { categorySubject } from "@/shared/subjects/categories";
import { foodsSubject } from "@/shared/subjects/foods";
import { foodsByCategory } from "@/shared/mocks/foods";

export const useFoodsFilter = () => {
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("pizzas");

  useEffect(() => {
    const subscription = categorySubject
      .pipe(
        switchMap((category) => {
          setCurrentCategory(category);
          const foods = foodsByCategory[category] || [];
          foodsSubject.next(foods);
          return foodsSubject;
        })
      )
      .subscribe((foods) => {
        setFilteredFoods(foods);
      });

    return () => subscription.unsubscribe();
  }, []);

  return {
    foods: filteredFoods,
    currentCategory,
  };
};
