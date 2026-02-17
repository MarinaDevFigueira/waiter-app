import { PizzaIcon, WineIcon, HamburgerIcon, StarIcon } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface Category {
  label: string;
  value: string;
  icon: Icon;
}

export const categoriesMock: Category[] = [
  {
    label: "Pizzas",
    value: "pizzas",
    icon: PizzaIcon,
  },
  {
    label: "Bebidas",
    value: "drinks",
    icon: WineIcon,
  },
  {
    label: "Lanches",
    value: "snacks",
    icon: HamburgerIcon,
  },
  {
    label: "Promoções",
    value: "promotions",
    icon: StarIcon,
  },
];
