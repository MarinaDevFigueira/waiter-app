import { useEffect, useState } from "react";
import { Title } from "./components/title";
import { foodsSubject } from "@/shared/subjects/foods";
import { Foods } from "./components/foods";

export const FoodsPage = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const subscription = foodsSubject.subscribe((data) => {
      setFoods(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <Title />
      <Foods items={foods} />
    </div>
  );
};
