import { createFileRoute } from "@tanstack/react-router";
import { KitchenOrdersPage } from "@/pages/orders/page";

export const Route = createFileRoute("/dashboard/orders")({
  component: KitchenOrdersPage,
});
