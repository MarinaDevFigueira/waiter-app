Prefer build-time errors over runtime errors. Never use `Record<string, unknown>`, `any`, or `object`. Use proper TypeScript type inference so modifications to interfaces/entities cause build failures.

❌ `const filters: Record<string, unknown> = { asset: input.asset };`
✅ `const filters: FindOptionsWhere<SystemAssetTradeConfigEntity> = { asset: input.asset };`