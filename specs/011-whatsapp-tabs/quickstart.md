# Quickstart: Abas de Gatilhos e Pixel para WhatsApp

**Feature**: 011-whatsapp-tabs
**Date**: 2026-01-05

## Objetivo

Reorganizar o formulário de páginas WhatsApp em três abas para melhorar a experiência do administrador.

## Pré-requisitos

- Node.js 20+
- Yarn
- Ambiente de desenvolvimento configurado (`yarn dev`)

## Arquivo a Modificar

```
frontend/src/app/parametrizacao/whatsapp/page.tsx
```

## Mudanças Necessárias

### 1. Adicionar TabsTrigger para novas abas

Na linha ~455, adicionar os triggers:

```tsx
<TabsList>
  <TabsTrigger value="geral">Geral</TabsTrigger>
  <TabsTrigger value="gatilhos">Gatilhos</TabsTrigger>
  <TabsTrigger value="pixel">Pixel</TabsTrigger>
</TabsList>
```

### 2. Criar TabsContent para "gatilhos"

Mover as seções de Benefit Cards (linhas ~624-778) e Social Proof (linhas ~780-818) para dentro de um novo TabsContent:

```tsx
<TabsContent value="gatilhos" className="space-y-4 mt-4">
  {/* Benefit Cards Section */}
  <div className="grid gap-4 rounded-md border bg-accent/30 p-4">
    {/* ... conteúdo existente de Benefit Cards ... */}
  </div>

  {/* Social Proof Notifications Section */}
  <div className="grid gap-4 rounded-md border bg-accent/30 p-4">
    {/* ... conteúdo existente de Social Proof ... */}
  </div>
</TabsContent>
```

### 3. Criar TabsContent para "pixel"

Mover os campos de Pixel/eventos (linhas ~522-585) para dentro de um novo TabsContent:

```tsx
<TabsContent value="pixel" className="space-y-4 mt-4">
  {/* Pixel selection + Redirect Event */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {/* ... dropdown de pixel ... */}
    {/* ... dropdown de evento de redirect ... */}
  </div>

  {/* Events on load checkboxes */}
  <div className="grid gap-2">
    {/* ... checkboxes de eventos ao carregar ... */}
  </div>

  {/* Redirect delay */}
  <div className="grid gap-2">
    {/* ... input de tempo de redirect ... */}
  </div>
</TabsContent>
```

### 4. Manter fora das abas

Os seguintes elementos devem permanecer **fora** do componente `<Tabs>`:
- Campo de Status (ativo/inativo)
- Mensagens de erro/sucesso
- Botões de submit (Criar/Atualizar + Cancelar)

## Verificação

1. Executar `yarn dev`
2. Acessar `/parametrizacao/whatsapp`
3. Verificar que as três abas aparecem: "Geral", "Gatilhos", "Pixel"
4. Verificar que alternar entre abas preserva os dados preenchidos
5. Verificar que criar/editar páginas funciona normalmente
6. Verificar responsividade em telas menores

## Não Fazer

- Não alterar o modelo de dados (FormState, WhatsAppPageRecord)
- Não alterar a lógica de submit (handleSubmit)
- Não alterar a API
- Não adicionar novas dependências
