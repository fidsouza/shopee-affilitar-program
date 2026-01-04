import type { Metadata } from "next";
import { PolicySection } from "@/components/privacy-policy/policy-section";
import type { PolicySection as PolicySectionType } from "@/components/privacy-policy/types";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como coletamos, usamos e protegemos seus dados pessoais. Política de privacidade em conformidade com a LGPD.",
  robots: "index, follow",
  openGraph: {
    title: "Política de Privacidade",
    description: "Política de privacidade e tratamento de dados pessoais",
    type: "website",
  },
};

const LAST_UPDATED = "04 de janeiro de 2026";
const CONTACT_EMAIL = "privacidade@exemplo.com.br";
const COMPANY_NAME = "[Nome da Empresa]";

const sections: PolicySectionType[] = [
  {
    id: "introducao",
    title: "1. Introdução",
    content: (
      <div className="space-y-4">
        <p>
          Bem-vindo à nossa Política de Privacidade. Este documento descreve
          como coletamos, usamos, armazenamos e protegemos seus dados pessoais
          quando você interage conosco através de formulários de contato,
          campanhas de anúncios ou outros meios.
        </p>
        <p>
          Esta política foi elaborada em conformidade com a Lei Geral de
          Proteção de Dados (LGPD - Lei nº 13.709/2018) e tem como objetivo
          garantir a transparência sobre o tratamento de suas informações
          pessoais.
        </p>
        <p>
          Ao fornecer seus dados através de nossos formulários, você declara
          estar ciente e concordar com os termos desta política.
        </p>
      </div>
    ),
  },
  {
    id: "controlador",
    title: "2. Controlador de Dados",
    content: (
      <div className="space-y-4">
        <p>
          O controlador responsável pelo tratamento dos seus dados pessoais é:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Nome:</strong> {COMPANY_NAME}
          </li>
          <li>
            <strong>E-mail para contato:</strong>{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline hover:no-underline"
            >
              {CONTACT_EMAIL}
            </a>
          </li>
        </ul>
        <p>
          O controlador é a pessoa física ou jurídica responsável pelas
          decisões referentes ao tratamento de dados pessoais.
        </p>
      </div>
    ),
  },
  {
    id: "dados-coletados",
    title: "3. Dados Coletados",
    content: (
      <div className="space-y-4">
        <p>
          Coletamos os seguintes dados pessoais através de nossos formulários de
          contato e campanhas de anúncios:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Nome completo:</strong> para identificação e comunicação
            personalizada
          </li>
          <li>
            <strong>Endereço de e-mail:</strong> para envio de comunicações e
            respostas às suas solicitações
          </li>
          <li>
            <strong>Número de telefone:</strong> para contato direto quando
            necessário
          </li>
        </ul>
        <p>
          Estes dados são fornecidos voluntariamente por você ao preencher
          nossos formulários de captação de leads.
        </p>
      </div>
    ),
  },
  {
    id: "finalidade",
    title: "4. Finalidade do Tratamento",
    content: (
      <div className="space-y-4">
        <p>Seus dados pessoais são utilizados para as seguintes finalidades:</p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>Responder às suas solicitações de contato ou informações</li>
          <li>
            Enviar comunicações sobre produtos, serviços ou ofertas que possam
            ser do seu interesse
          </li>
          <li>Melhorar nossos serviços e experiência do usuário</li>
          <li>Cumprir obrigações legais e regulatórias</li>
          <li>
            Estabelecer e manter relacionamento comercial com potenciais
            clientes
          </li>
        </ul>
        <p>
          Não utilizamos seus dados para finalidades diferentes das aqui
          descritas sem seu consentimento prévio.
        </p>
      </div>
    ),
  },
  {
    id: "base-legal",
    title: "5. Base Legal",
    content: (
      <div className="space-y-4">
        <p>
          O tratamento dos seus dados pessoais é realizado com base nas
          seguintes hipóteses legais previstas na LGPD:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Consentimento (Art. 7º, I):</strong> Ao preencher nossos
            formulários, você consente com a coleta e uso dos seus dados para
            as finalidades descritas nesta política.
          </li>
          <li>
            <strong>Legítimo interesse (Art. 7º, IX):</strong> Para atividades
            de marketing direto, respeitando suas expectativas e direitos.
          </li>
          <li>
            <strong>Cumprimento de obrigação legal (Art. 7º, II):</strong>{" "}
            Quando necessário para cumprir exigências legais ou regulatórias.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "compartilhamento",
    title: "6. Compartilhamento de Dados",
    content: (
      <div className="space-y-4">
        <p>
          Seus dados pessoais podem ser compartilhados nas seguintes situações:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Prestadores de serviços:</strong> Empresas que nos auxiliam
            na operação do negócio (ex: plataformas de e-mail marketing, CRM),
            sempre sob contratos que garantem a proteção dos dados.
          </li>
          <li>
            <strong>Plataformas de anúncios:</strong> Meta (Facebook/Instagram)
            para gestão das campanhas de leads, conforme as políticas de
            privacidade dessas plataformas.
          </li>
          <li>
            <strong>Autoridades competentes:</strong> Quando exigido por lei,
            ordem judicial ou regulamentação aplicável.
          </li>
        </ul>
        <p>
          <strong>Importante:</strong> Não vendemos, alugamos ou comercializamos
          seus dados pessoais a terceiros.
        </p>
      </div>
    ),
  },
  {
    id: "retencao",
    title: "7. Retenção de Dados",
    content: (
      <div className="space-y-4">
        <p>
          Seus dados pessoais serão armazenados pelo tempo necessário para
          cumprir as finalidades para as quais foram coletados, incluindo:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Durante o relacionamento comercial:</strong> Enquanto houver
            interesse mútuo na comunicação ou prestação de serviços.
          </li>
          <li>
            <strong>Obrigações legais:</strong> Pelo período exigido por lei
            para cumprimento de obrigações fiscais, contábeis ou regulatórias.
          </li>
          <li>
            <strong>Após término do relacionamento:</strong> Podemos manter seus
            dados por até 5 anos para fins de defesa em eventuais processos
            judiciais.
          </li>
        </ul>
        <p>
          Após o término do período de retenção, seus dados serão eliminados de
          forma segura.
        </p>
      </div>
    ),
  },
  {
    id: "direitos",
    title: "8. Direitos do Titular",
    content: (
      <div className="space-y-4">
        <p>
          De acordo com a LGPD, você possui os seguintes direitos sobre seus
          dados pessoais:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Confirmação e acesso:</strong> Confirmar a existência de
            tratamento e acessar seus dados.
          </li>
          <li>
            <strong>Correção:</strong> Solicitar a correção de dados
            incompletos, inexatos ou desatualizados.
          </li>
          <li>
            <strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar
            quando os dados forem desnecessários ou tratados em desconformidade.
          </li>
          <li>
            <strong>Portabilidade:</strong> Solicitar a transferência dos seus
            dados a outro fornecedor de serviço.
          </li>
          <li>
            <strong>Eliminação:</strong> Solicitar a exclusão dos dados tratados
            com base no seu consentimento.
          </li>
          <li>
            <strong>Revogação do consentimento:</strong> Retirar seu
            consentimento a qualquer momento.
          </li>
          <li>
            <strong>Oposição:</strong> Opor-se ao tratamento quando realizado
            com base em hipótese diferente do consentimento.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "exercicio-direitos",
    title: "9. Como Exercer Seus Direitos",
    content: (
      <div className="space-y-4">
        <p>
          Para exercer qualquer um dos seus direitos previstos na LGPD, você
          pode entrar em contato conosco através do seguinte canal:
        </p>
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="font-medium">Canal de Atendimento ao Titular:</p>
          <p className="mt-2">
            <strong>E-mail:</strong>{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline hover:no-underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
        <p>Ao entrar em contato, por favor informe:</p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>Seu nome completo</li>
          <li>O direito que deseja exercer</li>
          <li>Uma descrição do seu pedido</li>
        </ul>
        <p>
          Responderemos à sua solicitação no prazo de até 15 dias, conforme
          previsto na legislação.
        </p>
      </div>
    ),
  },
  {
    id: "cookies",
    title: "10. Cookies e Tecnologias de Rastreamento",
    content: (
      <div className="space-y-4">
        <p>
          Nosso site pode utilizar cookies e tecnologias similares para melhorar
          sua experiência de navegação. Cookies são pequenos arquivos de texto
          armazenados no seu dispositivo.
        </p>
        <p>Utilizamos os seguintes tipos de cookies:</p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Cookies essenciais:</strong> Necessários para o
            funcionamento básico do site.
          </li>
          <li>
            <strong>Cookies de análise:</strong> Para entender como os
            visitantes interagem com nosso site.
          </li>
          <li>
            <strong>Cookies de marketing:</strong> Para exibir anúncios
            relevantes (incluindo Meta Pixel).
          </li>
        </ul>
        <p>
          Você pode gerenciar suas preferências de cookies através das
          configurações do seu navegador.
        </p>
      </div>
    ),
  },
  {
    id: "atualizacoes",
    title: "11. Atualizações desta Política",
    content: (
      <div className="space-y-4">
        <p>
          Esta Política de Privacidade pode ser atualizada periodicamente para
          refletir mudanças em nossas práticas de tratamento de dados ou
          alterações na legislação aplicável.
        </p>
        <p>
          Quando realizarmos alterações significativas, atualizaremos a data de
          &quot;última atualização&quot; no início deste documento.
        </p>
        <p>
          Recomendamos que você revise esta política periodicamente para se
          manter informado sobre como protegemos seus dados.
        </p>
        <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
          <p className="font-medium">
            Última atualização: {LAST_UPDATED}
          </p>
        </div>
      </div>
    ),
  },
];

const tableOfContents = sections.map((section) => ({
  id: section.id,
  title: section.title,
}));

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 md:px-8 lg:px-12">
      <article className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
            Política de Privacidade
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Última atualização: {LAST_UPDATED}
          </p>
        </header>

        <nav
          aria-label="Índice"
          className="mb-8 rounded-lg border border-border bg-muted/30 p-4 md:p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">Índice</h2>
          <ol className="space-y-2 text-sm md:text-base">
            {tableOfContents.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-8 md:space-y-10">
          {sections.map((section) => (
            <PolicySection key={section.id} section={section} />
          ))}
        </div>

        <footer className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            Em caso de dúvidas sobre esta política, entre em contato pelo e-mail{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline hover:no-underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </footer>
      </article>
    </main>
  );
}
