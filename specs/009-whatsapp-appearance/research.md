# Research: Personalização Visual das Páginas de WhatsApp

**Feature**: 009-whatsapp-appearance
**Date**: 2026-01-04

## Sumário de Pesquisa

Este documento consolida as decisões técnicas para a funcionalidade de personalização visual das páginas de redirecionamento WhatsApp (/w/[slug]).

---

## 1. Escopo da Personalização

### Decisão
Configuração global de aparência aplicada a todas as páginas `/w/[slug]` com três propriedades: texto, cor de fundo e toggle de borda.

### Racional
- Clarificação do usuário: configuração é global para todas as páginas WhatsApp
- Escopo mínimo conforme solicitado: texto, cor de fundo, toggle de borda (sim/não)
- Cor da borda fixa (#e5e7eb) quando habilitada - sem necessidade de configuração adicional

### Alternativas Consideradas
- Configuração por página → Rejeitado: usuário especificou global
- Configuração por Pixel → Rejeitado: usuário especificou global
- Mais opções de estilo (padding, shadow, border-radius) → Rejeitado: usuário especificou escopo mínimo

---

## 2. Implementação Técnica

### Decisão
Usar Edge Config para armazenar configuração única com chave `whatsapp_appearance`.

### Racional
- Seguir padrão existente do projeto (`whatsapp_pages_*`)
- Leitura rápida (< 100ms) via Edge Config
- Não requer índice (singleton)
- Compatível com Edge Runtime

### Implementação

| Aspecto | Decisão |
|---------|---------|
| Storage Key | `whatsapp_appearance` |
| Location | Vercel Edge Config (singleton) |
| Schema | `{ redirectText: string, backgroundColor?: string, borderEnabled: boolean, updatedAt: string }` |
| Admin UI | Seção em `/parametrizacao/whatsapp` |
| API | `/api/whatsapp/appearance` (GET/PUT) |
| Repo | `lib/repos/whatsapp-appearance.ts` |

---

## 3. Valores Padrão

### Decisão
Quando configuração não existe no Edge Config, usar valores padrão hardcoded.

### Racional
- Mantém comportamento atual das páginas /w/[slug]
- Não quebra páginas existentes
- Fallback seguro

### Valores
- `redirectText`: "Redirecionando..."
- `backgroundColor`: undefined (transparente)
- `borderEnabled`: false
- Cor da borda quando habilitada: `#e5e7eb` (Tailwind gray-200)

---

## 4. Estilo da Borda

### Decisão
Cor fixa #e5e7eb, espessura 1px, estilo solid, raio 8px (rounded-lg).

### Racional
- Simplicidade de configuração (apenas toggle on/off)
- Cor neutra que combina com qualquer background
- Consistente com design system do Tailwind
- Conforme clarificado na spec

### Alternativas Consideradas
- Permitir cor customizada da borda → Rejeitado: usuário especificou cor fixa
- Permitir espessura customizada → Rejeitado: escopo mínimo

---

## 5. Interface de Administração

### Decisão
Adicionar seção "Aparência" na página existente `/parametrizacao/whatsapp`.

### Racional
- Não criar nova rota, reaproveitar layout existente
- Consistência com padrão de admin do projeto
- Usuário já navega até /parametrizacao/whatsapp para gerenciar páginas

### Componentes UI
- Input de texto para `redirectText`
- Color picker para `backgroundColor`
- Toggle switch para `borderEnabled`
- Botão de salvar com feedback de sucesso/erro

---

## 6. Padrões do Projeto

### Repository Pattern
Todos os acessos a dados passam por `lib/repos/*.ts` com `'use server'`.

### Validação
Schemas Zod centralizados em `lib/validation.ts`.

### Edge Config
- Leitura: `readValue<T>(key)`
- Escrita: `upsertItems([{ key, value }])`

### Componentes Client/Server
- `page.tsx`: Server component (Edge Runtime)
- `client.tsx`: Client component com interatividade

---

## Conclusão

Todas as decisões técnicas foram tomadas. Não há NEEDS CLARIFICATION restantes.

A implementação pode prosseguir para as tasks definidas em `tasks.md`.
