---
name: dev
description: "This skill should be used when the user invokes /dev with a development task. It analyzes the prompt, decomposes it into independent sub-tasks, and launches one or more @dev agents (subagent_type: dev) in parallel when tasks are logically independent or affect different modules."
---

# Dev - Multi-Agent Task Orchestrator

Orchestrate development tasks by analyzing the user's prompt and dispatching one or more `dev` agents to execute the work. Each agent follows the project's coding standards defined in `.claude/agents/dev.md`.

## When to Trigger

Activate when the user invokes `/dev` followed by a development task description.

Examples:
- `/dev adicione um novo componente de filtro na foods page`
- `/dev crie hook useOrders e adicione testes para categories`
- `/dev refatore o módulo de categories e adicione paginação em products`

## Task Decomposition

Analyze the user's prompt to identify independent sub-tasks. A sub-task is independent when:

1. **Different modules** - Tasks targeting different feature modules (e.g., foods + products) are independent
2. **Different layers** - Tasks in different layers with no dependency (e.g., new hook + new UI component for unrelated feature)
3. **Logical independence** - Tasks with no data dependency between them

Tasks that depend on each other must run sequentially within a single agent. Examples of dependent tasks:
- Create a component AND write tests for that same component
- Create a hook AND create a page that uses that hook
- Create a schema AND create a service that uses that schema
- Refactor a component AND update its tests

## Execution Process

### Step 1: Analyze the Prompt

Parse the user's input to extract:
- The distinct tasks requested
- Which module/feature each task belongs to
- Dependencies between tasks

### Step 2: Determine Agent Count

- **Minimum**: 1 agent (always)
- **Multiple agents**: When 2+ independent task groups are identified
- **Maximum**: Match the number of independent task groups (do not over-parallelize)

### Step 3: Build Agent Prompts

For each agent, construct a detailed prompt that includes:
- The specific task(s) to execute
- The target module/feature/files
- Any context from the user's original prompt
- Instruction to follow all project specs from `.claude/agents/dev.md`

Each prompt must be self-contained — the agent receives no prior conversation context beyond what is explicitly included in the prompt.

### Step 4: Launch Agents

Use the `Task` tool with `subagent_type: "dev"` to launch agents.

- **Independent tasks**: Launch all agents in a single message (parallel execution)
- **Dependent tasks**: Group them into a single agent prompt

### Step 5: Report Results

After all agents complete, provide a concise summary to the user:
- What each agent accomplished
- Any errors or issues encountered
- Files created or modified

## Prompt Template for Each Agent

```
Projeto: waiter-app (React frontend)
Diretório: /Users/lemuelfigueira/projetos/ilemuelfigueira/waiter-app

Tarefa:
{task_description}

Módulo/Feature alvo: {module_name}
Arquivos relevantes: {relevant_files}

Instruções:
- Siga todas as convenções do projeto definidas no agent dev.md
- Não adicione comentários no código
- Use variáveis nomeadas, nunca inline
- Use data-* attributes para variações condicionais
- Siga o Service Result Pattern para services
- Use composite pattern para componentes com múltiplas partes
- Nunca use barrel exports (index.js)
- Ao finalizar, execute: npm run lint
- Usar MCP Playwright para testar visualmente as implementações (browser_navigate, browser_snapshot, browser_click, etc.)
- NUNCA usar npm run test ou npm run test:ui para validar implementações
```

## Project Structure Reference

```
src/
├── routes/           # TanStack Router file-based routes
├── pages/            # Page components + local components
│   ├── foods/        # Customer foods page
│   ├── products/     # Admin products management
│   ├── categories/   # Admin categories management
│   ├── orders/       # Orders (admin + kitchen views)
│   ├── login/        # Authentication
│   └── dashboard/    # Admin dashboard
├── components/
│   ├── ui/           # Reusable UI (shadcn/ui pattern)
│   ├── layouts/      # App + Dashboard layouts
│   └── auth/         # Auth components
├── services/         # API service layer
├── shared/
│   ├── hooks/        # Custom hooks
│   ├── subjects/     # RxJS BehaviorSubjects
│   ├── schemas/      # Zod schemas
│   ├── constants/    # Constants + enums
│   └── translations/ # i18n JSON files
└── lib/              # Utilities (cn, formatPrice, logger, cookies)
```

## Examples

### Single Agent (1 task or dependent tasks)
User: `/dev adicione skeleton loading na foods page`
Analysis: Single task in single module → 1 agent

### Multiple Agents (independent tasks)
User: `/dev crie componente de filtro em products e adicione campo active em categories page`
Analysis: products + categories are different modules → 2 agents in parallel

### Mixed (some parallel, some sequential)
User: `/dev crie hook useOrders com testes, e refatore o slider de categories`
Analysis:
- Agent 1: useOrders hook + tests (dependent, same agent)
- Agent 2: categories slider refactor (independent)
→ 2 agents in parallel
