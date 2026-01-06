# Data Model: Toggle de Redirect com Eventos Separados

**Feature**: 013-redirect-toggle
**Date**: 2026-01-06

## Entity Changes

### WhatsAppPage (atualização)

Adiciona dois novos campos à entidade existente:

| Campo | Tipo | Obrigatório | Default | Descrição |
|-------|------|-------------|---------|-----------|
| redirectEnabled | boolean | Sim | true | Controla se o redirect automático está habilitado |
| buttonEvent | MetaEvent | Não | undefined | Evento disparado no clique do botão; se undefined, usa redirectEvent |

### Campos Existentes Relacionados (referência)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| redirectDelay | number (1-30) | Tempo em segundos para redirect automático |
| redirectEvent | MetaEvent | Evento disparado no redirect automático |
| events | MetaEvent[] | Eventos disparados no carregamento da página |

## Validation Rules

### redirectEnabled
- Tipo: boolean
- Default: true (backward compatibility)
- Não requer validação adicional

### buttonEvent
- Tipo: MetaEvent (enum dos eventos padrão do Meta Pixel)
- Valores permitidos: PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Purchase, AddPaymentInfo, CompleteRegistration
- Opcional: quando não definido, herda o valor de `redirectEvent`

## State Transitions

### Página com Redirect Habilitado (redirectEnabled: true)
```
[Carregamento] → Dispara events[]
     ↓
[Countdown ativo] → Exibe contagem regressiva e barra de progresso
     ↓
[Countdown = 0] → Dispara redirectEvent → Navega para whatsappUrl

[Clique no botão] → Dispara buttonEvent (ou redirectEvent se undefined) → Navega para whatsappUrl
```

### Página com Redirect Desabilitado (redirectEnabled: false)
```
[Carregamento] → Dispara events[]
     ↓
[Countdown desativado] → NÃO exibe contagem regressiva nem barra de progresso
     ↓
[Aguarda interação do usuário]

[Clique no botão] → Dispara buttonEvent (ou redirectEvent se undefined) → Navega para whatsappUrl
```

## Migration Strategy

### Legacy Records (sem novos campos)
Registros existentes sem `redirectEnabled` ou `buttonEvent` serão migrados automaticamente:

```typescript
// Na função migrateRecord()
migrated.redirectEnabled = record.redirectEnabled ?? true;
migrated.buttonEvent = record.buttonEvent; // undefined = usa redirectEvent
```

### Comportamento Esperado
- Páginas existentes: Mantêm comportamento atual (redirect habilitado, mesmo evento para botão e redirect)
- Páginas novas: Valores default preservam comportamento atual; admin pode customizar
