# Research: Notificação de Prova Social

**Feature**: 007-social-proof-notification
**Date**: 2026-01-03

## Research Tasks

### 1. Padrão de Toast Notifications em React

**Decision**: Usar CSS animations nativas com Tailwind CSS para animações de entrada/saída

**Rationale**:
- O projeto já usa Tailwind CSS com `tailwindcss-animate`
- Não requer dependências adicionais
- Performance otimizada para animações CSS (hardware-accelerated)
- Consistente com o padrão visual existente no projeto

**Alternatives Considered**:
- Framer Motion: Mais poderoso, mas adiciona dependência desnecessária para animações simples
- React Spring: Overhead para o caso de uso simples
- shadcn/ui Toast: Não instalado no projeto, requer configuração adicional

### 2. Geração de Dados Aleatórios (Nomes e Cidades)

**Decision**: Lista hardcoded de 50 nomes brasileiros populares e 30 cidades brasileiras

**Rationale**:
- Requisito explícito da spec: "Listas de nomes e cidades brasileiros comuns serão definidas no código"
- Simplicidade de implementação
- Não requer chamadas de API externas
- Fácil manutenção e atualização futura

**Alternatives Considered**:
- API externa (IBGE, etc.): Adiciona latência e ponto de falha
- Banco de dados: Complexidade desnecessária para lista estática
- Configurável pelo admin: Explicitamente fora do escopo

### 3. Posicionamento da Notificação

**Decision**: Canto inferior esquerdo com `fixed` positioning

**Rationale**:
- Clarificação na spec: "Canto inferior (menos intrusivo, padrão toast)"
- Não interfere com o conteúdo principal da página
- Padrão reconhecido pelos usuários (toast notifications)
- Funciona bem em mobile e desktop

**Alternatives Considered**:
- Topo: Mais intrusivo, pode cobrir header
- Centro: Bloqueia interação com conteúdo
- Canto inferior direito: Pode conflitar com botões de ação

### 4. Gestão de Intervalos e Ciclo de Vida

**Decision**: useEffect com setInterval para controle do ciclo de notificações

**Rationale**:
- Padrão React idiomático
- Fácil de limpar no cleanup
- Permite configuração dinâmica do intervalo

**Implementation Details**:
```
1. Delay inicial antes da primeira notificação (2-3 segundos após page load)
2. Exibição da notificação por 4 segundos (tempo de leitura)
3. Animação de saída (300-500ms)
4. Intervalo configurável até próxima notificação
5. Loop infinito enquanto página ativa
```

### 5. Prevenção de Repetição Consecutiva

**Decision**: Manter histórico das últimas 5 combinações para evitar repetição

**Rationale**:
- FR-008: "Sistema DEVE garantir que nomes/cidades não se repitam consecutivamente"
- Buffer de 5 permite variação suficiente sem esgotar opções
- Implementação simples com array circular

**Implementation**:
```typescript
// Manter últimos 5 usados
const recentCombinations = useRef<string[]>([]);
const MAX_RECENT = 5;

function getRandomPerson() {
  let name, city, key;
  do {
    name = names[Math.floor(Math.random() * names.length)];
    city = cities[Math.floor(Math.random() * cities.length)];
    key = `${name}-${city}`;
  } while (recentCombinations.current.includes(key));

  recentCombinations.current.push(key);
  if (recentCombinations.current.length > MAX_RECENT) {
    recentCombinations.current.shift();
  }
  return { name, city };
}
```

### 6. Extensão do Schema Zod

**Decision**: Adicionar campos `socialProofEnabled` (boolean) e `socialProofInterval` (number) ao schema existente

**Rationale**:
- Consistente com padrão existente no projeto
- Validação centralizada
- Defaults seguros: enabled=false, interval=10

**Schema Extension**:
```typescript
// Adicionar ao whatsAppPageSchema
socialProofEnabled: z.boolean().default(false),
socialProofInterval: z.number()
  .int()
  .min(5, "Mínimo 5 segundos")
  .max(60, "Máximo 60 segundos")
  .default(10),
```

### 7. Responsividade Mobile

**Decision**: Notificação ocupa largura máxima de 320px em mobile, posicionada com padding seguro

**Rationale**:
- Legibilidade em telas pequenas
- Não bloqueia elementos importantes
- Consistente com padrão de toast em apps mobile

**CSS Approach**:
```css
/* Base */
position: fixed;
bottom: 1rem;
left: 1rem;
max-width: 320px;
z-index: 50;

/* Mobile adjustments */
@media (max-width: 640px) {
  left: 0.5rem;
  right: 0.5rem;
  max-width: none;
}
```

## Summary

Todas as decisões técnicas foram tomadas com base em:
1. Padrões existentes no codebase
2. Simplicidade de implementação
3. Performance (client-side animations)
4. Requisitos explícitos da especificação

Não há ambiguidades restantes. A implementação pode prosseguir para Phase 1.
