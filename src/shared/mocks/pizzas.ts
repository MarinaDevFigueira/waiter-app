import quatroQueijosUrl from "/pizzas/quatro-queijos.png";
import frangoCatupiryUrl from "/pizzas/frango-catupiry.png";
import margueritaUrl from "/pizzas/marguerita.png";

interface Pizza {
  name: string;
  description: string;
  price: number;
  images: string[];
}

export const pizzasMock: Pizza[] = [
  {
    name: "Quatro Queijos",
    description: "Pizza de Quatro Queijos com borda tradicional",
    price: 40.0,
    images: [quatroQueijosUrl],
  },
  {
    name: "Frango com Catupiry",
    description: "Pizza de Frango com Catupiry e borda tradicional",
    price: 40.0,
    images: [frangoCatupiryUrl],
  },
  {
    name: "Marguerita",
    description: "Pizza de Marguerita no melhor estilo italiano",
    price: 50.0,
    images: [margueritaUrl],
  },
];
