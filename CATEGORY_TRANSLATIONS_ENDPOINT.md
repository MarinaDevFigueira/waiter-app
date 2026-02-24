# Category Translations Endpoint Documentation

## Overview

O backend possui um endpoint dedicado para buscar todas as traduções de uma categoria específica. Este endpoint retorna todas as traduções disponíveis (pt-BR, en-US, es) em uma única requisição.

---

## Endpoint

### GET /categories/:id/translations

Retorna todas as traduções de uma categoria específica.

**URL Pattern:**
```
GET /categories/{categoryId}/translations
```

**Authentication:**
- Bearer token required
- Header: `Authorization: Bearer {access_token}`

**Parameters:**
- `id` (path, required): ID da categoria (UUID)
- `businessId` (extracted from JWT token)

---

## Response Structure

### TypeScript Interface

```typescript
interface ListCategoryTranslationsResponse {
  translations: Array<{
    locale: "pt-BR" | "en-US" | "es";
    name: string;
    description?: string;
  }>;
}
```

### Response DTO (Backend)

```typescript
export class ListCategoryTranslationsResponseDTO {
  translations: CategoryTranslationResponseDTO[];
}

export class CategoryTranslationResponseDTO {
  locale: LocaleEnum;
  name: string;
  description?: string;
}

export enum LocaleEnum {
  PT = 'pt-BR',
  EN = 'en-US',
  ES = 'es',
}
```

---

## Example Response

### Success Response (200 OK)

```json
{
  "translations": [
    {
      "locale": "pt-BR",
      "name": "Pizzas",
      "description": "Nossas deliciosas pizzas artesanais"
    },
    {
      "locale": "en-US",
      "name": "Pizzas",
      "description": "Our delicious artisanal pizzas"
    },
    {
      "locale": "es",
      "name": "Pizzas",
      "description": "Nuestras deliciosas pizzas artesanales"
    }
  ]
}
```

### Example with No Description

```json
{
  "translations": [
    {
      "locale": "pt-BR",
      "name": "Bebidas"
    },
    {
      "locale": "en-US",
      "name": "Beverages"
    },
    {
      "locale": "es",
      "name": "Bebidas"
    }
  ]
}
```

---

## Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `translations` | Array | Yes | Array of translation objects |
| `translations[].locale` | Enum | Yes | Language code: "pt-BR", "en-US", or "es" |
| `translations[].name` | String | Yes | Category name in the specified language |
| `translations[].description` | String | No | Optional category description |

---

## Comparison with Products Endpoint

### Similarities

Both endpoints (`/categories/:id/translations` and `/products/:id/translations`) follow the **identical structure**:

```typescript
{
  translations: Array<{
    locale: "pt-BR" | "en-US" | "es";
    name: string;
    description?: string;
  }>;
}
```

### Differences

**None.** The structure is 100% identical between categories and products translations endpoints.

Both use:
- Same `LocaleEnum` values
- Same field names (`locale`, `name`, `description`)
- Same optional/required rules
- Same response wrapper (`translations` array)

---

## Usage Example (Frontend)

### API Client Call

```javascript
import { api } from '@/services/api';

async function fetchCategoryTranslations(categoryId) {
  try {
    const response = await api.get(`/categories/${categoryId}/translations`);
    return { data: response.data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message ?? 'Erro ao buscar traduções';
    return { error: errorMessage };
  }
}
```

### Service Method

```javascript
export const categoryService = {
  async getTranslations(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}/translations`);
      return { data: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message ?? 'Erro ao buscar traduções';
      return { error: errorMessage };
    }
  },
};
```

### React Hook Usage

```javascript
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { useLanguage } from '@/hooks/use-language';

function useCategoryTranslations(categoryId) {
  const { addLanguagePrefix } = useLanguage();

  return useQuery({
    queryKey: addLanguagePrefix('category-translations', categoryId),
    queryFn: async () => {
      const result = await categoryService.getTranslations(categoryId);
      const hasError = Boolean(result.error);
      if (hasError) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: Boolean(categoryId),
  });
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Category not found"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Access denied to this business"
}
```

---

## Backend Implementation Details

### Controller Method (Reference)

Located in: `/src/categories/controllers/categories.controller.ts`

```typescript
@Get(':id/translations')
@ApiOperation({ summary: 'Listar traduções da categoria' })
@TransformTo(ListCategoryTranslationsResponseDTO)
async listTranslations(
  @Param('id') id: string,
  @BusinessId() businessId: string,
) {
  const result = await this.listCategoryTranslationsUseCase.execute({
    id,
    businessId
  });

  const hasError = !!result.error;
  if (hasError) throw result.error;

  return result.data;
}
```

### Key Features

1. Uses `@TransformTo` interceptor to serialize response
2. Extracts `businessId` from JWT token automatically
3. Validates user has access to the category's business
4. Returns all translations in a single call

---

## Notes

1. The endpoint returns ALL translations for a category, not filtered by current language
2. Always returns an array, even if only one translation exists
3. `description` field is optional and may be omitted
4. The `locale` field uses the backend's `LocaleEnum` values
5. This endpoint is identical in structure to `/products/:id/translations`
6. Requires authentication via Bearer token
7. User must have access to the category's business (verified via `businessId`)

---

## Related Endpoints

- `GET /categories` - List all categories (filtered by current locale)
- `GET /categories/:id` - Get single category (in current locale)
- `POST /categories` - Create category with translations
- `PATCH /categories/:id` - Update category (including translations)
- `GET /products/:id/translations` - Get product translations (identical structure)
