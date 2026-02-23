import quatroQueijosUrl from "/pizzas/quatro-queijos.png";
import frangoCatupiryUrl from "/pizzas/frango-catupiry.png";
import margueritaUrl from "/pizzas/marguerita.png";

interface FoodItem {
  name: string;
  category: string;
  description: string;
  price: string;
  images: string[];
}

type FoodsByCategory = Record<string, FoodItem[]>;

const foodsByCategory: FoodsByCategory = {
  pizzas: [
    {
      name: "Quatro Queijos",
      category: "pizzas",
      description: "Pizza de Quatro Queijos com borda tradicional",
      price: "R$ 40,00",
      images: [quatroQueijosUrl],
    },
    {
      name: "Frango com Catupiry",
      category: "pizzas",
      description: "Pizza de Frango com Catupiry e borda tradicional",
      price: "R$ 40,00",
      images: [frangoCatupiryUrl],
    },
    {
      name: "Marguerita",
      category: "pizzas",
      description: "Pizza de Marguerita no melhor estilo italiano",
      price: "R$ 50,00",
      images: [margueritaUrl],
    },
  ],
  drinks: [
    {
      name: "Coca-Cola",
      category: "drinks",
      description: "Refrigerante gelado 350ml",
      price: "R$ 8,00",
      images: ["/drinks/coca-cola.png"],
    },
    {
      name: "Suco Natural",
      category: "drinks",
      description: "Suco natural de laranja 500ml",
      price: "R$ 12,00",
      images: ["/drinks/suco.png"],
    },
  ],
  snacks: [
    {
      name: "Batata Frita",
      category: "snacks",
      description: "Batata frita crocante e salgada 200g",
      price: "R$ 15,00",
      images: ["/snacks/batata.png"],
    },
    {
      name: "Pastel",
      category: "snacks",
      description: "Pastel de queijo quente 150g",
      price: "R$ 10,00",
      images: ["/snacks/pastel.png"],
    },
  ],
  promotions: [
    {
      name: "Combo Pizza + Bebida",
      category: "promotions",
      description: "Pizza grande + refrigerante 2L",
      price: "R$ 55,00",
      images: ["/promotions/combo.png"],
    },
  ],
};

export { foodsByCategory };
export type { FoodItem, FoodsByCategory };
