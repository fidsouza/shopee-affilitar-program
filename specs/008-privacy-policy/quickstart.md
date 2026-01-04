# Quickstart: Página de Política de Privacidade

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
