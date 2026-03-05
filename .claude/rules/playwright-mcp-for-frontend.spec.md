# Always Use Playwright MCP for Frontend Validation

## Rule

**SEMPRE** use as tools do MCP Playwright para validar qualquer trabalho frontend. Nunca confie apenas no código escrito — valide visualmente.

## Quando Usar

Use Playwright MCP tools em **todas** estas situações:

### Implementação Frontend
- Após criar ou modificar componentes
- Após alterar estilos, layouts, responsividade
- Após adicionar/remover elementos visuais
- Após modificar animações ou transições

### Debug Frontend
- Quando algo "deveria funcionar" mas o usuário reporta problema
- Para verificar estado real do DOM vs esperado
- Para inspecionar console errors (`browser_console_messages`)
- Para verificar network requests (`browser_network_requests`)

### Design & Styling
- Validar que o design implementado corresponde ao esperado
- Verificar responsividade em diferentes tamanhos (`browser_resize`)
- Confirmar cores, espaçamentos, tipografia
- Testar dark mode / light mode

### Interações
- Testar clicks, formulários, navegação
- Verificar estados hover, focus, active
- Testar fluxos completos (login, adicionar ao carrinho, etc.)

## Tools Disponíveis e Quando Usar

| Tool | Quando Usar |
|------|-------------|
| `browser_navigate` | Abrir a página/rota a ser testada |
| `browser_snapshot` | **Preferir sobre screenshot** — captura acessibilidade e estrutura |
| `browser_take_screenshot` | Validação visual de design/layout |
| `browser_click` | Testar interações de click |
| `browser_type` | Testar inputs e formulários |
| `browser_fill_form` | Preencher formulários completos |
| `browser_console_messages` | Verificar erros no console |
| `browser_network_requests` | Verificar chamadas de API |
| `browser_resize` | Testar responsividade |
| `browser_evaluate` | Inspecionar estado do DOM/JS |
| `browser_hover` | Testar estados hover |
| `browser_press_key` | Testar atalhos de teclado |
| `browser_wait_for` | Aguardar elementos async |

## Workflow Obrigatório

```
1. Implementar código
2. npm run dev (se não estiver rodando)
3. browser_navigate → página alterada
4. browser_snapshot → verificar estrutura
5. browser_take_screenshot → verificar visual
6. browser_console_messages → verificar erros
7. Corrigir problemas encontrados
8. Repetir até validado
```

## Exemplos

### Após criar componente
```
1. browser_navigate("http://localhost:5173/rota")
2. browser_snapshot() → verificar se componente renderizou
3. browser_take_screenshot() → verificar aparência
4. browser_click(ref) → testar interatividade
```

### Após alterar estilo
```
1. browser_navigate("http://localhost:5173/rota")
2. browser_take_screenshot() → comparar visual
3. browser_resize(375, 667) → testar mobile
4. browser_take_screenshot() → verificar responsivo
5. browser_resize(1280, 720) → voltar desktop
```

### Debug de problema
```
1. browser_navigate("http://localhost:5173/rota-com-bug")
2. browser_console_messages(level: "error") → verificar erros JS
3. browser_network_requests() → verificar falhas de API
4. browser_snapshot() → verificar estrutura DOM
5. browser_evaluate() → inspecionar estado
```

## Regras

- **NUNCA** entregar implementação frontend sem validar com Playwright MCP
- **SEMPRE** preferir `browser_snapshot` sobre `browser_take_screenshot` para entender estrutura
- **SEMPRE** verificar `browser_console_messages` para erros silenciosos
- **SEMPRE** testar ao menos mobile (375px) e desktop (1280px) para mudanças de layout
- **NUNCA** usar `npm run test` durante desenvolvimento — usar MCP Playwright diretamente
