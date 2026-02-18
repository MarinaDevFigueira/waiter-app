import { api } from "@/services/api";
import type { Product } from "@/shared/schemas/product.schema";
import { baseEntityDefaults } from "@/shared/schemas/base-entity.schema";
import {
  productQueryParamsSchema,
  apiProductSchema,
  apiProductListSchema,
} from "./products.schema";
import type { PaginatedProducts, ApiProduct } from "./products.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiProductToProduct(raw: ApiProduct): Product {
  return {
    ...baseEntityDefaults,
    id: raw.id,
    nome: raw.name,
    descricao: raw.description ?? undefined,
    categoria: raw.category,
    preco: raw.price,
    estoque: raw.stock,
    unidade: raw.unit,
    imagemUrl: raw.imageUrl ?? undefined,
    ativo: raw.active,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    createdBy: "api",
    updatedBy: "api",
    deletedAt: null,
    deletedBy: null,
  };
}

const orderByMap: Record<string, string> = {
  nome: "name",
  preco: "price",
  estoque: "stock",
  categoria: "category",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

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

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));
      params.set("orderBy", orderByMap[orderBy] ?? orderBy);
      params.set("direction", direction);

      if (filters.search) params.set("search", filters.search);
      if (filters.categoria?.length) {
        params.set("category", filters.categoria.join(","));
      }
      if (filters.precoMin != null) params.set("priceMin", String(filters.precoMin));
      if (filters.precoMax != null) params.set("priceMax", String(filters.precoMax));
      if (filters.somenteEmEstoque) params.set("inStock", "true");
      if (filters.estoqueMin != null) params.set("stockMin", String(filters.estoqueMin));
      if (filters.status?.length) {
        const activeValues = filters.status.map((s) => (s === "ativo" ? "true" : "false"));
        params.set("active", activeValues.join(","));
      }

      const result = await api.get<unknown>(`/products?${params.toString()}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiProductListSchema.safeParse(result.data);
      if (!parsed.success) {
        return { error: "Resposta inválida do servidor" };
      }

      const items = parsed.data.items.map(mapApiProductToProduct);

      return {
        data: {
          items,
          total: parsed.data.total,
          page: parsed.data.page,
          size: parsed.data.size,
          totalPages: parsed.data.totalPages,
          hasNextPage: parsed.data.hasNextPage,
          hasPreviousPage: parsed.data.hasPreviousPage,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar produtos";
      return { error: errorMessage };
    }
  },

  async getById(productId: string): Promise<ServiceResult<Product>> {
    try {
      const result = await api.get<unknown>(`/products/${productId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiProductSchema.safeParse(result.data);
      if (!parsed.success) {
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiProductToProduct(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar produto";
      return { error: errorMessage };
    }
  },

  async create(data: Omit<Product, "id">): Promise<ServiceResult<Product>> {
    try {
      const body = {
        name: data.nome,
        description: data.descricao,
        category: data.categoria,
        price: data.preco,
        stock: data.estoque,
        unit: data.unidade,
        imageUrl: data.imagemUrl,
        active: data.ativo,
      };

      const result = await api.post<unknown>("/products", body);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiProductSchema.safeParse(result.data);
      if (!parsed.success) {
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiProductToProduct(parsed.data) };
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
      const body: Record<string, unknown> = {};
      if (data.nome !== undefined) body.name = data.nome;
      if (data.descricao !== undefined) body.description = data.descricao;
      if (data.categoria !== undefined) body.category = data.categoria;
      if (data.preco !== undefined) body.price = data.preco;
      if (data.estoque !== undefined) body.stock = data.estoque;
      if (data.unidade !== undefined) body.unit = data.unidade;
      if (data.imagemUrl !== undefined) body.imageUrl = data.imagemUrl;
      if (data.ativo !== undefined) body.active = data.ativo;

      const result = await api.put<unknown>(`/products/${productId}`, body);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiProductSchema.safeParse(result.data);
      if (!parsed.success) {
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiProductToProduct(parsed.data) };
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
      const result = await api.delete<unknown>(`/products/${productId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: { success: true, id: productId } };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar produto";
      return { error: errorMessage };
    }
  },
};
