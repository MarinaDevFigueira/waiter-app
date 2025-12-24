import Categories from "./components/categories";
import { Title } from "./components/title";
import { Foods } from "./components/foods";
import { categoriesMock } from "@/shared/mocks/categories";
import { useFoodsFilter } from "@/shared/hooks/useFoodsFilter";

export const FoodsPage = () => {
  const { foods } = useFoodsFilter();
  const categories = categoriesMock;

  return (
    <div className="flex flex-col items-start justify-start w-full gap-4">
      <Title />
      <Categories lista={categories} />
      <Foods items={foods} />
    </div>
  );
};
