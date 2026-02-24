import { api } from "@/services/api";
import { type Product, type ProductForm } from "@/shared/schemas/product.schema";
import { baseEntityDefaults } from "@/shared/schemas/base-entity.schema";
import { ProductStatusEnum } from "@/shared/enums/product-status.enum";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiProductListSchema,
  apiProductSchema,
  apiProductTranslationsSchema,
} from "./products.schema";
import type { PaginatedProducts, ApiProduct, ProductQueryParams, ApiProductTranslations } from "./products.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiProductToProduct(raw: ApiProduct): Product {
  return {
    ...baseEntityDefaults,
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    categoryId: raw.categoryId,
    price: raw.price,
    stock: raw.stock,
    unit: raw.unit as Product["unit"],
    images: (raw.images ?? []).map((img: any) => {
      const isString = typeof img === "string";
      if (isString) {
        const urlParts = img.split("/");
        const fileId = urlParts[urlParts.length - 1];
        return { id: fileId, url: img };
      }
      return { id: img.id, url: img.url };
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

  const translationsJson = JSON.stringify(data.translations)
  formData.append("translations", translationsJson);

  formData.append("categoryId", data.categoryId);
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());
  formData.append("unit", data.unit);
  formData.append("active", data.active ? data.active.toString() : "true");

  const shouldIncludeImages = !options?.excludeImages && Boolean(data.images?.length);
  if (shouldIncludeImages) {
    data.images!.forEach((image) => {
      const imageUrl = image.url;
      formData.append("images", imageUrl);
    });
  }

  files.forEach((file) => {
    formData.append("files", file);
  });

  return formData;
}

export const productsService = {
  async getAll(
    queryParams: ProductQueryParams
  ): Promise<ServiceResult<PaginatedProducts>> {
    try {
      const { page, size, orderBy, direction, filters = {} } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));
      params.set("orderBy", orderBy);
      params.set("direction", direction);

      if (filters.search) params.set("search", filters.search);
      if (filters.categoria?.length) {
        params.set("categoryId", filters.categoria.join(","));
      }
      if (filters.precoMin !== undefined) params.set("priceMin", String(filters.precoMin));
      if (filters.precoMax !== undefined) params.set("priceMax", String(filters.precoMax));
      if (filters.somenteEmEstoque) params.set("inStock", "true");
      if (filters.estoqueMin !== undefined) params.set("stockMin", String(filters.estoqueMin));
      if (filters.status?.length) {
        const activeValues = filters.status.map((s) => (s === ProductStatusEnum.ACTIVE ? "true" : "false"));
        params.set("active", activeValues.join(","));
      }

      const result = await api.get<unknown>(`/products?${params.toString()}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiProductListSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[productsService.getAll] Erro de validação", new Error(zodMessage));
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
    } catch (error: any) {
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

      const parsed = apiProductSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[productsService.getById] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiProductToProduct(parsed.data) };
    } catch (error: any) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getTranslations(
    productId: string
  ): Promise<ServiceResult<ApiProductTranslations>> {
    try {
      const result = await api.get<unknown>(`/products/${productId}/translations`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiProductTranslationsSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[productsService.getTranslations] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      return { data: parsed.data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar traduções";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
