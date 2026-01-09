# Quickstart: Configuração de Tamanho do Botão WhatsApp

**Feature**: 017-whatsapp-button-size
**Date**: 2026-01-09

## Objetivo

Permitir que administradores configurem o tamanho do botão principal da página WhatsApp (pequeno, médio, grande) com preview em tempo real.

---

## Setup Rápido

### 1. Verificar Branch
```bash
git checkout 017-whatsapp-button-size
cd frontend
```

### 2. Instalar Dependências
```bash
yarn install
```

### 3. Iniciar Dev Server
```bash
yarn dev
```

### 4. Acessar Admin
```
http://localhost:3000/parametrizacao/whatsapp
```

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/lib/validation.ts` | Adicionar `buttonSize` ao schema |
| `src/lib/repos/whatsapp-pages.ts` | Adicionar campo + migração |
| `src/app/w/[slug]/client.tsx` | Aplicar classes de tamanho |
| `src/app/parametrizacao/whatsapp/page.tsx` | Seletor + preview |

---

## Ordem de Implementação

1. **validation.ts** - Schema primeiro (outros arquivos dependem)
2. **whatsapp-pages.ts** - Tipo e persistência
3. **client.tsx** - Renderização na página pública
4. **page.tsx (admin)** - Interface de configuração

---

## Testes Manuais

### Cenário 1: Configurar Tamanho
1. Acesse `/parametrizacao/whatsapp`
2. Selecione uma página existente ou crie nova
3. Na aba "Geral", localize "Tamanho do Botão"
4. Selecione "Grande"
5. Verifique que o preview atualiza instantaneamente
6. Salve

### Cenário 2: Verificar Página Pública
1. Acesse `/w/{slug}` da página configurada
2. Confirme que o botão aparece com tamanho grande

### Cenário 3: Compatibilidade Retroativa
1. Acesse uma página existente (sem configuração de tamanho)
2. Verifique que o botão aparece com tamanho médio (padrão)

---

## Referência: Tamanhos CSS

```typescript
const BUTTON_SIZE_CLASSES = {
  small: "px-6 py-3 text-base",   // Compacto
  medium: "px-8 py-4 text-lg",    // Padrão (atual)
  large: "px-10 py-5 text-xl",    // Destaque
};
```

---

## Troubleshooting

### Preview não atualiza
- Verifique se o estado `buttonSize` está vinculado ao RadioGroup
- Confirme que o preview usa o mesmo estado

### Tamanho não persiste
- Verifique se `buttonSize` está no payload do POST /api/whatsapp
- Confirme que o schema Zod aceita o campo

### Página existente sem tamanho
- A função `migrateRecord()` deve aplicar default "medium"
- Verifique logs do Edge Config
