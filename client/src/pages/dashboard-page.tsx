import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  CheckCircle,
  User,
  CreditCard as PaymentIcon,
  FileText,
  BellRing,
  BookOpen
} from "lucide-react";
import { AppShell } from "../components/ui/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Fetch user's recent payments
  const { 
    data: recentPayments, 
    isLoading: isLoadingPayments 
  } = useQuery({
    queryKey: [`/api/payments/user/${user?.id}`],
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo, {user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acesse os recursos exclusivos da UBPCT e acompanhe suas atividades
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Status Card */}
          <Card className={`border-l-4 ${paymentStatus?.status === "adimplente" ? "border-l-green-500" : "border-l-orange-500"}`}>
            <CardContent className="flex flex-row items-center py-6">
              <div className={`p-2 rounded-full mr-4 ${paymentStatus?.status === "adimplente" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                <CreditCard className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status da Assinatura</p>
                <p className="text-2xl font-bold">
                  {isLoadingPayment ? (
                    <span className="animate-pulse bg-gray-200 h-6 w-24 rounded inline-block"></span>
                  ) : (
                    paymentStatus?.status === "adimplente" ? "Adimplente" : "Inadimplente"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Credential Card */}
          <Card>
            <CardContent className="flex flex-row items-center py-6">
              <div className="p-2 rounded-full mr-4 bg-blue-100 text-blue-700">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ocupação</p>
                <p className="text-2xl font-bold truncate max-w-[150px]">{user.occupation}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Events Card */}
          <Card>
            <CardContent className="flex flex-row items-center py-6">
              <div className="p-2 rounded-full mr-4 bg-purple-100 text-purple-700">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Próximos Eventos</p>
                <p className="text-2xl font-bold">
                  {isLoadingEvents ? (
                    <span className="animate-pulse bg-gray-200 h-6 w-12 rounded inline-block"></span>
                  ) : (
                    upcomingEvents?.length || 0
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Certificates Card */}
          <Card>
            <CardContent className="flex flex-row items-center py-6">
              <div className="p-2 rounded-full mr-4 bg-amber-100 text-amber-700">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificados</p>
                <p className="text-2xl font-bold">
                  {isLoadingCertificates ? (
                    <span className="animate-pulse bg-gray-200 h-6 w-12 rounded inline-block"></span>
                  ) : (
                    certificates?.length || 0
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Subscription Status */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              Status da Assinatura
            </CardTitle>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Válido até:</span>{" "}
                      {new Date(paymentStatus.expiryDate).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  
                  {paymentStatus?.status !== "adimplente" && (
                    <div className="mt-3 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">
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
                    <Link href="/payment-required">
                      <Button className="bg-primary">Regularizar Pagamento</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="resources" className="mb-10">
          <TabsList className="mb-4">
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="events">Próximos Eventos</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
          </TabsList>
          
          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/credential">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                        Minha Credencial Digital
                      </CardTitle>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Acesse sua credencial profissional com QR Code para validação online
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                    <span>Identificação virtual personalizada</span>
                  </CardFooter>
                </Card>
              </Link>
              
              <Link href="/library">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        Biblioteca de E-books
                      </CardTitle>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Acesse nossa biblioteca digital com conteúdos exclusivos
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                    <span>Livros, artigos e materiais para estudo</span>
                  </CardFooter>
                </Card>
              </Link>
              
              <Link href="/events">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        Eventos e Supervisões
                      </CardTitle>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Inscreva-se em palestras, supervisões e grupos de estudo
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                    <span>Agenda de atividades e eventos online</span>
                  </CardFooter>
                </Card>
              </Link>
              
              <Link href="/certificates">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2 text-primary" />
                        Meus Certificados
                      </CardTitle>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Acompanhe o progresso do seu ciclo anual e acesse certificados emitidos
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                    <span>Certificados de formação e participação</span>
                  </CardFooter>
                </Card>
              </Link>
              
              <Link href="/benefits">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Handshake className="h-5 w-5 mr-2 text-primary" />
                        Convênios e Benefícios
                      </CardTitle>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Descontos e vantagens exclusivas para associados
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                    <span>Parcerias com empresas e instituições</span>
                  </CardFooter>
                </Card>
              </Link>
              
              <Link href="/profile">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        Meu Perfil
                      </CardTitle>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Atualize seus dados cadastrais e documentos
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                    <span>Gerenciamento de informações pessoais</span>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          </TabsContent>
          
          {/* Events Tab */}
          <TabsContent value="events">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Agenda Semanal</h2>
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
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
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
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      Não há eventos programados para os próximos dias.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Minhas Inscrições</h2>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <Link href="/events">
                    <Button className="bg-primary">
                      Gerenciar minhas inscrições
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Progresso da Certificação</h2>
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
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
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
                                <span className="text-gray-500 dark:text-gray-400">(Emitido em {cert.issueDate})</span>
                                <Link href={`/certificates/${cert.id}/download`}>
                                  <Button variant="link" className="text-primary p-0 h-auto">Download</Button>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 italic">
                          Você ainda não tem certificados emitidos. Continue participando dos eventos e mantenha
                          sua assinatura ativa para receber seu certificado anual.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Status: Progresso Pausado</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Sua assinatura está inadimplente, o que pausou seu progresso para certificação. 
                          Regularize seu pagamento para continuar acumulando tempo para o certificado anual.
                        </p>
                        <Link href="/payment-required">
                          <Button className="mt-4 bg-primary">Regularizar Pagamento</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Certificados de Eventos</h2>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <Link href="/certificates">
                    <Button className="bg-primary">
                      Ver todos os certificados
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Finance Tab */}
          <TabsContent value="finance">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Histórico de Pagamentos</h2>
                <Link href="/payments">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Ver todos
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Últimos Pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPayments ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                            <div>
                              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentPayments && recentPayments.length > 0 ? (
                    <div className="space-y-4">
                      {recentPayments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              payment.status === "pago" 
                                ? "bg-green-100 text-green-700" 
                                : payment.status === "pendente"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}>
                              <PaymentIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {payment.tipoPagamento === "mensal" 
                                  ? "Mensalidade" 
                                  : payment.tipoPagamento === "anual"
                                    ? "Anuidade"
                                    : "Pagamento"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payment.dataPagamento).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              R$ {parseFloat(payment.valor).toFixed(2).replace(".", ",")}
                            </p>
                            <Badge className={
                              payment.status === "pago" 
                                ? "bg-green-500" 
                                : payment.status === "pendente"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }>
                              {payment.status === "pago" 
                                ? "Pago" 
                                : payment.status === "pendente"
                                  ? "Pendente"
                                  : "Cancelado"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                      Nenhum pagamento registrado.
                    </p>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  {paymentStatus?.status !== "adimplente" && (
                    <Link href="/payment-required" className="w-full">
                      <Button className="bg-primary w-full">Regularizar Pagamento</Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Planos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Plano Mensal</span>
                      <Badge variant="outline" className="ml-2">R$ 69,90/mês</Badge>
                    </CardTitle>
                    <CardDescription>
                      Assinatura renovada mensalmente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Acesso a todos os recursos da plataforma</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Credencial digital</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Eventos e supervições</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Biblioteca de e-books</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Plano Anual</CardTitle>
                      <Badge variant="outline" className="ml-2">R$ 699,00/ano</Badge>
                    </div>
                    <CardDescription>
                      Economia de 20% em relação ao plano mensal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Todos os benefícios do plano mensal</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Economia de R$ 139,80 por ano</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Pagamento único anual</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Maior facilidade para obtenção do certificado anual</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
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
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
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
    </AppShell>
  );
}
