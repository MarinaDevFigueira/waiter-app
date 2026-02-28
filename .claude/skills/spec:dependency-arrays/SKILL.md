---
name: spec:dependency-arrays
description: "Spec: Dependency Arrays"
---

# Spec: Dependency Arrays

## Regra
Arrays de dependências (`useEffect`, `useCallback`, `useMemo`) só podem conter valores primitivos (string, number, boolean) ou referências estáveis.

## Motivo
- Previne re-renderizações desnecessárias
- Evita loops infinitos
- Melhora performance
- Facilita debug e rastreamento de mudanças

## ❌ Incorreto

```tsx
// Arrays ou objetos diretamente nas dependências
useEffect(() => {
  fetchData(users);
}, [users]); // ❌ array sempre será diferente

const memoValue = useMemo(() => {
  return products.filter(p => p.active);
}, [products]); // ❌ array sempre será diferente

const callback = useCallback(() => {
  updateSettings(config);
}, [config]); // ❌ objeto sempre será diferente
```

## ✅ Correto

```tsx
// Para arrays: usar join(',') ou length
const usersKey = users.map(u => u.id).join(',');
useEffect(() => {
  fetchData(users);
}, [usersKey]); // ✅ string primitiva

const productsLength = products.length;
const memoValue = useMemo(() => {
  return products.filter(p => p.active);
}, [productsLength]); // ✅ number primitivo

// Para objetos: usar JSON.stringify() ou extrair valores primitivos
const configKey = JSON.stringify(config);
const callback = useCallback(() => {
  updateSettings(config);
}, [configKey]); // ✅ string primitiva

// Ou extrair campos específicos
const { theme, language } = config;
const callback = useCallback(() => {
  updateSettings(config);
}, [theme, language]); // ✅ valores primitivos
```

## Padrões recomendados

### 1. Arrays de IDs
```tsx
// ✅ Converter para string separada por vírgula
const categoryIds = categories.map(c => c.id).join(',');

const getCategoryName = useCallback((categoryId: string) => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category?.name || "—";
}, [categoryIds]);
```

### 2. Arrays de objetos
```tsx
// ✅ Usar length se apenas mudanças de tamanho importam
const productsLength = products.length;
const totalPrice = useMemo(() => {
  return products.reduce((sum, p) => sum + p.price, 0);
}, [productsLength]);

// ✅ Serializar para detectar qualquer mudança
const productsKey = JSON.stringify(products.map(p => ({ id: p.id, price: p.price })));
const filteredProducts = useMemo(() => {
  return products.filter(p => p.active);
}, [productsKey]);
```

### 3. Objetos de configuração
```tsx
// ✅ Extrair valores primitivos
const { page, size, orderBy, direction } = queryParams;
useEffect(() => {
  fetchData(queryParams);
}, [page, size, orderBy, direction]);

// ✅ Ou serializar se tem muitos campos
const queryParamsKey = JSON.stringify(queryParams);
useEffect(() => {
  fetchData(queryParams);
}, [queryParamsKey]);
```

### 4. Referências estáveis (aceitável)
```tsx
// ✅ Refs não causam re-render
const containerRef = useRef(null);
useEffect(() => {
  if (containerRef.current) {
    // ...
  }
}, [containerRef]); // ✅ ref é estável

// ✅ Funções wrappadas em useCallback
const handleClick = useCallback(() => {}, []);
useEffect(() => {
  element.addEventListener('click', handleClick);
}, [handleClick]); // ✅ callback é estável
```

## Casos especiais

### Arrays vazios
```tsx
// ✅ Executar apenas no mount
useEffect(() => {
  fetchInitialData();
}, []); // ✅ sem dependências = executa uma vez
```

### Dependências de props
```tsx
interface Props {
  userId: string;
  filters: FilterObject;
}

function Component({ userId, filters }: Props) {
  // ✅ Props primitivas podem ser usadas diretamente
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  // ✅ Props complexas devem ser serializadas
  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    applyFilters(filters);
  }, [filtersKey]);
}
```

### Lookup maps (performance)
```tsx
// ✅ Para lookups frequentes, criar um Map/objeto
const categoryMap = useMemo(() => {
  const map = new Map<string, Category>();
  categories.forEach(cat => map.set(cat.id, cat));
  return map;
}, [categories.map(c => c.id).join(',')]);

// Usar o map sem re-criar função
const getCategoryName = (categoryId: string) => {
  return categoryMap.get(categoryId)?.name || "—";
};
```

## Performance vs Precisão

### Quando usar `.join(',')`
- Mudanças nos IDs importam
- Array pode ser reordenado
- Performance é crítica

### Quando usar `JSON.stringify()`
- Precisa detectar mudanças em propriedades dos objetos
- Estrutura completa importa
- Performance não é crítica

### Quando usar `.length`
- Apenas tamanho do array importa
- Melhor performance
- Usado para contadores/totais

## Checklist de revisão

- [ ] Arrays de dependências contêm apenas primitivos ou refs?
- [ ] Arrays foram convertidos com `.join(',')` ou `.length`?
- [ ] Objetos foram serializados com `JSON.stringify()` ou desestruturados?
- [ ] Hooks não causam re-renders desnecessários?
- [ ] Performance está adequada para o caso de uso?
