# Data Model: Página de Política de Privacidade para Lead Ads

**Feature**: 008-privacy-policy
**Date**: 2026-01-04

## Visão Geral

Esta feature não requer persistência de dados. O conteúdo da política de privacidade é estático e definido diretamente no código-fonte.

## Entidades Conceituais

Embora não haja persistência, as seguintes estruturas conceituais são usadas para organizar o conteúdo:

### 1. PolicySection

Representa uma seção da política de privacidade.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string | Identificador único da seção (slug para âncora) |
| title | string | Título da seção (ex: "Dados Coletados") |
| content | ReactNode | Conteúdo da seção (texto, listas, etc.) |
| order | number | Ordem de exibição na página |

### 2. ContactInfo

Informações de contato do controlador de dados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| name | string | Nome do responsável/empresa |
| email | string | Email para contato |
| cnpj | string? | CNPJ (opcional, se pessoa jurídica) |

### 3. PolicyMetadata

Metadados da política.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| lastUpdated | Date | Data da última atualização |
| version | string | Versão da política (opcional) |
| language | string | Idioma (pt-BR) |

## Estrutura de Seções Obrigatórias

A política deve conter as seguintes seções, na ordem sugerida:

1. **Introdução** - Apresentação e escopo da política
2. **Controlador de Dados** - Identificação do responsável
3. **Dados Coletados** - Lista de dados pessoais tratados
4. **Finalidade do Tratamento** - Para que os dados são usados
5. **Base Legal** - Fundamento jurídico (consentimento)
6. **Compartilhamento de Dados** - Com quem os dados são compartilhados
7. **Retenção de Dados** - Período de armazenamento
8. **Direitos do Titular** - Direitos garantidos pela LGPD
9. **Exercício de Direitos** - Como solicitar acesso, correção, exclusão
10. **Cookies** - Informações sobre cookies (se aplicável)
11. **Atualizações da Política** - Como mudanças são comunicadas

## Relacionamentos

```text
PolicyPage
├── PolicyMetadata (1:1)
├── ContactInfo (1:1)
└── PolicySection[] (1:N)
```

## Validações

| Regra | Descrição |
|-------|-----------|
| Seções obrigatórias | Todas as 11 seções devem estar presentes |
| Data de atualização | Deve ser exibida de forma visível |
| Email de contato | Deve ser um email válido |
| Conteúdo em pt-BR | Todo o texto deve estar em português brasileiro |

## Notas de Implementação

- O conteúdo é hardcoded como constantes TypeScript
- Não há necessidade de banco de dados ou Edge Config
- As seções podem ser componentizadas para melhor manutenibilidade
- A data de atualização pode ser definida como constante e atualizada manualmente quando houver mudanças
