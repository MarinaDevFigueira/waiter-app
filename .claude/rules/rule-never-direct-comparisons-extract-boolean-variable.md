Never use direct comparisons in conditionals. Always create a well-named boolean variable first.

❌ `if (config.rateType === RateTypeEnum.BRL_QUOTATION) { ... }`
✅ `const isBrlQuotation = config.rateType === RateTypeEnum.BRL_QUOTATION; if (isBrlQuotation) { ... }`

❌ `asset: config.rateType === RateTypeEnum.BRL_QUOTATION ? config.assetTrade : undefined`
✅ `const isBrlQuotation = ...; const assetForQuotation = isBrlQuotation ? config.assetTrade : undefined;`