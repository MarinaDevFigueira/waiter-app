import { createFileRoute } from "@tanstack/react-router";
import { KitchenOrdersPage } from "@/pages/kitchen/orders/page";

export const Route = createFileRoute("/dashboard/pedidos")({
  component: KitchenOrdersPage,
});
