import { useRoles } from "@/shared/hooks/useRoles";

export function AdminPage() {
  const { hasFullMenuAccess } = useRoles();

  return (
    <div className="flex flex-col items-start justify-start gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          {hasFullMenuAccess ? "Acesso completo ao sistema" : "Acesso limitado"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Usuários</h3>
          <p className="text-sm text-muted-foreground">
            Gerenciar usuários do sistema
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Pedidos</h3>
          <p className="text-sm text-muted-foreground">
            Visualizar todos os pedidos
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Produtos</h3>
          <p className="text-sm text-muted-foreground">
            Gerenciar cardápio de produtos
          </p>
        </div>

        {hasFullMenuAccess && (
          <>
            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Configurações</h3>
              <p className="text-sm text-muted-foreground">
                Configurações do sistema
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Relatórios</h3>
              <p className="text-sm text-muted-foreground">
                Relatórios e estatísticas
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
