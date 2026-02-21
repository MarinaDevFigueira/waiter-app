export const TranslationsEnum = {
  PT_BR: "pt-BR",
  EN_US: "en-US",
  ES: "es"
} as const;

export type TranslationLanguage = (typeof TranslationsEnum)[keyof typeof TranslationsEnum];
