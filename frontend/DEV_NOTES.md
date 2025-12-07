# Dev Notes: Stop-and-Ask Protocol + MCP Usage

## Quando pausar e perguntar
- Sempre que houver dúvida sobre requisito, fluxo de dados, eventos Meta, validação de URL ou configurações de Edge Config/Edge Storage, **pare a execução** antes de implementar.
- Liste claramente a dúvida e o ponto do código afetado. Não siga adiante sem confirmação.
- Se uma API externa (Meta CAPI, Edge Config REST) tiver parâmetros incertos, pare e confirme.

## Como pesquisar (MCP obrigatório)
1. Tente primeiro nos artefatos locais (specs, plan, tasks).
2. Em seguida use MCP:
   - **Perplexity MCP** para pesquisas gerais e eventos padrão do Meta Pixel/CAPI.
   - **Context7 MCP** para documentação de libs (Next.js, Vite, shadcn/ui, Edge Config).
3. Resuma achados e vincule a tarefa antes de codificar.

## Fluxo recomendado
- Verifique tasks.md para dependências.
- Se dúvida surgir, abra pergunta ao time/usuário e documente no PR/commit.
- Só continue após resposta clara ou decisão registrada.

## Observabilidade mínima
- Use `src/lib/logging.ts` para logs estruturados (info/warn/error) em rotas edge/admin.
- Registre falhas de fetch (Edge Config, CAPI) e tempos de resposta quando possível.
