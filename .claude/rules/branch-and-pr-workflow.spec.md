# Branch and PR Workflow

## Rule

**NUNCA** commitar diretamente na branch `main`. Sempre criar uma branch separada e abrir Pull Request.

## Workflow Obrigatório

```
1. Criar branch a partir de main
2. Fazer commits na nova branch
3. Push da branch
4. Criar Pull Request apontando para main
5. Retornar URL do PR ao usuário
```

## Nomenclatura de Branch

- `feat/{descricao}` — nova funcionalidade
- `fix/{descricao}` — correção de bug
- `refactor/{descricao}` — refatoração
- `style/{descricao}` — ajustes visuais/estilo
- `chore/{descricao}` — manutenção, configs, deps
- `docs/{descricao}` — documentação

## Exemplo

```bash
git checkout -b feat/add-order-filters
git add src/pages/orders/
git commit -m "feat: add order status filters"
git push -u origin feat/add-order-filters
gh pr create --title "Add order status filters" --base main
```

## Regras

- **NUNCA** fazer `git push` direto na `main`
- **NUNCA** fazer `git commit` estando na branch `main`
- **SEMPRE** criar branch nova para qualquer alteração
- **SEMPRE** criar PR apontando para `main`
- **SEMPRE** retornar a URL do PR ao usuário
- Se já estiver na `main` com mudanças staged, criar branch antes de commitar
