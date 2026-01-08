# Research: WhatsApp Social Proof Carousel & Custom Footer

**Feature**: 015-whatsapp-social-carousel-footer
**Date**: 2026-01-07
**Status**: Complete

## Research Tasks

### 1. Carousel Implementation Approach

**Decision**: Implementar carrossel customizado com CSS/JS nativo + Tailwind + React hooks

**Rationale**:
- O projeto não possui bibliotecas de carrossel instaladas
- A funcionalidade é relativamente simples (navegação linear, loop, auto-play)
- Evita adicionar dependências externas para manter bundle size pequeno
- Controle total sobre comportamento e animações
- Suporte a swipe via touch events nativos

**Alternatives Considered**:
- **embla-carousel-react**: Biblioteca leve e moderna, mas adiciona ~10KB ao bundle
- **swiper**: Feature-rich mas overkill para este caso de uso (~50KB)
- **react-slick**: Dependência de jQuery, não recomendado para projetos modernos

**Implementation Details**:
- Usar `useState` para controlar slide atual
- Touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) para swipe
- `useEffect` com `setInterval` para auto-play
- CSS transitions para animações suaves
- Indicadores de posição (dots) clicáveis

### 2. Data Model Extension Strategy

**Decision**: Estender `WhatsAppPageRecord` com novos campos, criar tipo `SocialProofItem` discriminado

**Rationale**:
- Segue padrão existente do projeto (extensão progressiva de tipos)
- Backward compatibility via migration function (padrão já usado no codebase)
- Zod discriminated unions para validação de tipo texto vs imagem

**Alternatives Considered**:
- **Entidade separada**: Criar `social_proofs_index` + `social_proofs_{id}` separadamente
  - Rejeitado: Aumenta complexidade sem benefício claro para max 10 items
- **Array de strings como existente**: Usar formato similar ao `socialProofs` atual
  - Rejeitado: Não suporta estrutura rica (imagem vs texto com campos)

**Implementation Details**:
```typescript
// Discriminated union para SocialProofItem
type SocialProofTextItem = {
  id: string;
  type: 'text';
  description: string;  // 1-500 chars
  author: string;       // 1-100 chars
  city: string;         // 1-100 chars
};

type SocialProofImageItem = {
  id: string;
  type: 'image';
  imageUrl: string;     // HTTPS URL
};

type SocialProofItem = SocialProofTextItem | SocialProofImageItem;
```

### 3. Admin Interface Pattern

**Decision**: Adicionar nova seção/aba no painel admin existente seguindo padrão de Tabs do Radix UI

**Rationale**:
- O admin já usa Tabs do Radix UI para organizar seções
- Consistência visual e UX com features existentes (Gatilhos, Pixel, etc.)
- Reutilizar componentes de formulário existentes

**Alternatives Considered**:
- **Modal para edição**: Popup para criar/editar provas sociais
  - Rejeitado: Inconsistente com padrão atual (inline editing)
- **Página separada**: Nova rota `/parametrizacao/whatsapp/provas-sociais`
  - Rejeitado: Fragmenta a experiência do admin, dificulta fluxo

**Implementation Details**:
- Nova aba "Provas Sociais" ou seção dentro de aba existente "Gatilhos"
- Lista de provas com preview (ícone de tipo, texto truncado ou thumbnail)
- Botões de ação: Adicionar, Editar, Excluir, Reordenar
- Toggle para tipo (Texto/Imagem) no formulário de criação
- Preview do carrossel em tempo real (similar ao preview de Benefit Cards)

### 4. Drag-and-Drop for Reordering

**Decision**: Usar reordenação simples com botões Up/Down (sem drag-and-drop inicialmente)

**Rationale**:
- O projeto não tem biblioteca de drag-and-drop instalada
- Benefit Cards usa ordenação por índice no array (sem DnD visual)
- Simplicidade inicial, pode ser aprimorado depois
- Lista máxima de 10 items não justifica complexidade de DnD

**Alternatives Considered**:
- **@dnd-kit/core**: Biblioteca moderna e acessível para DnD
  - Considerado para versão futura se houver demanda
- **react-beautiful-dnd**: Deprecated, não recomendado
- **HTML5 Drag and Drop**: API nativa, mas experiência inconsistente em mobile

**Implementation Details**:
- Botões "▲" e "▼" em cada item da lista
- Função `moveItem(fromIndex, toIndex)` no state local
- Persiste ordem no array ao salvar página

### 5. Footer Component Strategy

**Decision**: Componente simples com renderização condicional e suporte a multiline

**Rationale**:
- Requisito simples: texto opcional no rodapé
- Não requer lógica complexa, apenas estilização
- Suporte a quebras de linha via `whitespace-pre-wrap`

**Implementation Details**:
```tsx
// Renderização condicional
{page.footerText && (
  <footer className="mt-8 text-center text-sm text-gray-500 whitespace-pre-wrap">
    {page.footerText}
  </footer>
)}
```

### 6. Image Error Handling

**Decision**: Usar `onError` handler com placeholder visual

**Rationale**:
- Padrão comum em React para tratamento de erros de imagem
- UX clara quando imagem falha ao carregar
- Não bloqueia renderização do carrossel

**Implementation Details**:
```tsx
const [imgError, setImgError] = useState(false);

{imgError ? (
  <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
    <ImageOff className="text-gray-400 w-12 h-12" />
    <span className="text-gray-500 text-sm">Imagem indisponível</span>
  </div>
) : (
  <img
    src={item.imageUrl}
    onError={() => setImgError(true)}
    alt="Prova social"
    className="max-w-full h-auto rounded-lg"
  />
)}
```

### 7. Carousel Position in Page Layout

**Decision**: Posicionar carrossel ANTES do CTA button, substituindo a seção `socialProofs` existente

**Rationale**:
- Provas sociais devem ser vistas ANTES da ação principal (aumenta conversão)
- Substitui funcionalidade existente (array de strings) por versão mais rica
- Mantém fluxo visual: Header → Headline → Provas Sociais → CTA → Countdown

**Alternatives Considered**:
- **Após benefit cards**: Muito baixo na página, pode não ser visto
- **Em paralelo com socialProofs existente**: Confuso, duas seções similares
- **Modal/overlay**: Interrompe fluxo, má UX

**Migration Strategy**:
- Campo `socialProofs` (array de strings) permanece para backward compatibility
- Novo campo `socialProofCarouselItems` tem prioridade se preenchido
- Se ambos existem, renderiza apenas o carrossel (novo)

### 8. Auto-play Behavior

**Decision**: Desabilitado por padrão, configurável entre 3-15 segundos

**Rationale**:
- Conforme spec: não distrair do CTA principal
- Usuários podem habilitar se desejarem
- Intervalo razoável para leitura de depoimentos

**Implementation Details**:
- `carouselAutoPlay: boolean` (default: false)
- `carouselInterval: number` (default: 5, range: 3-15)
- Auto-play pausa quando usuário interage (hover/touch)
- Resume após 3 segundos sem interação

## Resolved Clarifications

| Item | Resolução |
|------|-----------|
| Posição do carrossel | Antes do CTA, substituindo socialProofs |
| Footer posição | Último elemento, após todos os componentes |
| Biblioteca de carrossel | Implementação customizada (sem dependência) |
| Reordenação | Botões Up/Down (sem drag-and-drop visual) |
| Migration socialProofs | Campo antigo permanece, novo tem prioridade |

## Next Steps

1. Criar `data-model.md` com tipos TypeScript e schemas Zod
2. Implementar componentes `SocialProofCarousel` e `PageFooter`
3. Estender `WhatsAppPageRecord` e migration function
4. Atualizar painel admin com nova seção
5. Integrar no `client.tsx` da página `/w/[slug]`
