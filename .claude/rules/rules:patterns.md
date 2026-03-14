# Core Patterns

## Use Case Pattern

### Interface (`interfaces/{action}-{name}.use-case.interface.ts`)
```typescript
import { EntityManager } from 'src/database/interfaces/database.interface';

export declare namespace {UseCaseName}Types {
  export interface Input { ... }
  export interface OutputObject { ... }
  export type Output = Promise<Result<OutputObject, HttpException>>;
}

export interface I{UseCaseName}UseCase {
  execute(input: {UseCaseName}Types.Input, entityManager?: EntityManager): {UseCaseName}Types.Output;
}
export const I{UseCaseName}UseCase = Symbol('I{UseCaseName}UseCase');
```

### Implementation (`use-cases/{action}-{name}.use-case.ts`)
```typescript
export class {UseCaseName}UseCase implements I{UseCaseName}UseCase {
  constructor(private readonly db: DatabaseType, private readonly logger: Logger) {}

  async execute(input: {UseCaseName}Types.Input, entityManager?: EntityManager): {UseCaseName}Types.Output {
    const manager = entityManager ?? this.db;
    try {
      // write: wrap in manager.transaction(async (tx) => { ... })
      // read: query directly with manager
    } catch (error) {
      this.logger.error('Failed to ...', error);
      const message = error instanceof Error ? error.message : String(error);
      return { error: ModuleException.create(GENERIC_CODE, message) };
    }
  }
}
```

### Provider (`providers/{action}-{name}.use-case.provider.ts`)
```typescript
export const {UseCaseName}UseCaseProvider: Provider = {
  provide: I{UseCaseName}UseCase,
  inject: [DATABASE_TOKEN],
  useFactory: (db: DatabaseType) => {
    const logger = LoggerFactory.create({UseCaseName}UseCase.name);
    return new {UseCaseName}UseCase(db, logger);
  },
};
```

## Result Pattern
```typescript
import { Result } from 'src/shared/interfaces/result.interface';
// type: { data: T; error?: never } | { data?: never; error: E }
```
- `execute()` always returns `Promise<Result<OutputObject, HttpException>>`
- Private methods that can fail: `Promise<Result<T, HttpException>>`
- Private void methods (never fail): `Promise<void>` or direct value
- Tasks handle Result internally — never propagate to outside
- Never `throw` inside use-cases/services

## Transaction Pattern (Write Use Cases)
```typescript
const result = await manager.transaction(async (tx) => {
  const [item] = await tx.select().from(table).where(...);
  const hasItem = !!item;
  if (!hasItem) {
    tx.rollback();
    return { error: ModuleException.create(NOT_FOUND_CODE, id) };
  }
  const [updated] = await tx.update(table).set({...}).where(...).returning();
  return { data: { item: updated } };
});
return result;
```
- Expected errors: `tx.rollback()` + return `{ error: ... }`
- Read-only use-cases: no transaction needed
- `entityManager?: EntityManager` always as second parameter on interface and implementation

## Exception Pattern
```
src/shared/
├── enums/{module}.messages.code.enum.ts
└── exceptions/custom-exceptions/{module}.exception.ts
```

**Module prefixes:** `0x0001` = Products, `0x0002` = Orders (each module has unique prefix)

**3 files REQUIRED** when adding a new error code:

1. **Enum file** — add enum value + Messages entry (use `?` for dynamic params):
```typescript
export enum {Module}MessagesCodeEnum { x00XX000 = '0x00XX000' }
export const {Module}Messages = {
  [{Module}MessagesCodeEnum.x00XX000]: '0x00XX000 - Erro genérico. Details: ?',
};
```

2. **Exception class** — add `case` in `create()`; include `isInstance` for type checking:
```typescript
export class {Module}Exception extends HttpException {
  name = '{Module}Exception';
  constructor(data: { message: string; code: number }) { super(data.message, data.code); }
  static isInstance(error: unknown): boolean {
    return (error as { name?: string })?.name === '{Module}Exception';
  }
  static create(code: {Module}MessagesCodeEnum, ...args: string[]) {
    switch (code) {
      case {Module}MessagesCodeEnum.x00XX001:
        return new {Module}Exception({ message: this.formatMessage(...), code: HttpStatus.NOT_FOUND });
      default:
        return new {Module}Exception({ message: this.formatMessage(...), code: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }
  static formatMessage(message: string, args: string[]): string {
    let formatted = message;
    args.forEach((arg) => { formatted = formatted.replace('?', arg); });
    return formatted;
  }
}
```

3. **Call site** — `throw ModuleException.create(code, ...args)` — never generic NestJS exceptions

Register in `filter.exception.ts`: `static exceptionsList = [{Module}Exception]`

GlobalExceptionFilter: Logger injected via constructor (DI), never `new Logger()`.