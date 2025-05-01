import { Helmet } from "react-helmet";

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade | UBPCT</title>
        <meta name="description" content="Saiba como a União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT) coleta, usa e protege seus dados pessoais." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
        <p className="mb-4">Esta política de privacidade explica como a União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT) coleta, usa e protege seus dados pessoais.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Coleta de Dados</h2>
        <p className="mb-4">Coletamos dados pessoais quando você se cadastra em nosso site, associa-se à UBPCT, participa de eventos, ou interage com nossas plataformas digitais. Estes dados podem incluir nome, e-mail, telefone, CPF, dados profissionais e informações de pagamento.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Uso dos Dados</h2>
        <p className="mb-4">Os dados coletados são utilizados para:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Processar associações e pagamentos;</li>
          <li>Fornecer acesso a conteúdos exclusivos;</li>
          <li>Emitir certificados e credenciais;</li>
          <li>Comunicar sobre eventos e atualizações relevantes;</li>
          <li>Melhorar nossos serviços;</li>
          <li>Cumprir obrigações legais e fiscais.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Proteção de Dados</h2>
        <p className="mb-4">Implementamos medidas de segurança apropriadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados pessoais são tratados de acordo com a Lei Geral de Proteção de Dados (LGPD).</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. Compartilhamento de Dados</h2>
        <p className="mb-4">Podemos compartilhar seus dados com:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Provedores de serviços de processamento de pagamento;</li>
          <li>Empresas parceiras para realização de eventos;</li>
          <li>Autoridades governamentais, quando exigido por lei.</li>
        </ul>
        <p className="mb-4">Não vendemos, trocamos ou transferimos seus dados pessoais para terceiros para fins de marketing.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Cookies e Tecnologias Semelhantes</h2>
        <p className="mb-4">Nosso site utiliza cookies e tecnologias semelhantes para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar o conteúdo. Você pode controlar o uso de cookies ajustando as configurações do seu navegador.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. Retenção de Dados</h2>
        <p className="mb-4">Armazenamos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais foram coletados, incluindo o cumprimento de obrigações legais, contábeis ou de relatórios.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">7. Dados de Menores</h2>
        <p className="mb-4">Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente dados pessoais de menores. Se você acredita que coletamos dados de um menor, entre em contato conosco imediatamente.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">8. Marketing</h2>
        <p className="mb-4">Podemos enviar comunicações sobre nossos serviços, eventos e atualizações. Você pode optar por não receber essas comunicações a qualquer momento através do link de descadastramento presente nos e-mails ou entrando em contato conosco.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">9. Seus Direitos</h2>
        <p className="mb-4">De acordo com a LGPD, você tem os seguintes direitos:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Acesso aos seus dados pessoais;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
          <li>Portabilidade dos dados;</li>
          <li>Eliminação dos dados tratados com seu consentimento;</li>
          <li>Informação sobre entidades públicas e privadas com as quais compartilhamos seus dados;</li>
          <li>Revogação do consentimento.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">10. Alterações na Política de Privacidade</h2>
        <p className="mb-4">Podemos atualizar esta política periodicamente. Recomendamos que você revise esta página regularmente para estar ciente das alterações. Mudanças significativas serão comunicadas através de aviso em nosso site ou por e-mail.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">11. Contato</h2>
        <p className="mb-4">Para exercer seus direitos ou esclarecer dúvidas sobre nossa política de privacidade, entre em contato conosco através do e-mail: <a href="mailto:privacidade@ubpct.com.br" className="text-primary hover:underline">privacidade@ubpct.com.br</a>.</p>
        
        <p className="mt-8 text-gray-600">Última atualização: 01 de Maio de 2025</p>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-center">
            A UBPCT está comprometida com a transparência e a proteção de seus dados pessoais.
          </p>
        </div>
      </div>
    </>
  );
}