import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/products")({
  component: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Produtos</h1>
        <p className="text-muted-foreground">Página em desenvolvimento</p>
      </div>
    </div>
  ),
});
