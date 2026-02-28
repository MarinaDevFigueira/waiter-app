---
name: spec:product-form-translations
description: "Product Form Translations Spec"
---

# Product Form Translations Spec

## Overview
The product form supports multi-language translations for product name and description fields.

## Architecture
- Uses TanStack Query to fetch existing translations from backend
- Stores all translations in `allTranslations` state
- Allows switching between languages (pt-BR, en-US, es)
- Validates unsaved changes before language switch

## Components
- `LanguageSwitcher` - UI for selecting translation language
- `UnsavedChangesDialog` - Confirmation modal for discarding changes

## Backend Integration
- Endpoint: GET /products/:id/translations
- Returns: { translations: [{ locale, name, description }] }
- Submit sends all translations in translations[] array

## Validation
- At least one translation must have name filled
- Description is optional
- Filters out translations without name before submit
