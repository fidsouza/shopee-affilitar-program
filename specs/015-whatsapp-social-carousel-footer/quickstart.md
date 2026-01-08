# Quickstart: WhatsApp Social Proof Carousel & Custom Footer

**Feature**: 015-whatsapp-social-carousel-footer
**Date**: 2026-01-07

## Overview

Esta feature adiciona um carrossel de provas sociais (texto ou imagem) e footer personalizado às páginas de WhatsApp (`/w/[slug]`).

## Prerequisites

- Node.js 20+
- Yarn
- Acesso ao Vercel Edge Config configurado

## Setup

```bash
cd frontend
yarn install
yarn dev
```

## Implementation Checklist

### 1. Data Layer (lib/)

- [ ] `lib/validation.ts`: Adicionar schemas Zod
  - `socialProofTextItemSchema`
  - `socialProofImageItemSchema`
  - `socialProofItemSchema` (discriminated union)
  - Estender `whatsAppPageSchema` com novos campos

- [ ] `lib/repos/whatsapp-pages.ts`: Estender tipos
  - Atualizar `WhatsAppPageRecord`
  - Atualizar `LegacyWhatsAppPageRecord`
  - Atualizar `migrateRecord()` function
  - Atualizar `upsertWhatsAppPage()` function

### 2. Components (components/)

- [ ] `components/social-proof-carousel.tsx`: Novo componente
  - Props: `items: SocialProofItem[]`, `autoPlay: boolean`, `interval: number`
  - Estado: `currentIndex`, `isPaused`
  - Navegação: botões prev/next, dots indicators
  - Touch: swipe support via touch events
  - Auto-play: `useEffect` com `setInterval`
  - Renderização condicional: texto vs imagem

- [ ] `components/page-footer.tsx`: Novo componente
  - Props: `text: string | null`
  - Renderização condicional: só mostra se text não é null/vazio
  - Suporte a multiline via `whitespace-pre-wrap`

### 3. Public Page (app/w/[slug]/)

- [ ] `app/w/[slug]/client.tsx`: Integrar componentes
  - Importar `SocialProofCarousel` e `PageFooter`
  - Substituir seção `socialProofs` existente pelo carrossel
  - Adicionar footer como último elemento

- [ ] `app/w/[slug]/page.tsx`: Passar novos campos
  - Garantir que novos campos são passados ao client component

### 4. Admin Panel (app/parametrizacao/whatsapp/)

- [ ] `app/parametrizacao/whatsapp/page.tsx`: Nova seção
  - Adicionar aba/seção "Provas Sociais" ou integrar em "Gatilhos"
  - Lista de provas com preview (tipo, conteúdo truncado)
  - Formulário de criação: toggle texto/imagem
  - Campos condicionais baseados no tipo
  - Botões de reordenação (▲/▼)
  - Toggle auto-play + campo intervalo
  - Campo de footer com contador de caracteres
  - Preview do carrossel em tempo real

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `lib/validation.ts` | MODIFY | Add Zod schemas |
| `lib/repos/whatsapp-pages.ts` | MODIFY | Extend types, update migration |
| `components/social-proof-carousel.tsx` | CREATE | Carousel component |
| `components/page-footer.tsx` | CREATE | Footer component |
| `app/w/[slug]/client.tsx` | MODIFY | Integrate new components |
| `app/w/[slug]/page.tsx` | MODIFY | Pass new props |
| `app/parametrizacao/whatsapp/page.tsx` | MODIFY | Add admin controls |

## Testing

```bash
# Lint check
yarn lint

# Manual testing
1. Criar página WhatsApp no admin
2. Adicionar provas sociais (texto e imagem)
3. Configurar auto-play e footer
4. Acessar página pública /w/[slug]
5. Verificar carrossel funciona (navegação, swipe, auto-play)
6. Verificar footer aparece
7. Testar edge cases (0 provas, 1 prova, 10 provas)
```

## Key Implementation Notes

### Carousel Behavior

```typescript
// Auto-play pausa ao interagir
const handleInteraction = () => {
  setIsPaused(true);
  // Resume após 3s
  setTimeout(() => setIsPaused(false), 3000);
};

// Loop infinito
const nextSlide = () => {
  setCurrentIndex((prev) => (prev + 1) % items.length);
};
```

### Touch Swipe Detection

```typescript
const touchStartX = useRef(0);

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
};

const handleTouchEnd = (e: TouchEvent) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX.current;
  if (Math.abs(deltaX) > 50) {
    deltaX > 0 ? prevSlide() : nextSlide();
  }
};
```

### Conditional Rendering

```tsx
{item.type === 'text' ? (
  <TextProofCard item={item} />
) : (
  <ImageProofCard item={item} />
)}
```

## Migration Notes

- Campo `socialProofs` (array de strings) permanece para backward compatibility
- Se `socialProofCarouselItems` tem items, o carrossel é exibido
- Se `socialProofCarouselItems` está vazio, usa `socialProofs` (comportamento legado)
- `footerText` é null por padrão, não afeta páginas existentes

## Dependencies

Nenhuma nova dependência. Usa apenas:
- React hooks nativos
- Tailwind CSS
- Zod (já instalado)
- lucide-react (já instalado, para ícones)
