# Research: Abas de Gatilhos e Pixel para WhatsApp

**Feature**: 011-whatsapp-tabs
**Date**: 2026-01-05

## Overview

Esta feature é uma reorganização visual de campos existentes em abas. Não há decisões técnicas complexas a pesquisar, pois:
- O componente Tabs já existe e está em uso (shadcn/ui)
- O modelo de dados não será alterado
- Não há novas dependências

## Decisões Técnicas

### D1: Estrutura das Abas

**Decision**: Usar três abas: "Geral", "Gatilhos", "Pixel"

**Rationale**:
- Agrupa campos por categoria lógica (informações básicas, conversão, rastreamento)
- Segue o padrão já estabelecido no projeto com a aba "Geral" existente
- Mantém compatibilidade com o componente Tabs existente

**Alternatives considered**:
- Duas abas (combinar gatilhos e pixel): Descartado por não separar claramente as preocupações
- Quatro abas (separar benefit cards e social proof): Descartado por fragmentar demais a navegação

### D2: Ordem das Abas

**Decision**: Geral → Gatilhos → Pixel

**Rationale**:
- "Geral" primeiro por conter os campos obrigatórios (headline, URL WhatsApp)
- "Gatilhos" segundo por ser opcional mas visualmente importante
- "Pixel" terceiro por ser configuração técnica que nem todos usuários precisam ajustar

**Alternatives considered**:
- Geral → Pixel → Gatilhos: Descartado por colocar configuração técnica antes de elementos visuais

### D3: Campos em cada Aba

**Decision**:

Aba "Geral":
- Headline (obrigatório)
- URL da Foto do Header (opcional)
- Provas Sociais (textarea)
- Texto do Botão (obrigatório)
- URL do WhatsApp (obrigatório)

Aba "Gatilhos":
- Seção Benefit Cards (até 8 cards, tamanho emoji, ordenação)
- Seção Social Proof Notifications (toggle, intervalo)

Aba "Pixel":
- Dropdown de Pixel (opcional)
- Checkboxes de Eventos ao Carregar (mín. 1)
- Dropdown de Evento do Redirect
- Input de Tempo de Redirect

**Rationale**:
- Segue a organização lógica definida na spec
- Mantém campos relacionados juntos
- "Provas Sociais" fica em "Geral" pois é texto simples (vs. notificações dinâmicas em "Gatilhos")

**Alternatives considered**:
- Mover "Provas Sociais" para "Gatilhos": Descartado por não ser um gatilho de conversão ativo, apenas texto estático

### D4: Campos fora das Abas

**Decision**: Manter Status e botões de submit fora das abas

**Rationale**:
- Status é uma configuração global da página, não específica de uma categoria
- Botões de submit devem estar sempre visíveis para o usuário

**Alternatives considered**:
- Colocar Status na aba "Geral": Possível, mas separar do submit buttons criaria inconsistência

### D5: Aba Padrão

**Decision**: "Geral" como aba padrão (defaultValue="geral")

**Rationale**:
- Contém os campos obrigatórios que o usuário precisa preencher primeiro
- É o comportamento atual já implementado

**Alternatives considered**: N/A - já é o comportamento existente

## Análise do Código Existente

### Estrutura Atual do Componente Tabs

```tsx
<Tabs defaultValue="geral" className="w-full">
  <TabsList>
    <TabsTrigger value="geral">Geral</TabsTrigger>
  </TabsList>
  <TabsContent value="geral" className="space-y-4 mt-4">
    {/* 5 campos */}
  </TabsContent>
</Tabs>
```

### Mudanças Necessárias

1. Adicionar `TabsTrigger` para "Gatilhos" e "Pixel"
2. Criar `TabsContent` para "gatilhos" com seções existentes de Benefit Cards e Social Proof
3. Criar `TabsContent` para "pixel" com campos existentes de rastreamento
4. Remover wrappers `<div>` desnecessários das seções movidas

### Preservação de Estado

O estado do formulário já é gerenciado por um único objeto `form` no hook `useState`. Alternar entre abas não afeta o estado - apenas a visibilidade dos campos. Não são necessárias mudanças na lógica de estado.

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebra de layout em mobile | Baixa | Médio | shadcn/ui Tabs já é responsivo |
| Validação de campos em abas diferentes | Baixa | Baixo | Validação acontece no submit, não por aba |
| Usuário não encontrar campo | Baixa | Baixo | Nomes das abas são descritivos |

## Conclusão

Não há incertezas técnicas a resolver. A implementação é uma reorganização direta de elementos JSX existentes dentro de novos `TabsContent` containers.
