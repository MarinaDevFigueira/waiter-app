import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import { type Product, type ProductForm } from "@/shared/schemas/product.schema";
import { baseEntityDefaults } from "@/shared/schemas/base-entity.schema";
import { ProductStatusEnum } from "@/shared/enums/product-status.enum";
import type {
  GetProductResponse,
  GetProductTranslationsResponse,
  GetProductsRequestQuery,
  GetProductsResponse,
  GetProductsApiResponse,
  GetProductsRequestFilters,
} from "./interfaces/products.interface";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiProductToProduct(raw: GetProductResponse): Product {
  return {
    ...baseEntityDefaults,
    id: raw.id,
    name: raw.name ?? "",
    description: raw.description ?? "",
    categoryId: raw.categoryId,
    price: raw.price,
    stock: raw.stock,
    unit: raw.unit as Product["unit"],
    images: (raw.images ?? []).map((img) => {
      const isString = typeof img === "string";
      if (isString) {
        const urlParts = (img as string).split("/");
        const fileId = urlParts[urlParts.length - 1];
        return { id: fileId, url: img as string };
      }
      const imgObj = img as { id: string; url: string };
      return { id: imgObj.id, url: imgObj.url };
    }),
    active: raw.active,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    createdBy: "api",
    updatedBy: "api",
    deletedAt: null,
    deletedBy: null,
  };
}

function buildProductFormData(data: ProductForm, files: File[], options?: { excludeImages?: boolean }): FormData {
  const formData = new FormData();

  const translationsJson = JSON.stringify(data.translations);
  formData.append("translations", translationsJson);

  formData.append("categoryId", data.categoryId);
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());
  formData.append("unit", data.unit);
  formData.append("active", data.active ? data.active.toString() : "true");

  const shouldIncludeImages = !options?.excludeImages && Boolean(data.images?.length);
  if (shouldIncludeImages) {
    data.images!.forEach((image) => {
      formData.append("images", image.url);
    });
  }

  files.forEach((file) => {
    formData.append("files", file);
  });

  return formData;
}

function buildProductsApiFilters(rawFilters: Record<string, unknown>): GetProductsRequestFilters {
  const filters = rawFilters as {
    search?: string;
    categoria?: string[];
    precoMin?: number;
    precoMax?: number;
    somenteEmEstoque?: boolean;
    estoqueMin?: number;
    status?: ProductStatusEnum[];
    categoryId?: string;
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
    stockMin?: number;
    active?: string;
  };

  const activeValues = filters.status?.map((s) => (s === ProductStatusEnum.ACTIVE ? "true" : "false"));

  return {
    search: filters.search,
    categoryId: filters.categoryId ?? (filters.categoria?.length ? filters.categoria.join(",") : undefined),
    priceMin: filters.priceMin ?? filters.precoMin,
    priceMax: filters.priceMax ?? filters.precoMax,
    inStock: filters.inStock ?? filters.somenteEmEstoque,
    stockMin: filters.stockMin ?? filters.estoqueMin,
    active: filters.active ?? (activeValues?.length ? activeValues.join(",") : undefined),
  };
}

export const productsService = {
  async getAll(
    queryParams: GetProductsRequestQuery
  ): Promise<ServiceResult<GetProductsResponse>> {
    try {
      const { page, size, orderBy, direction, filters: rawFilters = {} } = queryParams;
      const filters = buildProductsApiFilters(rawFilters as Record<string, unknown>);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));
      params.set("orderBy", orderBy);
      params.set("direction", direction);

      if (filters.search) params.set("search", filters.search);
      if (filters.categoryId) params.set("categoryId", filters.categoryId);
      if (filters.priceMin !== undefined) params.set("priceMin", String(filters.priceMin));
      if (filters.priceMax !== undefined) params.set("priceMax", String(filters.priceMax));
      if (filters.inStock) params.set("inStock", "true");
      if (filters.stockMin !== undefined) params.set("stockMin", String(filters.stockMin));
      if (filters.active) params.set("active", filters.active);

      const result = await api.get<unknown>(`/products?${params.toString()}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const apiData = result.data as GetProductsApiResponse;
      const items = apiData.items.map(mapApiProductToProduct);

      return {
        data: {
          items,
          total: apiData.total,
          page: apiData.page,
          size: apiData.size,
          totalPages: apiData.totalPages,
          hasNextPage: apiData.hasNextPage,
          hasPreviousPage: apiData.hasPreviousPage,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar produtos";
      logger.error(errorMessage, error instanceof Error ? error : null);
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

      return { data: mapApiProductToProduct(result.data as GetProductResponse) };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async create(data: ProductForm, files?: File[]): Promise<ServiceResult<void>> {
    try {
      const hasFiles = Boolean(files?.length);
      const formData = buildProductFormData(data, files ?? [], { excludeImages: !hasFiles });
      const result = await api.postFormData<unknown>("/products", formData);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(
    productId: string,
    data: ProductForm,
    files?: File[]
  ): Promise<ServiceResult<void>> {
    try {
      const formData = buildProductFormData(data, files ?? [], { excludeImages: true });
      const result = await api.putFormData<unknown>(`/products/${productId}`, formData);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async deleteFile(
    productId: string,
    fileId: string
  ): Promise<ServiceResult<void>> {
    try {
      const result = await api.delete<unknown>(
        `/products/${productId}/files/${fileId}`
      );

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao remover imagem";
      logger.error(errorMessage, error instanceof Error ? error : null);
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getTranslations(
    productId: string
  ): Promise<ServiceResult<GetProductTranslationsResponse>> {
    try {
      const result = await api.get<unknown>(`/products/${productId}/translations`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetProductTranslationsResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar traduções";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
