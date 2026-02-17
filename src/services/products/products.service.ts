import { mockProducts } from "@/shared/mocks/products";
import type { Product } from "@/shared/schemas/product.schema";
import {
  productQueryParamsSchema,
  paginatedProductsSchema,
} from "./products.schema";
import type { PaginatedProducts } from "./products.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

type Filters = {
  search?: string;
  categoria?: string[];
  precoMin?: number | null;
  precoMax?: number | null;
  somenteEmEstoque?: boolean;
  estoqueMin?: number | null;
  status?: Array<"ativo" | "inativo">;
  dataInicio?: Date | null;
  dataFim?: Date | null;
};

function applyMockFilters(
  items: Product[],
  filters: Filters
): ServiceResult<Product[]> {
  try {
    let filtered = [...items];

    const hasSearch = Boolean(filters.search);
    const hasCategories = filters.categoria && filters.categoria.length > 0;
    const hasMinPrice =
      filters.precoMin !== null && filters.precoMin !== undefined;
    const hasMaxPrice =
      filters.precoMax !== null && filters.precoMax !== undefined;
    const filterOnlyInStock = Boolean(filters.somenteEmEstoque);
    const hasMinStock =
      filters.estoqueMin !== null && filters.estoqueMin !== undefined;
    const hasStatusFilter = filters.status && filters.status.length > 0;
    const hasStartDate = Boolean(filters.dataInicio);
    const hasEndDate = Boolean(filters.dataFim);

    if (hasSearch && filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.descricao?.toLowerCase().includes(searchLower)
      );
    }

    if (hasCategories && filters.categoria) {
      filtered = filtered.filter((p) =>
        filters.categoria!.includes(p.categoria)
      );
    }

    if (hasMinPrice && filters.precoMin != null) {
      filtered = filtered.filter((p) => p.preco >= filters.precoMin!);
    }

    if (hasMaxPrice && filters.precoMax != null) {
      filtered = filtered.filter((p) => p.preco <= filters.precoMax!);
    }

    if (filterOnlyInStock) {
      filtered = filtered.filter((p) => p.estoque > 0);
    }

    if (hasMinStock && filters.estoqueMin != null) {
      filtered = filtered.filter((p) => p.estoque >= filters.estoqueMin!);
    }

    if (hasStatusFilter && filters.status) {
      filtered = filtered.filter((p) => {
        const status = p.ativo ? "ativo" : "inativo";
        return filters.status!.includes(status);
      });
    }

    if (hasStartDate && filters.dataInicio) {
      filtered = filtered.filter(
        (p) => p.createdAt >= filters.dataInicio!.toISOString()
      );
    }

    if (hasEndDate && filters.dataFim) {
      filtered = filtered.filter(
        (p) => p.createdAt <= filters.dataFim!.toISOString()
      );
    }

    return { data: filtered };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao aplicar filtros";
    return { error: errorMessage };
  }
}

export const productsService = {
  async getAll(
    queryParams: Record<string, unknown> = {}
  ): Promise<ServiceResult<PaginatedProducts>> {
    try {
      const validated = productQueryParamsSchema.safeParse(queryParams);
      const validationFailed = !validated.success;

      if (validationFailed) {
        return { error: "Parâmetros inválidos" };
      }

      const { page, size, orderBy, direction, filters = {} } = validated.data;

      await new Promise((resolve) => setTimeout(resolve, 500));

      const filterResult = applyMockFilters(mockProducts, filters);
      const filteringFailed = "error" in filterResult;

      if (filteringFailed) {
        return { error: (filterResult as ServiceError).error };
      }

      let items = (filterResult as ServiceSuccess<Product[]>).data;

      items.sort((a, b) => {
        const aVal = a[orderBy as keyof Product];
        const bVal = b[orderBy as keyof Product];

        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        if (aVal > bVal) comparison = 1;

        return direction === "ASC" ? comparison : -comparison;
      });

      const start = (page - 1) * size;
      const paginatedItems = items.slice(start, start + size);

      const response = {
        items: paginatedItems,
        total: items.length,
        page,
        size,
        totalPages: Math.ceil(items.length / size),
        hasNextPage: page < Math.ceil(items.length / size),
        hasPreviousPage: page > 1,
      };

      const paginationValidation = paginatedProductsSchema.safeParse(response);
      const paginationValidationFailed = !paginationValidation.success;

      if (paginationValidationFailed) {
        return { error: "Erro ao validar resposta paginada" };
      }

      return { data: paginationValidation.data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar produtos";
      return { error: errorMessage };
    }
  },

  async getById(productId: string): Promise<ServiceResult<Product>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const product = mockProducts.find((p) => p.id === productId);
      const productNotFound = !product;

      if (productNotFound) {
        return { error: "Produto não encontrado" };
      }

      return { data: product! };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar produto";
      return { error: errorMessage };
    }
  },

  async create(
    data: Omit<Product, "id">
  ): Promise<ServiceResult<Product>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newProduct = { id: String(Date.now()), ...data } as Product;

      return { data: newProduct };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar produto";
      return { error: errorMessage };
    }
  },

  async update(
    productId: string,
    data: Partial<Omit<Product, "id">>
  ): Promise<ServiceResult<Product>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedProduct = { id: productId, ...data } as Product;

      return { data: updatedProduct };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar produto";
      return { error: errorMessage };
    }
  },

  async delete(
    productId: string
  ): Promise<ServiceResult<{ success: boolean; id: string }>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = { success: true, id: productId };

      return { data: result };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar produto";
      return { error: errorMessage };
    }
  },
};
