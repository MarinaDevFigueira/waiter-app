export function KitchenPage() {
  return (
    <div className="flex flex-col items-start justify-start gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Cozinha</h1>
        <p className="text-muted-foreground">
          Gerenciamento de pedidos da cozinha
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Pedidos Pendentes</h3>
          <p className="text-sm text-muted-foreground">
            Pedidos aguardando preparo
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Em Preparo</h3>
          <p className="text-sm text-muted-foreground">
            Pedidos sendo preparados
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Prontos</h3>
          <p className="text-sm text-muted-foreground">
            Pedidos prontos para entrega
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Histórico</h3>
          <p className="text-sm text-muted-foreground">
            Pedidos finalizados hoje
          </p>
        </div>
      </div>
    </div>
  );
}
