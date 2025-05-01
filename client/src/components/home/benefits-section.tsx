import {
  CreditCard,
  Award,
  BookOpen,
  Users,
  Handshake,
  MonitorSmartphone
} from "lucide-react";

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
      <div className="text-primary mb-4 text-4xl">
        {icon}
      </div>
      <h3 className="font-montserrat font-semibold text-xl mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <CreditCard />,
      title: "Credencial Digital",
      description: "Credencial profissional digital com QR Code para validação, comprovando sua filiação à UBPCT."
    },
    {
      icon: <Award />,
      title: "Certificado Anual",
      description: "Certificado de formação livre ou pós-graduação em parceria com a Faculdade Dynamus após 12 meses."
    },
    {
      icon: <BookOpen />,
      title: "Biblioteca de Ebooks",
      description: "Acesso exclusivo à biblioteca digital com ebooks especializados em psicanálise e terapias."
    },
    {
      icon: <Users />,
      title: "Supervisão Clínica",
      description: "Encontros semanais de supervisão clínica com profissionais experientes e qualificados."
    },
    {
      icon: <Handshake />,
      title: "Convênios e Descontos",
      description: "Descontos exclusivos em consultas médicas, medicamentos e serviços de parceiros."
    },
    {
      icon: <MonitorSmartphone />,
      title: "Eventos Virtuais",
      description: "Participação em palestras, workshops e grupos de estudo online com certificação."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl text-secondary mb-4">
            Benefícios para Associados
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Faça parte da UBPCT e tenha acesso a todos estes benefícios exclusivos para o seu desenvolvimento profissional.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
