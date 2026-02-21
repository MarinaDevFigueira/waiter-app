# Specs de Implementação - Waiter App

Este diretório contém especificações técnicas que definem padrões de implementação do projeto.

> **IMPORTANTE:** Este índice pode estar desatualizado. Sempre liste todos os arquivos `.spec.md` em `./.specs/` e `~/.specs/` via Glob, leia o título/cabeçalho de cada um, e leia completamente os que forem relevantes à tarefa. Specs não listados aqui são igualmente válidos.

## Como Usar

Antes de implementar ou modificar código:
1. Liste todos os specs via Glob em `./.specs/*.spec.md` e `~/.specs/*.spec.md`
2. Leia o título de cada spec para entender do que trata
3. Leia completamente os specs relevantes à tarefa
4. Siga os padrões definidos nos specs durante a implementação

## Specs Locais (Waiter App)

| Spec | Descrição |
|------|-----------|
| [no-hardcoded-values.spec.md](./no-hardcoded-values.spec.md) | Nunca usar cores/espaçamentos hardcoded, apenas Tailwind CSS |
| [no-barrel-exports.spec.md](./no-barrel-exports.spec.md) | Nunca usar index.js para re-exportar, importar direto do arquivo |
| [rxjs-subscription-cleanup.spec.md](./rxjs-subscription-cleanup.spec.md) | Sempre fazer unsubscribe de BehaviorSubjects no useEffect cleanup |
| [data-testid-pattern.spec.md](./data-testid-pattern.spec.md) | Usar data-testid para seletores Playwright |
| [test-before-commit.spec.md](./test-before-commit.spec.md) | Rodar `npm run test` antes de todo commit |

## Specs Globais (~/.specs/)

Os seguintes specs são globais e aplicam-se a todos os projetos:

| Spec | Descrição |
|------|-----------|
| git-commit-no-coauthor.spec.md | Nunca adicionar co-autoria do Claude em commits/PRs |
| no-code-comments.spec.md | Nunca adicionar comentários, código auto-documentado |
| boolean-variable-extraction.spec.md | Sempre extrair booleanos antes de condicionais |
| eslint-no-disable.spec.md | Nunca desabilitar regras ESLint com comments |

## Checklist de Conformidade

Antes de submeter código, verifique:

- [ ] Nenhum valor hardcoded (cores, spacing) — apenas Tailwind classes
- [ ] Nenhum import via index.js — importar direto do arquivo
- [ ] RxJS subscriptions têm cleanup no useEffect return
- [ ] Elementos testados têm data-testid
- [ ] `npm run test` passa sem erros
- [ ] Nenhum comentário no código
- [ ] Variáveis booleanas extraídas antes de condicionais
- [ ] Nenhum `eslint-disable` no código
- [ ] Commits sem co-autoria do Claude
