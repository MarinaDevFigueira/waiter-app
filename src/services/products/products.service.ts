import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import { type Product, type ProductForm } from "@/shared/schemas/product.schema";
import { baseEntityDefaults } from "@/shared/schemas/base-entity.schema";
import type {
  GetProductResponse,
  GetProductTranslationsResponse,
  GetProductsRequestQuery,
  GetProductsResponse,
  GetProductsApiResponse,
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

export const productsService = {
  async getAll(
    queryParams: GetProductsRequestQuery
  ): Promise<ServiceResult<GetProductsResponse>> {
    try {
      const { page, size, orderBy, direction, search, categoryId, priceMin, priceMax, inStock, stockMin, active } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));
      params.set("orderBy", orderBy);
      params.set("direction", direction);

      const hasSearch = search !== undefined && search !== "";
      if (hasSearch) params.set("search", search);

      const hasCategoryId = categoryId !== undefined && categoryId !== "";
      if (hasCategoryId) params.set("categoryId", categoryId);

      const hasPriceMin = priceMin !== undefined;
      if (hasPriceMin) params.set("priceMin", String(priceMin));

      const hasPriceMax = priceMax !== undefined;
      if (hasPriceMax) params.set("priceMax", String(priceMax));

      const hasInStock = inStock === true;
      if (hasInStock) params.set("inStock", "true");

      const hasStockMin = stockMin !== undefined;
      if (hasStockMin) params.set("stockMin", String(stockMin));

      const hasActive = active !== undefined && active !== "";
      if (hasActive) params.set("active", active);

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
  ): Promise<ServiceResult<void>> {
    try {
      const result = await api.delete<unknown>(`/products/${productId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
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
