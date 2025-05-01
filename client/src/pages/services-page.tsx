import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Award, Shield, Globe, Users } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: <BookOpen className="h-14 w-14 text-primary" />,
      title: "Biblioteca Digital",
      description: "Acesso a uma vasta coleção de ebooks, artigos científicos e materiais didáticos sobre psicanálise e psicoterapia, atualizados regularmente."
    },
    {
      icon: <Calendar className="h-14 w-14 text-primary" />,
      title: "Eventos e Formações",
      description: "Participação em simpósios, workshops, cursos e supervisões clínicas conduzidas por profissionais renomados na área."
    },
    {
      icon: <Award className="h-14 w-14 text-primary" />,
      title: "Certificação Anual",
      description: "Emissão de certificados de formação livre ou pós-graduação após 12 meses de associação, reconhecidos em todo território nacional."
    },
    {
      icon: <Shield className="h-14 w-14 text-primary" />,
      title: "Credencial Profissional",
      description: "Credencial digital com QR code para validação, que atesta sua formação e vínculo com a UBPCT, trazendo credibilidade para sua prática."
    },
    {
      icon: <Globe className="h-14 w-14 text-primary" />,
      title: "Rede de Convênios",
      description: "Parcerias com instituições, livrarias, plataformas de ensino e estabelecimentos, com descontos e condições especiais para associados."
    },
    {
      icon: <Users className="h-14 w-14 text-primary" />,
      title: "Comunidade Profissional",
      description: "Integração com uma comunidade de milhares de profissionais, facilitando networking, parcerias e trocas de experiências clínicas."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Serviços | UBPCT</title>
        <meta name="description" content="Conheça os serviços oferecidos pela União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT) para associados." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma ampla gama de serviços e benefícios para associados, 
            todos pensados para impulsionar seu desenvolvimento profissional e sua prática clínica.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {service.icon}
                  </div>
                  <h2 className="text-2xl font-semibold mb-3">{service.title}</h2>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-primary/10 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center">Como Funcionam Nossos Serviços</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Associação e Mensalidade</h3>
              <p className="mb-4">
                Ao se associar, você escolhe entre o plano mensal ou anual e preenche um formulário com seus dados pessoais e profissionais.
                Após a confirmação do pagamento, você terá acesso imediato à plataforma e todos os benefícios de associado.
              </p>
              <p className="mb-4">
                A renovação de sua associação é automática, e você receberá notificações antes de cada renovação, podendo cancelar a qualquer momento.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Credencial e Certificados</h3>
              <p className="mb-4">
                Logo após a confirmação de sua associação, sua credencial digital será gerada automaticamente e ficará disponível na plataforma.
                Ela contém um QR code que pode ser validado online, confirmando sua associação à UBPCT.
              </p>
              <p className="mb-4">
                Após 12 meses de associação ativa, você receberá seu certificado anual, que pode ser de formação livre ou pós-graduação, 
                dependendo de sua formação anterior.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-6">Planos de Associação</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold">
                Popular
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Plano Mensal</h3>
                <p className="text-4xl font-bold mb-4">R$ 79,90<span className="text-sm font-normal text-gray-500">/mês</span></p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Acesso à biblioteca digital
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Credencial profissional
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Participação em eventos
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Rede de convênios
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Certificado anual
                  </li>
                </ul>
                <a href="/#associe-se" className="block w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg text-center">
                  Associe-se Agora
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-primary">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Plano Anual</h3>
                <p className="text-4xl font-bold mb-4">R$ 799,00<span className="text-sm font-normal text-gray-500">/ano</span></p>
                <p className="text-green-500 font-semibold mb-4">Economize R$ 159,80 (2 meses grátis)</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Acesso à biblioteca digital
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Credencial profissional
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Participação em eventos
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Rede de convênios
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Certificado anual
                  </li>
                </ul>
                <a href="/#associe-se" className="block w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg text-center">
                  Obter Desconto Anual
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tire suas dúvidas sobre nossos serviços e como eles podem beneficiar sua carreira e prática clínica.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-2">É necessário ter formação acadêmica para se associar?</h3>
              <p className="text-gray-600">
                Não, aceitamos associados com ou sem formação acadêmica. A UBPCT é aberta a todos os interessados em 
                psicanálise e psicoterapia, independentemente de sua formação anterior.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Os certificados têm validade legal?</h3>
              <p className="text-gray-600">
                Sim, nossos certificados são reconhecidos como formação livre ou pós-graduação (para graduados), 
                conforme a legislação brasileira sobre cursos livres e especializações.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Posso cancelar minha associação a qualquer momento?</h3>
              <p className="text-gray-600">
                Sim, você pode cancelar sua associação quando desejar. No plano mensal, o cancelamento vale para o próximo período. 
                No plano anual, seguimos a política de reembolso proporcional ao tempo restante.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Como funciona a validação da credencial digital?</h3>
              <p className="text-gray-600">
                A credencial possui um QR code que, quando escaneado, direciona para uma página em nosso site que confirma 
                sua associação, dados profissionais e validade da credencial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}