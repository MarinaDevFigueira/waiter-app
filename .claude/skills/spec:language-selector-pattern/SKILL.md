---
name: spec:language-selector-pattern
description: "Language Selector Pattern"
---

# Language Selector Pattern

Sistema de seleção de idioma com RxJS e persistência.

## Estrutura

```
src/
├── shared/
│   ├── subjects/
│   │   └── language.subject.js
│   ├── hooks/
│   │   └── useLanguage.js
│   └── enums/
│       └── translations.enum.js
└── components/
    └── ui/
        └── language-selector/
            └── language-selector.jsx
```

## Componente LanguageSelector

Dropdown com opções de idioma:
- Ícone TranslateIcon do Phosphor
- Formato: `bandeira - EnumLabel` (ex: 🇧🇷 - PT_BR)
- CheckIcon para indicar idioma selecionado
- Persiste no localStorage

```jsx
import { LanguageSelector } from "@/components/ui/language-selector/language-selector";

<LanguageSelector />
```

## Subject de Idioma

```javascript
import { languageObservable } from "@/shared/subjects/language.subject";

// Obter idioma atual
const current = languageObservable.getValue();

// Mudar idioma
languageObservable.setLanguage(TranslationsEnum.EN_US);
```

## Hook useLanguage

```jsx
import { useLanguage } from "@/shared/hooks/useLanguage";

function MyComponent() {
  const { language, setLanguage } = useLanguage();

  return <div>Current: {language}</div>;
}
```

## Integração com Sistema i18n

O subject automaticamente:
1. Persiste no localStorage (chave: `language`)
2. Atualiza `document.documentElement.lang`
3. Chama `setLanguage()` do translations.js
4. Notifica subscribers via RxJS

## Idiomas Disponíveis

```javascript
TranslationsEnum.PT_BR  // "pt-BR" (padrão)
TranslationsEnum.EN_US  // "en-US"
```

## Uso nos Layouts

LanguageSelector deve aparecer ao lado do ThemeToggle:

```jsx
// AppLayout e DashboardLayout
<LanguageSelector />
<ThemeToggle />
```
