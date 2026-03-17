import type {
  Category,
  CategoryTranslation,
} from "@/shared/schemas/category.schema";
import type { CategoriesOrderByEnum } from "@/shared/enums/categories-order-by.enum";
import type { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { TranslationLanguage } from "@/shared/enums/translations.enum";

export interface GetCategoryResponse {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  active: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoryTranslationsResponse {
  translations: CategoryTranslation[];
}

export interface GetCategoriesRequestQuery {
  page: number;
  size: number;
  orderBy: CategoriesOrderByEnum;
  direction: SortDirection;
  search?: string;
}

export interface GetCategoriesResponse {
  items: Category[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategoryTranslationRequestBody {
  locale: TranslationLanguage;
  name: string;
  description?: string;
}

export interface CreateCategoryRequestBody {
  translations: CategoryTranslationRequestBody[];
  sortOrder?: number;
  active?: boolean;
}

export interface UpdateCategoryRequestBody {
  translations?: CategoryTranslationRequestBody[];
  sortOrder?: number;
  active?: boolean;
}
