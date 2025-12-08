import Categories from "./components/categories";
import { Title } from "./components/title";

export const FoodsPage = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full">
      <Title />
      <Categories/>
    </div>
  );
};
