import { FoodsPage } from "@/pages/foods/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: FoodsPage,
});