import { Helmet } from "react-helmet";

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Termos de Uso | UBPCT</title>
        <meta name="description" content="Termos e condições para o uso do site e serviços da União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT)." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
        <p className="mb-4">Este documento contém os termos e condições para o uso do site e serviços da União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT).</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Aceitação dos Termos</h2>
        <p className="mb-4">Ao acessar e utilizar nosso site e serviços, você confirma que leu, entendeu e concorda com estes termos de uso. Se você não concordar com estes termos, por favor, não utilize nosso site ou serviços.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Cadastro e Associação</h2>
        <p className="mb-4">Para se associar à UBPCT, é necessário fornecer informações corretas e atualizadas. Você é responsável por manter a confidencialidade de seus dados de login e por todas as atividades realizadas em sua conta.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Pagamentos e Mensalidades</h2>
        <p className="mb-4">As mensalidades e pagamentos relacionados à associação devem ser efetuados conforme o plano escolhido. A não efetivação do pagamento pode resultar na suspensão temporária ou permanente do acesso aos benefícios exclusivos para associados.</p>
        <p className="mb-4">Consulte nossa política de reembolso para mais informações sobre cancelamentos e estornos.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. Credencial e Certificados</h2>
        <p className="mb-4">A credencial digital emitida pela UBPCT é um documento de identificação profissional e não substitui diplomas ou registros emitidos por órgãos oficiais. Os certificados de formação livre ou pós-graduação são emitidos conforme legislação vigente sobre cursos livres e especializações.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Uso de Conteúdo</h2>
        <p className="mb-4">Todo o conteúdo disponível na plataforma, incluindo textos, imagens, vídeos e materiais de estudo, está protegido por direitos autorais. O uso não autorizado deste conteúdo para fins comerciais ou de redistribuição é estritamente proibido.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. Conduta do Usuário</h2>
        <p className="mb-4">Ao utilizar nossos serviços, você concorda em não:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Violar leis ou regulamentos locais, estaduais, nacionais ou internacionais aplicáveis;</li>
          <li>Usar linguagem ofensiva, discriminatória ou inadequada;</li>
          <li>Compartilhar material protegido por direitos autorais sem autorização;</li>
          <li>Promover atividades ilegais ou antiéticas;</li>
          <li>Interferir na segurança ou funcionalidade da plataforma;</li>
          <li>Coletar informações pessoais de outros usuários sem consentimento;</li>
          <li>Criar contas falsas ou enganosas.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">7. Alterações nos Termos</h2>
        <p className="mb-4">A UBPCT reserva-se o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site. Recomendamos que você revise periodicamente nossos termos de uso.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">8. Rescisão</h2>
        <p className="mb-4">A UBPCT pode, a seu critério exclusivo, suspender ou encerrar seu acesso a todos ou parte dos serviços, com ou sem aviso prévio, por qualquer motivo, incluindo, mas não limitado a, violação destes Termos de Uso.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">9. Limitação de Responsabilidade</h2>
        <p className="mb-4">A UBPCT não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar nossos serviços, ou por qualquer conteúdo obtido de ou através do site.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">10. Lei Aplicável</h2>
        <p className="mb-4">Estes termos serão regidos e interpretados de acordo com as leis do Brasil, independentemente dos conflitos de disposições legais.</p>
        
        <p className="mt-8 text-gray-600">Última atualização: 01 de Maio de 2025</p>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-center">
            Para quaisquer dúvidas relacionadas aos nossos termos de uso, entre em contato através do e-mail: <a href="mailto:contato@ubpct.com.br" className="text-primary hover:underline">contato@ubpct.com.br</a>
          </p>
        </div>
      </div>
    </>
  );
}