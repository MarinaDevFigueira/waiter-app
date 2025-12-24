import Categories from "./components/categories";
import { Title } from "./components/title";
import { Foods } from "./components/foods";
import { categoriesMock } from "@/shared/mocks/categories";
import { useFoodsFilter } from "@/shared/hooks/useFoodsFilter";
import { useCategory } from "@/shared/hooks/useCategory";

export const FoodsPage = () => {
  const { foods } = useFoodsFilter();
  const { selectedCategory } = useCategory();
  const categories = categoriesMock;

  return (
    <div className="flex flex-col items-start justify-start w-full gap-4">
      <Title />
      <Categories lista={categories} selectedCategory={selectedCategory} />
      <Foods items={foods} />
    </div>
  );
};
