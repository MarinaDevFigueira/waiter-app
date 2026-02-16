import { mockProducts } from "@/shared/mocks/products";
import {
  productQueryParamsSchema,
  paginatedProductsSchema,
} from "./products.schema";

function applyMockFilters(items, filters) {
  try {
    let filtered = [...items];

    const hasSearch = Boolean(filters.search);
    const hasCategories = filters.categoria && filters.categoria.length > 0;
    const hasMinPrice = filters.precoMin !== null && filters.precoMin !== undefined;
    const hasMaxPrice = filters.precoMax !== null && filters.precoMax !== undefined;
    const filterOnlyInStock = Boolean(filters.somenteEmEstoque);
    const hasMinStock = filters.estoqueMin !== null && filters.estoqueMin !== undefined;
    const hasStatusFilter = filters.status && filters.status.length > 0;
    const hasStartDate = Boolean(filters.dataInicio);
    const hasEndDate = Boolean(filters.dataFim);

    if (hasSearch) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.descricao?.toLowerCase().includes(searchLower),
      );
    }

    if (hasCategories) {
      filtered = filtered.filter((p) => filters.categoria.includes(p.categoria));
    }

    if (hasMinPrice) {
      filtered = filtered.filter((p) => p.preco >= filters.precoMin);
    }

    if (hasMaxPrice) {
      filtered = filtered.filter((p) => p.preco <= filters.precoMax);
    }

    if (filterOnlyInStock) {
      filtered = filtered.filter((p) => p.estoque > 0);
    }

    if (hasMinStock) {
      filtered = filtered.filter((p) => p.estoque >= filters.estoqueMin);
    }

    if (hasStatusFilter) {
      filtered = filtered.filter((p) => {
        const status = p.ativo ? "ativo" : "inativo";
        return filters.status.includes(status);
      });
    }

    if (hasStartDate) {
      filtered = filtered.filter((p) => p.createdAt >= filters.dataInicio);
    }

    if (hasEndDate) {
      filtered = filtered.filter((p) => p.createdAt <= filters.dataFim);
    }

    return { data: filtered };
  } catch (error) {
    const errorMessage = error?.message ?? "Erro ao aplicar filtros";
    return { error: errorMessage };
  }
}

export const productsService = {
  async getAll(queryParams = {}) {
    try {
      const validated = productQueryParamsSchema.safeParse(queryParams);
      const validationFailed = !validated.success;

      if (validationFailed) {
        return { error: "Parâmetros inválidos" };
      }

      const { page, size, orderBy, direction, filters = {} } = validated.data;

      await new Promise((resolve) => setTimeout(resolve, 500));

      const filterResult = applyMockFilters(mockProducts, filters);
      const filteringFailed = Boolean(filterResult.error);

      if (filteringFailed) {
        return { error: filterResult.error };
      }

      let items = filterResult.data;

      items.sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];

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
      const errorMessage = error?.message ?? "Erro ao buscar produtos";
      return { error: errorMessage };
    }
  },

  /**
   * Busca produto por ID
   */
  async getById(productId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const product = mockProducts.find((p) => p.id === productId);
      const productNotFound = !product;

      if (productNotFound) {
        return { error: "Produto não encontrado" };
      }

      return { data: product };
    } catch (error) {
      const errorMessage = error?.message ?? "Erro ao buscar produto";
      return { error: errorMessage };
    }
  },

  /**
   * Cria novo produto (mock)
   */
  async create(data) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newProduct = { id: String(Date.now()), ...data };

      return { data: newProduct };
    } catch (error) {
      const errorMessage = error?.message ?? "Erro ao criar produto";
      return { error: errorMessage };
    }
  },

  /**
   * Atualiza produto (mock)
   */
  async update(productId, data) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedProduct = { id: productId, ...data };

      return { data: updatedProduct };
    } catch (error) {
      const errorMessage = error?.message ?? "Erro ao atualizar produto";
      return { error: errorMessage };
    }
  },

  /**
   * Deleta produto (soft delete mock)
   */
  async delete(productId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = { success: true, id: productId };

      return { data: result };
    } catch (error) {
      const errorMessage = error?.message ?? "Erro ao deletar produto";
      return { error: errorMessage };
    }
  },
};
