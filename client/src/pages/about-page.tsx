import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Users, GraduationCap, Building, Globe } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
  const missionVision = [
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Missão",
      description: "Promover a excelência no campo da psicanálise clínica e terapêutica, fornecendo formação de qualidade, suporte profissional contínuo e reconhecimento aos profissionais comprometidos com o crescimento ético da profissão."
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Visão",
      description: "Ser reconhecida como a principal referência nacional em psicanálise clínica e terapêutica, estabelecendo padrões de excelência na formação, pesquisa e prática profissional."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Valores",
      description: "Ética, Rigor científico, Humanismo, Compromisso social, Inovação, Pluralidade teórica e Desenvolvimento contínuo."
    }
  ];

  const historyTimeline = [
    {
      year: "2015",
      title: "Fundação",
      description: "A UBPCT foi fundada por um grupo de psicanalistas e psicoterapeutas comprometidos com o desenvolvimento da profissão no Brasil."
    },
    {
      year: "2017",
      title: "Expansão Nacional",
      description: "Expansão para todo o território nacional, com associados em todos os estados brasileiros."
    },
    {
      year: "2019",
      title: "Biblioteca Digital",
      description: "Lançamento da biblioteca digital com acesso a materiais exclusivos para membros."
    },
    {
      year: "2021",
      title: "Certificação Digital",
      description: "Implementação do sistema de credenciais e certificados digitais com validação por QR code."
    },
    {
      year: "2023",
      title: "Plataforma de Eventos",
      description: "Lançamento da plataforma de eventos online, ampliando o alcance das formações e supervisões."
    },
    {
      year: "2025",
      title: "Transformação Digital",
      description: "Modernização completa dos sistemas digitais, com nova plataforma integrada para gestão de associados."
    }
  ];

  const achievements = [
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      stat: "5.000+",
      title: "Profissionais associados",
      description: "De todas as regiões do Brasil"
    },
    {
      icon: <Building className="h-8 w-8 text-primary" />,
      stat: "200+",
      title: "Eventos realizados",
      description: "Presenciais e online"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      stat: "150+",
      title: "Publicações exclusivas",
      description: "Na biblioteca digital"
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      stat: "27",
      title: "Estados brasileiros",
      description: "Com membros ativos"
    }
  ];

  const team = [
    {
      name: "Dr. Carlos Mendes",
      role: "Presidente",
      bio: "Psicanalista com mais de 25 anos de experiência, formado pela USP com especializações internacionais."
    },
    {
      name: "Dra. Ana Paula Santos",
      role: "Vice-presidente",
      bio: "Psicoterapeuta e educadora, especialista em formação de profissionais e ética aplicada."
    },
    {
      name: "Dr. Roberto Fernandes",
      role: "Diretor Científico",
      bio: "Pesquisador com diversos artigos publicados em revistas internacionais sobre psicanálise contemporânea."
    },
    {
      name: "Dra. Juliana Costa",
      role: "Diretora de Eventos",
      bio: "Especialista em organização de congressos e formações continuadas na área de saúde mental."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sobre Nós | UBPCT</title>
        <meta name="description" content="Conheça a União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT), nossa história, missão, valores e equipe." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Sobre a UBPCT</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A União Brasileira de Psicanálise Clínica e Terapêutica é uma associação profissional dedicada 
            ao desenvolvimento, reconhecimento e valorização dos profissionais da saúde mental no Brasil.
          </p>
        </div>
        
        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {missionVision.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h2 className="text-2xl font-semibold mb-3">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* History Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Nossa História</h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            
            <div className="space-y-12">
              {historyTimeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-5/12 px-4"></div>
                  
                  <div className="w-2/12 flex justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold z-10">
                      {item.year}
                    </div>
                  </div>
                  
                  <div className="w-5/12 px-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-gray-50 rounded-xl p-10 mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Nossos Números</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">{item.stat}</h3>
                <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Nossa Equipe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-gray-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-primary/10 rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Junte-se a Nós</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Faça parte da maior comunidade de profissionais de psicanálise clínica e terapêutica do Brasil. 
            Obtenha reconhecimento, acesso a conteúdos exclusivos e oportunidades de desenvolvimento profissional.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/auth">
              <Button className="bg-primary hover:bg-primary/90">
                Torne-se um Associado
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Entre em Contato
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}