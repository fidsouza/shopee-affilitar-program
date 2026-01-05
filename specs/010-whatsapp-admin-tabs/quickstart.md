# Quickstart: WhatsApp Admin Tabs Organization

**Feature**: 010-whatsapp-admin-tabs
**Date**: 2026-01-04

## Prerequisites

- Node.js 20+
- Yarn
- Ambiente de desenvolvimento configurado

## Setup Steps

### 1. Install Dependencies

```bash
cd frontend
yarn add @radix-ui/react-tabs
```

### 2. Add shadcn/ui Tabs Component

Criar arquivo `frontend/src/components/ui/tabs.tsx`:

```typescript
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

### 3. Modify WhatsApp Admin Page

Editar `frontend/src/app/parametrizacao/whatsapp/page.tsx`:

1. Importar componente Tabs
2. Envolver os 5 campos (Headline, URL Foto, Provas Sociais, Texto Botão, URL WhatsApp) com `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>`
3. Manter demais seções fora do componente Tabs

## Verification

```bash
# Rodar linting
yarn lint

# Iniciar servidor de desenvolvimento
yarn dev

# Acessar página
open http://localhost:3000/parametrizacao/whatsapp
```

### Expected Behavior

1. Aba "Geral" visível e selecionada por padrão
2. Campos Headline, URL Foto, Provas Sociais, Texto Botão, URL WhatsApp dentro da aba
3. Seções Pixel/Eventos, Benefit Cards, Prova Social abaixo da aba (inalteradas)
4. Formulário funciona normalmente (criar, editar, salvar)

## Files Modified

| File | Action |
|------|--------|
| `frontend/src/components/ui/tabs.tsx` | CREATE |
| `frontend/src/app/parametrizacao/whatsapp/page.tsx` | MODIFY |
| `frontend/package.json` | MODIFY (new dependency) |

## Rollback

Se necessário reverter:

```bash
git checkout main -- frontend/src/app/parametrizacao/whatsapp/page.tsx
rm frontend/src/components/ui/tabs.tsx
yarn remove @radix-ui/react-tabs
```
