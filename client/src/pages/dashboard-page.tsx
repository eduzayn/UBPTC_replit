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
import { MemberShell } from "../components/member/member-shell";
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
    <MemberShell title={`Bem-vindo, ${user.name}`}>
      <div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Acesse os recursos exclusivos da UBPCT e acompanhe suas atividades
        </p>
        
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
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge className="mb-2">{new Date(event.date).toLocaleDateString("pt-BR")}</Badge>
                            {event.certificate_available && (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                Certificado
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(event.date).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center py-6">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum evento programado</h3>
                      <p className="text-muted-foreground mb-4">
                        Não há eventos programados para os próximos dias.
                      </p>
                      <Link href="/events">
                        <Button className="bg-primary">Ver todos os eventos</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Por que participar dos eventos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Os eventos da UBPCT são oportunidades para expandir seu conhecimento, 
                    participar de discussões de casos clínicos e supervisões em grupo.
                    {paymentStatus?.status === "adimplente" ? 
                      " Como associado adimplente, você tem acesso prioritário a todos os eventos." :
                      " Regularize sua associação para ter acesso prioritário."}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/events">
                    <Button className="bg-primary">
                      Gerenciar minhas inscrições
                    </Button>
                  </Link>
                </CardFooter>
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
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        Você está em dia com sua assinatura e seu progresso para certificação anual está sendo registrado.
                        {certificates && certificates.length > 0 ? 
                          ` Você possui ${certificates.length} certificado(s) emitido(s).` : 
                          " Você ainda não possui certificados emitidos."}
                      </p>
                      
                      <Link href="/certificates">
                        <Button className="bg-primary">Ver meus certificados</Button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="font-semibold">Status: Progresso Pausado</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        Sua assinatura está inadimplente. Para continuar acumulando horas para sua certificação anual, 
                        é necessário regularizar seu pagamento.
                      </p>
                      
                      <div className="flex gap-2">
                        <Link href="/certificates">
                          <Button variant="outline">Ver meus certificados</Button>
                        </Link>
                        <Link href="/payment-required">
                          <Button className="bg-primary">Regularizar assinatura</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {certificates && certificates.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Certificados Recentes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.slice(0, 2).map((cert) => (
                      <Card key={cert.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{cert.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            Emitido em {new Date(cert.issuedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm">{cert.description}</p>
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between">
                          <p className="text-xs text-muted-foreground">
                            Carga horária: {cert.hours}h
                          </p>
                          <Link href={`/certificates/${cert.id}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Visualizar
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/certificates">
                      <Button variant="outline">
                        Ver todos os certificados
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Finance Tab */}
          <TabsContent value="finance">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Histórico Financeiro</h2>
              </div>
              
              {isLoadingPayments ? (
                <div className="animate-pulse space-y-4">
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : recentPayments && recentPayments.length > 0 ? (
                <div>
                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Pagamentos Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentPayments.slice(0, 3).map((payment) => (
                          <div key={payment.id} className="flex justify-between items-center pb-2 border-b">
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payment.payment_date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">R$ {payment.amount.toFixed(2)}</p>
                              <Badge 
                                className={
                                  payment.status === "pago" ? 
                                  "bg-green-500" : 
                                  payment.status === "pendente" ? 
                                  "bg-orange-500" : 
                                  "bg-red-500"
                                }
                              >
                                {payment.status === "pago" ? "Pago" : 
                                 payment.status === "pendente" ? "Pendente" : "Cancelado"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Link href="/payments">
                        <Button variant="outline">
                          Ver histórico completo
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Informações da Assinatura</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Plano:</p>
                          <p className="font-medium">{user.plan === "monthly" ? "Mensal" : "Anual"}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Status:</p>
                          <Badge 
                            className={paymentStatus?.status === "adimplente" ? "bg-green-500" : "bg-red-500"}
                          >
                            {paymentStatus?.status === "adimplente" ? "Adimplente" : "Inadimplente"}
                          </Badge>
                        </div>
                        {paymentStatus?.expiryDate && (
                          <div className="flex justify-between">
                            <p className="text-muted-foreground">Próximo vencimento:</p>
                            <p className="font-medium">{new Date(paymentStatus.expiryDate).toLocaleDateString("pt-BR")}</p>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Valor:</p>
                          <p className="font-medium">
                            {user.plan === "monthly" ? "R$ 69,90/mês" : "R$ 699,00/ano"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
                        <Link href="/payments/methods">
                          <Button variant="outline">
                            Formas de pagamento
                          </Button>
                        </Link>
                        {paymentStatus?.status !== "adimplente" && (
                          <Link href="/payment-required">
                            <Button className="bg-primary">
                              Regularizar pagamento
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center py-6">
                      <PaymentIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum histórico disponível</h3>
                      <p className="text-muted-foreground mb-4">
                        Não há registros de pagamentos em seu histórico.
                      </p>
                      <Link href="/payment-required">
                        <Button className="bg-primary">
                          Gerenciar Pagamentos
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MemberShell>
  );
}