## Service Structure
```
src/services/{entity}/
├── {entity}.service.ts
├── {entity}.schema.ts        # query params, responses
└── interfaces/{entity}.interface.ts
```
Interface naming: `GetXxxResponse`, `GetXxxRequestQuery`, `CreateXxxRequestBody`, `UpdateXxxRequestBody`.