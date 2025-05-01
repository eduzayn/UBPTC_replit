import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Book, 
  Calendar, 
  Award, 
  Handshake,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { checkPaymentStatus } from "@/lib/asaas";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Fetch payment status
  const { 
    data: paymentStatus, 
    isLoading: isLoadingPayment 
  } = useQuery({
    queryKey: [`/api/payments/status/${user?.id}`],
    enabled: !!user,
  });
  
  // Fetch upcoming events
  const { 
    data: upcomingEvents, 
    isLoading: isLoadingEvents 
  } = useQuery({
    queryKey: ['/api/events/upcoming'],
    enabled: !!user,
  });
  
  // Fetch user's certificates
  const { 
    data: certificates, 
    isLoading: isLoadingCertificates 
  } = useQuery({
    queryKey: ['/api/certificates'],
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo, {user.name}</h1>
        <p className="text-gray-600">
          Acesse os recursos exclusivos da UBPCT e acompanhe suas atividades
        </p>
      </div>
      
      {/* Subscription Status */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Status da Assinatura</CardTitle>
          <CardDescription>
            Informações sobre sua assinatura e pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPayment ? (
            <div className="h-16 flex items-center">
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Status:</span>
                  {paymentStatus?.status === "adimplente" ? (
                    <Badge className="bg-green-500">Adimplente</Badge>
                  ) : (
                    <Badge variant="destructive">Inadimplente</Badge>
                  )}
                </div>
                
                {paymentStatus?.expiryDate && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Válido até:</span>{" "}
                    {new Date(paymentStatus.expiryDate).toLocaleDateString("pt-BR")}
                  </p>
                )}
                
                {paymentStatus?.status !== "adimplente" && (
                  <div className="mt-3 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">
                      Sua assinatura está inadimplente. Regularize o pagamento para 
                      continuar acessando todos os benefícios.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Link href="/payments">
                  <Button variant="outline">Histórico de Pagamentos</Button>
                </Link>
                {paymentStatus?.status !== "adimplente" && (
                  <Link href="/payments/update">
                    <Button className="bg-primary">Regularizar Pagamento</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link href="/credential">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <CreditCard className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-1">Credencial Digital</h3>
                  <p className="text-sm text-gray-600">Sua identificação profissional</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/library">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <Book className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-1">Biblioteca</h3>
                  <p className="text-sm text-gray-600">Acesse nossa biblioteca de ebooks</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/events">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <Calendar className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-1">Eventos</h3>
                  <p className="text-sm text-gray-600">Palestras, supervisões e grupos</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/certificates">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <Award className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-1">Certificados</h3>
                  <p className="text-sm text-gray-600">Seus certificados e conquistas</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Next Events */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Próximos Eventos</h2>
          <Link href="/events">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {isLoadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-primary mb-2">{event.type}</Badge>
                  <CardTitle className="text-base">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <Button variant="link" className="p-0 h-auto mt-3 text-primary">
                      Ver detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">
                Não há eventos programados para os próximos dias.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Certification Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Progresso da Certificação</h2>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {isLoadingCertificates ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : paymentStatus?.status === "adimplente" ? (
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="font-semibold">Status: Progresso Ativo</p>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Continue mantendo sua assinatura em dia para receber seu certificado após 12 meses.
                  {user.graduated 
                    ? " Por ser graduado, você receberá um Certificado de Pós-Graduação em parceria com a Faculdade Dynamus." 
                    : " Você receberá um Certificado de Formação Livre em Psicanálise Clínica e Terapêutica."}
                </p>
                
                {certificates && certificates.length > 0 ? (
                  <div>
                    <h3 className="font-semibold mb-2">Seus Certificados:</h3>
                    <ul className="space-y-2">
                      {certificates.map((cert) => (
                        <li key={cert.id} className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          <span>{cert.type === "formacao_livre" 
                            ? "Certificado de Formação Livre" 
                            : cert.type === "pos_graduacao" 
                              ? "Certificado de Pós-Graduação" 
                              : "Certificado de Evento"}</span>
                          <span className="text-gray-500">(Emitido em {cert.issueDate})</span>
                          <Link href={`/certificates/${cert.id}/download`}>
                            <Button variant="link" className="text-primary p-0 h-auto">Download</Button>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-600 italic">
                    Você ainda não tem certificados emitidos. Continue participando dos eventos e mantenha
                    sua assinatura ativa para receber seu certificado anual.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 mb-1">Status: Progresso Pausado</p>
                  <p className="text-gray-600">
                    Sua assinatura está inadimplente, o que pausou seu progresso para certificação. 
                    Regularize seu pagamento para continuar acumulando tempo para o certificado anual.
                  </p>
                  <Link href="/payments/update">
                    <Button className="mt-4 bg-primary">Regularizar Pagamento</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Benefits */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Convênios e Benefícios</h2>
          <Link href="/benefits">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Handshake className="h-6 w-6 text-primary mr-3" />
              <h3 className="font-semibold text-lg">Benefícios Exclusivos para Associados</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Como associado da UBPCT, você tem acesso a diversos descontos e benefícios em 
              consultas médicas, medicamentos e serviços.
            </p>
            
            <Link href="/benefits">
              <Button className="bg-primary">
                Acessar Benefícios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
