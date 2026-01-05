# Research: WhatsApp Admin Tabs Organization

**Feature**: 010-whatsapp-admin-tabs
**Date**: 2026-01-04

## Research Tasks

### 1. shadcn/ui Tabs Component

**Decision**: Usar componente Tabs do shadcn/ui baseado em @radix-ui/react-tabs

**Rationale**:
- Projeto já utiliza shadcn/ui para outros componentes (Button)
- Componentes Radix UI são acessíveis por padrão (ARIA)
- Estilo consistente com o resto da aplicação
- Não requer configuração adicional além da instalação

**Alternatives Considered**:
- Tabs customizado com CSS puro: Rejeitado - mais trabalho, menos acessível
- Headless UI: Rejeitado - projeto já usa Radix UI

### 2. Integração com Formulário Existente

**Decision**: Manter o formulário como componente único, usando Tabs apenas para organização visual

**Rationale**:
- O formulário atual funciona como unidade única com um submit handler
- Dividir em componentes separados por aba adicionaria complexidade desnecessária
- State management já existe e funciona bem
- Tabs atua apenas como agrupamento visual, não como separação lógica

**Alternatives Considered**:
- Componentes separados por aba: Rejeitado - adicionaria prop drilling e complexidade
- Context API para compartilhar state: Rejeitado - overengineering para este caso

### 3. Estrutura de Abas

**Decision**: Implementar apenas uma aba "Geral" inicialmente

**Rationale**:
- Requisito explícito: apenas campos específicos vão para aba "Geral"
- Demais seções permanecem fora do sistema de abas
- Estrutura extensível para futuras abas se necessário

**Layout Final**:
```
┌─────────────────────────────────────────────┐
│ Aparência Global (seção separada)           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ [Geral]                                     │  ← Tab única
├─────────────────────────────────────────────┤
│ • Headline *                                │
│ • URL da Foto do Header (opcional)          │
│ • Provas Sociais (textarea)                 │
│ • Texto do Botão *                          │
│ • URL do WhatsApp *                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Pixel/Eventos (seção existente)             │
├─────────────────────────────────────────────┤
│ • Pixel (select)                            │
│ • Evento de Redirect *                      │
│ • Eventos ao Carregar *                     │
│ • Tempo de Redirect                         │
│ • Status                                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Benefit Cards (seção existente)             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Notificações Prova Social (seção existente) │
└─────────────────────────────────────────────┘

[Botões: Criar/Atualizar | Cancelar edição]

┌─────────────────────────────────────────────┐
│ Páginas cadastradas (lista existente)       │
└─────────────────────────────────────────────┘
```

### 4. Dependência @radix-ui/react-tabs

**Decision**: Instalar @radix-ui/react-tabs via yarn

**Rationale**:
- Projeto já tem @radix-ui/react-slot instalado
- Padrão consistente com outras dependências shadcn/ui
- Versão estável disponível

**Command**: `yarn add @radix-ui/react-tabs`

## Resolved Clarifications

| Item | Resolution |
|------|------------|
| Escopo das abas | Apenas aba "Geral" com 5 campos |
| Seções restantes | Permanecem fora do sistema de abas |
| Componente UI | shadcn/ui Tabs (Radix UI) |
| Dependência | @radix-ui/react-tabs a ser instalada |

## Outstanding Items

Nenhum item pendente. Todos os aspectos técnicos foram resolvidos.
