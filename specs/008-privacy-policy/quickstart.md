# Quickstart: Política de Privacidade + Personalização WhatsApp

**Feature**: 008-privacy-policy
**Date**: 2026-01-04

## Pré-requisitos

- Node.js 20+
- Yarn
- Repositório clonado e branch `008-privacy-policy` checked out

## Setup

```bash
# Navegar para o diretório frontend
cd frontend

# Instalar dependências (se ainda não instaladas)
yarn install

# Iniciar servidor de desenvolvimento
yarn dev
```

## Verificação

Após iniciar o servidor, acesse:

```
http://localhost:3000/politica-de-privacidade
```

A página deve:
- Carregar sem erros
- Exibir todas as 11 seções obrigatórias
- Ser responsiva (testar em diferentes tamanhos de tela)
- Exibir a data da última atualização

## Estrutura de Arquivos

```text
frontend/src/
├── app/
│   └── politica-de-privacidade/
│       └── page.tsx          # Página principal da política
└── components/
    └── privacy-policy/       # (opcional) Componentes auxiliares
        └── policy-section.tsx
```

## Testando Responsividade

1. Abra as DevTools do navegador (F12)
2. Ative o modo responsivo (Ctrl+Shift+M ou Cmd+Shift+M)
3. Teste nos seguintes breakpoints:
   - 320px (mobile pequeno)
   - 375px (iPhone)
   - 768px (tablet)
   - 1024px (desktop)

## Checklist de Verificação

- [ ] Página carrega em `/politica-de-privacidade`
- [ ] Todas as 11 seções estão presentes:
  - [ ] Introdução
  - [ ] Controlador de Dados
  - [ ] Dados Coletados
  - [ ] Finalidade do Tratamento
  - [ ] Base Legal
  - [ ] Compartilhamento de Dados
  - [ ] Retenção de Dados
  - [ ] Direitos do Titular
  - [ ] Exercício de Direitos
  - [ ] Cookies
  - [ ] Atualizações da Política
- [ ] Data de atualização visível
- [ ] Email de contato presente
- [ ] Responsivo em 320px+
- [ ] Texto legível (tamanho, contraste)
- [ ] Estrutura semântica correta (h1, h2, h3)

## Comandos Úteis

```bash
# Lint do código
yarn lint

# Build de produção
yarn build

# Iniciar em modo produção
yarn start
```

## Troubleshooting

### Página não encontrada (404)

- Verificar se o arquivo `page.tsx` está em `src/app/politica-de-privacidade/`
- Verificar se o nome da pasta está correto (sem acentos)
- Reiniciar o servidor de desenvolvimento

### Estilos não aplicados

- Verificar se Tailwind CSS está configurado
- Limpar cache: `rm -rf .next && yarn dev`

### Erros de TypeScript

- Executar `yarn lint` para verificar erros
- Verificar importações de componentes

---

# Parte 2: Personalização Visual das Páginas WhatsApp

## Verificação da Feature

### 1. Admin: Configurar Aparência

1. Acesse: `http://localhost:3000/parametrizacao/whatsapp`
2. Localize a seção "Aparência" (no topo da página)
3. Configure:
   - **Texto de Redirecionamento**: ex: "Aguarde, estamos te levando..."
   - **Cor de Fundo**: selecione uma cor ou digite hex (#f0fdf4)
   - **Habilitar Borda**: toggle on/off
4. Clique em "Salvar"

### 2. Página Pública: Verificar Mudanças

1. Crie ou use uma página WhatsApp existente
2. Acesse: `http://localhost:3000/w/[slug-da-pagina]`
3. Verifique:
   - O texto personalizado é exibido
   - A cor de fundo é aplicada
   - A borda aparece (se habilitada)

## Estrutura de Arquivos (Personalização)

```text
frontend/src/
├── app/
│   ├── parametrizacao/
│   │   └── whatsapp/
│   │       └── page.tsx       # Adicionar seção de Aparência
│   ├── w/[slug]/
│   │   ├── page.tsx           # Carregar config de aparência
│   │   └── client.tsx         # Aplicar estilos personalizados
│   └── api/
│       └── whatsapp/
│           └── appearance/
│               └── route.ts   # GET/PUT endpoint
└── lib/
    ├── repos/
    │   └── whatsapp-appearance.ts  # Repository
    └── validation.ts               # Schema Zod
```

## Checklist de Verificação (Personalização)

### Admin (/parametrizacao/whatsapp)
- [ ] Seção "Aparência" visível
- [ ] Campo de texto para "Texto de Redirecionamento"
- [ ] Color picker para cor de fundo
- [ ] Toggle para habilitar borda
- [ ] Botão "Salvar" funciona
- [ ] Mensagem de sucesso após salvar
- [ ] Valores carregam corretamente ao reabrir página

### Página Pública (/w/[slug])
- [ ] Texto personalizado exibido (não mais "Redirecionando...")
- [ ] Cor de fundo aplicada corretamente
- [ ] Borda cinza (#e5e7eb) quando habilitada
- [ ] Fallback para padrões quando config não existe

### API (/api/whatsapp/appearance)
- [ ] GET retorna config atual ou padrões
- [ ] PUT atualiza config corretamente
- [ ] Validação de formato hex funciona
- [ ] Validação de texto vazio funciona

## Testando via cURL

```bash
# GET - Obter configuração atual
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

## Troubleshooting (Personalização)

### Configuração não salva

- Verificar se `EDGE_CONFIG_REST_API_URL` e `EDGE_CONFIG_REST_TOKEN` estão configurados
- Verificar logs de erro no console do servidor

### Estilos não aplicam na página /w/

- Verificar se a configuração foi salva (GET no endpoint)
- Limpar cache: `rm -rf .next && yarn dev`
- Verificar se o client component está recebendo a prop `appearance`

### Cor de fundo inválida

- Formato deve ser `#RRGGBB` (6 caracteres após #)
- Exemplos válidos: `#ffffff`, `#f0fdf4`, `#10b981`
