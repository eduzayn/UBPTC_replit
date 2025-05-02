import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, BookOpen, Calendar, Globe, Shield, Headphones } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { getPaymentLink } from "@/lib/asaas";

export default function ServicesPage() {
  const { user } = useAuth();
  
  const services = [
    {
      icon: <Award className="h-10 w-10 mb-3 text-primary" />,
      title: "Credencial Digital",
      description: "Credencial digital personalizada com QR Code para validação online, que comprova sua associação à UBPCT e garante sua habilitação profissional conforme as normas da associação.",
      link: user ? "/credential" : "/auth?redirect=/credential",
      linkText: user ? "Acessar Credencial" : "Obter Credencial",
    },
    {
      icon: <BookOpen className="h-10 w-10 mb-3 text-primary" />,
      title: "Biblioteca Digital",
      description: "Acesso exclusivo à nossa biblioteca digital com e-books, artigos científicos e materiais didáticos sobre psicanálise clínica e técnicas terapêuticas relevantes para a prática profissional.",
      link: user ? "/library" : "/auth?redirect=/library",
      linkText: user ? "Acessar Biblioteca" : "Conhecer Biblioteca",
    },
    {
      icon: <Calendar className="h-10 w-10 mb-3 text-primary" />,
      title: "Eventos e Formações",
      description: "Participação em eventos exclusivos, supervisões, grupos de estudo e formações continuadas com certificação, ministrados por profissionais reconhecidos na área.",
      link: "/events-public",
      linkText: "Ver Próximos Eventos",
    },
    {
      icon: <Shield className="h-10 w-10 mb-3 text-primary" />,
      title: "Respaldo Profissional",
      description: "Respaldo profissional e institucional para sua atuação como psicoterapeuta ou psicanalista, conforme os princípios éticos e técnicos da UBPCT.",
      link: "/about",
      linkText: "Conhecer a Associação",
    },
    {
      icon: <Globe className="h-10 w-10 mb-3 text-primary" />,
      title: "Rede de Profissionais",
      description: "Integração à rede de profissionais associados, facilitando a troca de experiências, parceria em projetos e indicações profissionais.",
      link: user ? "/dashboard" : "/auth",
      linkText: user ? "Acessar Rede" : "Associar-se",
    },
    {
      icon: <Headphones className="h-10 w-10 mb-3 text-primary" />,
      title: "Suporte Contínuo",
      description: "Suporte contínuo via e-mail, telefone e WhatsApp para esclarecimento de dúvidas técnicas e auxílio com documentação profissional.",
      link: "/contact",
      linkText: "Entrar em Contato",
    }
  ];
  
  const benefits = [
    "Maior visibilidade e credibilidade no mercado",
    "Atualização constante através de formações e materiais exclusivos",
    "Certificação reconhecida para atividades e formações",
    "Respaldo institucional para sua atuação profissional",
    "Pertencimento a uma comunidade de profissionais da área",
    "Acesso a convênios e parcerias com descontos exclusivos",
    "Oportunidades de networking e crescimento profissional"
  ];
  
  return (
    <>
      <Helmet>
        <title>Serviços | UBPCT</title>
        <meta name="description" content="Conheça os serviços oferecidos pela União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT) para profissionais da área." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A União Brasileira de Psicanálise Clínica e Terapêutica oferece um conjunto de serviços exclusivos para apoiar e valorizar profissionais da área.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex flex-col items-center text-center mb-6">
                  {service.icon}
                  <h2 className="text-2xl font-semibold mb-2">{service.title}</h2>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">
                  {service.description}
                </p>
                <div className="mt-auto">
                  <Link href={service.link}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      {service.linkText}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-primary/5 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">Benefícios para Associados</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-primary mr-2">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            {!user && (
              <div className="mt-8">
                <a href={getPaymentLink("monthly")} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90">
                    Associe-se Agora
                  </Button>
                </a>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-3xl font-semibold mb-6">Planos de Associação</h2>
            <div className="grid gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">Plano Mensal</h3>
                      <p className="text-gray-600">Pagamento recorrente mensal</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">R$ 49,90</div>
                      <span className="text-gray-500">/mês</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Acesso a todos os benefícios
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Cancelamento a qualquer momento
                    </li>
                  </ul>
                  {!user && (
                    <a href={getPaymentLink("monthly")} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Assinar Plano Mensal
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-primary hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">MELHOR VALOR</div>
                      <h3 className="text-2xl font-bold">Plano Anual</h3>
                      <p className="text-gray-600">Pagamento único anual</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">R$ 498,00</div>
                      <span className="text-gray-500">R$ 41,50/mês</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Acesso a todos os benefícios
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <strong>Economize 17%</strong> (2 meses grátis)
                    </li>
                  </ul>
                  {!user && (
                    <a href={getPaymentLink("annual")} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Assinar Plano Anual
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/10 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-semibold mb-4">Precisa de mais informações?</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Entre em contato conosco para esclarecer dúvidas específicas sobre nossos serviços ou processo de associação.
          </p>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90">
              Falar com um Atendente
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}