Avoid ternary operators directly in object properties. Create variables before use.

❌ `const config = { asset: input.rateType === RateTypeEnum.BRL_QUOTATION ? input.assetTrade : undefined };`
✅ `const isBrlQuotation = ...; const assetForQuotation = isBrlQuotation ? input.assetTrade : undefined; const config = { asset: assetForQuotation };`