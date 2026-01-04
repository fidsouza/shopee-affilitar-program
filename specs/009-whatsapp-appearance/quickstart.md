# Quickstart: Personalização Visual das Páginas de WhatsApp

**Feature**: 009-whatsapp-appearance
**Date**: 2026-01-04

## Pré-requisitos

- Node.js 20+
- Yarn
- Repositório clonado e branch `009-whatsapp-appearance` checked out
- Variáveis de ambiente configuradas (EDGE_CONFIG_*)

## Setup

```bash
# Navegar para o diretório frontend
cd frontend

# Instalar dependências (se ainda não instaladas)
yarn install

# Iniciar servidor de desenvolvimento
yarn dev
```

## Verificação Rápida

### 1. Testar API

```bash
# GET - Deve retornar valores padrão (ou config atual)
curl http://localhost:3000/api/whatsapp/appearance

# PUT - Atualizar configuração
curl -X PUT http://localhost:3000/api/whatsapp/appearance \
  -H "Content-Type: application/json" \
  -d '{
    "redirectText": "Aguarde um momento...",
    "backgroundColor": "#f0fdf4",
    "borderEnabled": true
  }'
```

### 2. Testar Admin UI

1. Acesse: `http://localhost:3000/parametrizacao/whatsapp`
2. Localize a seção "Aparência"
3. Configure os campos e salve

### 3. Testar Página Pública

1. Use uma página WhatsApp existente ou crie uma
2. Acesse: `http://localhost:3000/w/[slug-da-pagina]`
3. Verifique se o texto e estilos personalizados aparecem

---

## Estrutura de Arquivos

```text
frontend/src/
├── app/
│   ├── parametrizacao/
│   │   └── whatsapp/
│   │       └── page.tsx       # Admin - seção de Aparência
│   ├── w/[slug]/
│   │   ├── page.tsx           # Server - carrega config
│   │   └── client.tsx         # Client - aplica estilos
│   └── api/
│       └── whatsapp/
│           └── appearance/
│               └── route.ts   # API GET/PUT
└── lib/
    ├── repos/
    │   └── whatsapp-appearance.ts  # Repository
    └── validation.ts               # Schema Zod
```

---

## Checklist de Verificação

### API (/api/whatsapp/appearance)

- [ ] GET retorna configuração atual ou valores padrão
- [ ] PUT atualiza configuração corretamente
- [ ] PUT valida formato hexadecimal (#RRGGBB)
- [ ] PUT rejeita texto vazio
- [ ] Response inclui `updatedAt`

### Admin (/parametrizacao/whatsapp)

- [ ] Seção "Aparência" visível no topo da página
- [ ] Campo de texto para "Texto de Redirecionamento"
- [ ] Color picker para cor de fundo
- [ ] Toggle para habilitar/desabilitar borda
- [ ] Botão "Salvar" funciona
- [ ] Mensagem de sucesso após salvar
- [ ] Valores carregam corretamente ao reabrir página
- [ ] Mensagem de erro quando validação falha

### Página Pública (/w/[slug])

- [ ] Texto personalizado exibido corretamente
- [ ] Cor de fundo aplicada (se configurada)
- [ ] Borda cinza (#e5e7eb) quando habilitada
- [ ] Sem borda quando desabilitada
- [ ] Fallback para "Redirecionando..." quando config não existe
- [ ] Página carrega em < 2 segundos

---

## Valores Padrão

Quando nenhuma configuração existe:

| Campo | Valor Padrão |
|-------|--------------|
| redirectText | "Redirecionando..." |
| backgroundColor | (transparente) |
| borderEnabled | false |

Quando borda habilitada:

| Propriedade | Valor |
|-------------|-------|
| Cor | #e5e7eb |
| Espessura | 1px |
| Raio | 8px (rounded-lg) |

---

## Comandos Úteis

```bash
# Lint do código
yarn lint

# Build de produção
yarn build

# Iniciar em modo produção
yarn start
```

---

## Troubleshooting

### Configuração não salva

- Verificar se `EDGE_CONFIG_REST_API_URL` e `EDGE_CONFIG_REST_TOKEN` estão configurados no `.env.local`
- Verificar logs de erro no console do servidor
- Testar API diretamente via curl

### Estilos não aplicam na página /w/

- Verificar se a configuração foi salva (GET no endpoint)
- Limpar cache: `rm -rf .next && yarn dev`
- Verificar se o server component está passando a prop `appearance`
- Verificar se o client component está recebendo e aplicando

### Cor de fundo inválida

- Formato deve ser `#RRGGBB` (6 caracteres após #)
- Exemplos válidos: `#ffffff`, `#f0fdf4`, `#10b981`
- String vazia é aceita (significa transparente)

### Texto de redirecionamento vazio

- O campo é obrigatório (mínimo 1 caractere)
- Máximo 100 caracteres

### Seção de Aparência não aparece no admin

- Verificar se o componente foi adicionado em `/parametrizacao/whatsapp/page.tsx`
- Verificar erros no console do navegador
- Reiniciar servidor de desenvolvimento
