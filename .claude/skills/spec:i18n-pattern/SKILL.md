---
name: spec:i18n-pattern
description: "Internationalization (i18n) Pattern"
---

# Internationalization (i18n) Pattern

Estrutura de internacionalização usando JSON com árvore hierárquica organizada por página.

## Estrutura

```
src/shared/
├── enums/
│   └── translations.enum.js
└── translations/
    ├── pt-BR.json
    └── en-US.json
```

## Enum de Idiomas

```javascript
export const TranslationsEnum = {
  PT_BR: "pt-BR",
  EN_US: "en-US",
};
```

## Organização das Traduções

Traduções organizadas em árvore hierárquica:

```json
{
  "common": {
    "buttons": { ... },
    "status": { ... },
    "validation": { ... }
  },
  "login": {
    "pageTitle": "...",
    "form": { ... }
  },
  "foods": { ... },
  "products": { ... },
  "orders": { ... },
  "dashboard": { ... }
}
```

## Nomenclatura

- **Chaves descritivas**: usar camelCase (`pageTitle`, `usernamePlaceholder`)
- **Agrupamento semântico**: agrupar por contexto (buttons, validation, form)
- **Interpolação**: usar `{{variableName}}` para valores dinâmicos

## Arquivos de Tradução

- `pt-BR.json` - Português do Brasil (padrão)
- `en-US.json` - Inglês Americano

## Páginas Cobertas

- **common** - Elementos compartilhados (botões, status, validações)
- **login** - Página de autenticação
- **foods** - Cardápio de produtos
- **products** - Gestão de produtos (dashboard)
- **orders** - Pedidos da cozinha
- **dashboard** - Navegação e breadcrumbs
- **notFound** - Páginas 404
