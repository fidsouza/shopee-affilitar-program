# Research: Página de Política de Privacidade para Lead Ads

**Feature**: 008-privacy-policy
**Date**: 2026-01-04

## Sumário de Pesquisa

Este documento consolida as decisões técnicas e de conteúdo para a página de política de privacidade destinada a campanhas de lead ads no Meta (Facebook/Instagram).

---

## 1. Requisitos do Meta para Lead Ads

### Decisão
A política de privacidade deve estar hospedada em URL pública, acessível e deve claramente informar quais dados são coletados e como serão utilizados.

### Racional
O Meta exige que formulários de lead ads tenham um link para política de privacidade válida que:
- Esteja acessível publicamente (sem login)
- Explique claramente os dados coletados
- Informe o uso pretendido dos dados
- Seja compatível com dispositivos móveis
- Esteja no mesmo idioma do formulário

### Alternativas Consideradas
- Usar um gerador automático de política de privacidade → Rejeitado: conteúdo genérico demais, não atende requisitos específicos do negócio
- Hospedar em domínio externo → Rejeitado: melhor manter no mesmo domínio para consistência e confiança

---

## 2. Conformidade com LGPD

### Decisão
Seguir a estrutura de política de privacidade recomendada pela LGPD (Lei 13.709/2018), incluindo todas as seções obrigatórias.

### Racional
A LGPD brasileira exige que a política de privacidade contenha:
1. **Identificação do controlador**: Nome, CNPJ (se aplicável), contato
2. **Dados coletados**: Lista específica dos dados pessoais tratados
3. **Finalidade**: Para que os dados serão usados
4. **Base legal**: Justificativa legal para o tratamento (consentimento)
5. **Compartilhamento**: Com quem os dados podem ser compartilhados
6. **Retenção**: Por quanto tempo os dados serão mantidos
7. **Direitos do titular**: Lista dos direitos (acesso, correção, exclusão, portabilidade)
8. **Exercício de direitos**: Como o titular pode exercer seus direitos
9. **Cookies**: Informações sobre uso de cookies (se aplicável)
10. **Atualização**: Data da última atualização

### Alternativas Consideradas
- Política simplificada → Rejeitado: não atende requisitos legais da LGPD
- Múltiplas políticas por região → Rejeitado: público-alvo é brasileiro, uma política suficiente

---

## 3. Estrutura Técnica da Página

### Decisão
Criar página estática usando Next.js App Router com Server Component (RSC) para melhor SEO e performance.

### Racional
- Server Components são ideais para conteúdo estático
- Melhor indexação por SEO
- Carregamento mais rápido
- Sem necessidade de JavaScript no cliente para renderização inicial

### Alternativas Consideradas
- Client Component → Rejeitado: não há interatividade que justifique
- Markdown + MDX → Rejeitado: complexidade adicional desnecessária para uma única página
- Página HTML estática separada → Rejeitado: perde benefícios do framework e consistência visual

---

## 4. Design e Layout

### Decisão
Layout simples, mobile-first, com tipografia legível e estrutura clara de seções com heading hierarchy (h1, h2, h3).

### Racional
- Maioria dos acessos via Facebook/Instagram são mobile
- Leitura facilitada com seções bem definidas
- Acessibilidade garantida com estrutura semântica HTML
- Consistência visual com o restante do site usando Tailwind CSS

### Alternativas Consideradas
- Layout com sidebar de navegação → Rejeitado: over-engineering para uma página relativamente curta
- Acordeão (collapse/expand) → Rejeitado: pode esconder conteúdo importante, pior para SEO

---

## 5. URL da Página

### Decisão
Usar `/politica-de-privacidade` como URL da página.

### Racional
- URL em português para consistência com o público-alvo
- Sem caracteres especiais ou acentos (acessibilidade de URL)
- Fácil de lembrar e digitar
- Comum e reconhecível

### Alternativas Consideradas
- `/privacy-policy` → Considerado: pode ser usado como alias opcional no futuro
- `/privacidade` → Rejeitado: muito curto, menos descritivo
- `/termos/privacidade` → Rejeitado: estrutura de URL mais complexa sem necessidade

---

## 6. Dados Coletados via Lead Ads

### Decisão
Documentar os campos típicos de formulários de lead do Meta: nome, email, telefone.

### Racional
- Campos padrão do formulário instantâneo do Meta
- Suficientes para contato comercial
- Dados mínimos necessários para o propósito

### Alternativas Consideradas
- Incluir campos adicionais (CPF, endereço) → Rejeitado: não fazem parte do escopo atual
- Campos genéricos → Rejeitado: política deve ser específica sobre os dados coletados

---

## 7. Período de Retenção de Dados

### Decisão
Dados serão retidos enquanto durar o relacionamento comercial ou conforme exigência legal.

### Racional
- Padrão razoável da indústria
- Flexível para diferentes situações legais
- Permite exclusão quando solicitado pelo titular

### Alternativas Consideradas
- Prazo fixo (ex: 5 anos) → Rejeitado: muito rígido, pode não atender necessidades legais
- Indefinido → Rejeitado: não conforme com princípios LGPD de minimização

---

## 8. Canal de Contato para Direitos

### Decisão
Fornecer email de contato para exercício de direitos do titular.

### Racional
- Canal simples e acessível
- Permite rastreamento de solicitações
- Padrão da indústria

### Alternativas Consideradas
- Formulário web → Considerado para futuro, mas adiciona complexidade desnecessária agora
- WhatsApp → Rejeitado: menos formal para questões legais
- Telefone apenas → Rejeitado: não deixa registro escrito

---

## Conclusão

Todas as decisões técnicas e de conteúdo foram tomadas. Não há NEEDS CLARIFICATION restantes. A implementação pode prosseguir para Phase 1.
