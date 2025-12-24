import { useEffect, useState } from "react";
import Categories from "./components/categories";
import { Title } from "./components/title";
import { foodsSubject } from "@/shared/subjects/foods";
import { Foods } from "./components/foods";
import { categoriesMock } from "@/shared/mocks/categories";
import { categorySubject } from "@/shared/subjects/categories";

export const FoodsPage = () => {
  const [foods, setFoods] = useState([]);
  const categories = categoriesMock;
  const [_selectedCategory, selectCategory] = useState(null);

  useEffect(() => {
    const foodSubscription = foodsSubject.subscribe((data) => {
      setFoods(data);
    });

    const categorySubscription = categorySubject.subscribe((data) => {
      selectCategory(data);
    });

    return () => {
      foodSubscription.unsubscribe();
      categorySubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-4">
      <Title />
      <Categories lista={categories} />
      <Foods items={foods} />
    </div>
  );
};
