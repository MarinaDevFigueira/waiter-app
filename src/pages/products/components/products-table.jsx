import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export function ProductsTable({ products, sorting, onSortingChange }) {
  const hasSortingConfig = Boolean(sorting?.orderBy);
  const tableSorting = useMemo(() => {
    if (!hasSortingConfig) return [];

    const sortDescending = sorting.direction === "DESC";
    return [{ id: sorting.orderBy, desc: sortDescending }];
  }, [hasSortingConfig, sorting]);

  const handleSortingChange = (updater) => {
    const isUpdaterFunction = typeof updater === "function";
    const newSorting = isUpdaterFunction ? updater(tableSorting) : updater;

    const isClearingSorting = newSorting.length === 0;

    if (isClearingSorting) {
      onSortingChange("nome", "ASC");
      return;
    }

    const sortConfig = newSorting[0];
    const sortField = sortConfig.id;
    const sortDirection = sortConfig.desc ? "DESC" : "ASC";

    onSortingChange(sortField, sortDirection);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (product) => {
    const isDeleted = product.deletedAt !== null;
    const isActive = product.ativo;

    const hasDeleted = isDeleted;
    if (hasDeleted) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive">
          Excluído
        </span>
      );
    }

    const hasActive = isActive;
    if (hasActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-600">
          Ativo
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
        Inativo
      </span>
    );
  };

  const getStatusValue = (product) => {
    if (product.deletedAt !== null) return "excluído";
    if (product.ativo) return "ativo";
    return "inativo";
  };

  const columns = useMemo(
    () => {
      return [
      {
        accessorKey: "nome",
        header: "Nome",
        cell: (info) => {
          const product = info.row.original;
          return (
            <div>
              <div className="font-medium text-foreground">{product.nome}</div>
              <div className="text-muted-foreground text-xs line-clamp-1">
                {product.descricao}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "categoria",
        header: "Categoria",
        cell: (info) => (
          <span className="capitalize">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "preco",
        header: "Preço",
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        accessorKey: "estoque",
        header: "Estoque",
        cell: (info) => {
          const product = info.row.original;
          return (
            <span>
              {product.estoque} {product.unidade}
            </span>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => getStatusValue(row),
        cell: (info) => getStatusBadge(info.row.original),
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: "Criado em",
        cell: (info) => {
          const product = info.row.original;
          return (
            <div>
              <div>{formatDate(product.createdAt)}</div>
              <div className="text-xs">por {product.createdBy}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Atualizado em",
        cell: (info) => {
          const product = info.row.original;
          return (
            <div>
              <div>{formatDate(product.updatedAt)}</div>
              <div className="text-xs">por {product.updatedBy}</div>
            </div>
          );
        },
      },
    ];
    },
    [],
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    state: {
      sorting: tableSorting,
    },
  });

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                        canSort ? "cursor-pointer select-none" : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        canSort
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Ordenar crescente"
                            : header.column.getNextSortingOrder() === "desc"
                              ? "Ordenar decrescente"
                              : "Remover ordenação"
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {canSort && (
                          <span className="text-muted-foreground/70 text-xs">
                            {isSorted === "asc"
                              ? "▲"
                              : isSorted === "desc"
                                ? "▼"
                                : "⬍"}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
