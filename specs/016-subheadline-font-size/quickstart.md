# Quickstart: Subheadline Text with Font Size Control

**Feature**: 016-subheadline-font-size
**Date**: 2026-01-08

## Overview

Esta feature corrige o texto "Provas Sociais" que não aparece na página de redirecionamento, renomeia o campo para "Subheadline" e adiciona controle de tamanho de fonte.

## Files to Modify

### 1. `frontend/src/lib/validation.ts`

**Purpose**: Adicionar campo `subheadlineFontSize` ao schema.

**Changes**:
- Adicionar `subheadlineFontSize: emojiSizeSchema.default("medium")` ao `whatsAppPageSchema`

### 2. `frontend/src/lib/repos/whatsapp-pages.ts`

**Purpose**: Atualizar tipos e função de migração.

**Changes**:
- Adicionar `subheadlineFontSize: EmojiSize` ao `WhatsAppPageRecord`
- Adicionar `subheadlineFontSize?: EmojiSize` ao `LegacyWhatsAppPageRecord`
- Atualizar `migrateRecord()` para incluir default do novo campo

### 3. `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Purpose**: Atualizar formulário admin.

**Changes**:
- Alterar label de "Provas Sociais (uma por linha)" para "Subheadline"
- Adicionar seletor de tamanho de fonte (pequeno/médio/grande)
- Adicionar state para `subheadlineFontSize`
- Incluir `subheadlineFontSize` no payload de submit

### 4. `frontend/src/app/w/[slug]/client.tsx`

**Purpose**: Corrigir renderização do subheadline.

**Changes**:
- Remover condição que oculta `socialProofs` quando carrossel existe
- Aplicar classes de tamanho de fonte baseado em `subheadlineFontSize`
- Manter posição entre headline e botão CTA

## Font Size Mapping

| Value  | Mobile Classes | Desktop Classes (sm:) |
|--------|----------------|----------------------|
| small  | text-xs        | text-sm              |
| medium | text-sm        | text-base            |
| large  | text-base      | text-lg              |

## Testing Steps

1. Acessar `/parametrizacao/whatsapp`
2. Criar ou editar uma página WhatsApp
3. Na aba "Geral", verificar que o campo agora se chama "Subheadline"
4. Inserir texto multilinha no campo
5. Selecionar cada tamanho de fonte e verificar preview/página final
6. Salvar e acessar `/w/[slug]` para confirmar exibição
7. Testar com e sem itens no carrossel de provas sociais
8. Verificar responsividade em mobile e desktop

## Dependencies

- Nenhuma nova dependência
- Reutiliza `emojiSizeSchema` existente
- Reutiliza campo `socialProofs` existente para armazenamento
