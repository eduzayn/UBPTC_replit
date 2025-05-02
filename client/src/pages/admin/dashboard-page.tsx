import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Book, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Award,
  Info,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  // Dados dos associados
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
  });

  // Dados dos eventos
  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ["/api/events"],
    retry: false,
  });

  // Dados de pagamentos
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["/api/payments"],
    retry: false,
  });

  // Dados de e-books
  const { data: ebooks = [], isLoading: isLoadingEbooks } = useQuery({
    queryKey: ["/api/ebooks"],
    retry: false,
  });

  // Métricas calculadas
  const activeMembers = Array.isArray(members) ? members.filter((member: any) => member.subscription_status === "active").length : 0;
  const totalMembers = Array.isArray(members) ? members.length : 0;
  
  const upcomingEvents = Array.isArray(events) ? events.filter((event: any) => {
    const eventDate = new Date(event.event_date);
    return eventDate > new Date();
  }).length : 0;
  
  const totalRevenue = Array.isArray(payments) 
    ? payments.reduce((sum: number, payment: any) => {
        if (payment.status === "paid") {
          const amount = typeof payment.amount === 'string' 
            ? parseFloat(payment.amount.replace('R$', '').replace(',', '.')) 
            : payment.amount;
          return sum + amount;
        }
        return sum;
      }, 0)
    : 0;
  
  const pendingPayments = Array.isArray(payments) 
    ? payments.filter((payment: any) => payment.status === "pending").length
    : 0;
  
  // Pega os últimos associados
  const recentMembers = Array.isArray(members)
    ? [...members]
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    : [];
  
  // Pega os próximos eventos
  const nextEvents = Array.isArray(events)
    ? [...events]
        .filter((event: any) => new Date(event.event_date) > new Date())
        .sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        .slice(0, 5)
    : [];

  return (
    <AdminShell title="Painel de Controle">
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Associados Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeMembers}/{totalMembers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((activeMembers / totalMembers) * 100)}% de atividade
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eventos Programados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Eventos nos próximos 30 dias
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalRevenue.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingPayments} pagamentos pendentes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">E-books Publicados</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(ebooks) ? ebooks.length : 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Material disponível na biblioteca
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="members">Associados</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="payments">Finanças</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Associados Recentes</CardTitle>
                  <CardDescription>Últimos 5 associados cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentMembers.length > 0 ? (
                    <div className="space-y-4">
                      {recentMembers.map((member: any) => (
                        <div key={member.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          <Badge variant={member.subscription_status === "active" ? "default" : "outline"}>
                            {member.subscription_status === "active" ? "Ativo" : "Pendente"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Nenhum associado cadastrado recentemente
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Eventos</CardTitle>
                  <CardDescription>Eventos agendados para os próximos dias</CardDescription>
                </CardHeader>
                <CardContent>
                  {nextEvents.length > 0 ? (
                    <div className="space-y-4">
                      {nextEvents.map((event: any) => (
                        <div key={event.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(event.event_date)} às {event.start_time}
                              </p>
                            </div>
                          </div>
                          <Badge>
                            {event.type === "palestra" ? "Palestra" : 
                             event.type === "supervisao" ? "Supervisão" : "Grupo de Estudo"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Nenhum evento programado para os próximos dias
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Alertas e Notificações</CardTitle>
                <CardDescription>Informações importantes do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPayments > 0 && (
                    <div className="flex items-start gap-3 border rounded-lg p-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Pagamentos Pendentes</h4>
                        <p className="text-xs text-muted-foreground">
                          Existem {pendingPayments} pagamentos pendentes que precisam de atenção.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {(totalMembers - activeMembers) > 0 && (
                    <div className="flex items-start gap-3 border rounded-lg p-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Associados Inativos</h4>
                        <p className="text-xs text-muted-foreground">
                          {totalMembers - activeMembers} associados estão inativos e podem precisar de contato.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {upcomingEvents > 0 && (
                    <div className="flex items-start gap-3 border rounded-lg p-3">
                      <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Eventos Próximos</h4>
                        <p className="text-xs text-muted-foreground">
                          {upcomingEvents} eventos serão realizados em breve. Verifique os preparativos.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Associados</CardTitle>
                <CardDescription>
                  Gerencie todos os associados da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Ocupação</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data de Registro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(members) && members.slice(0, 10).map((member: any) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.occupation}</TableCell>
                          <TableCell>
                            <Badge variant={member.subscription_status === "active" ? "default" : "outline"}>
                              {member.subscription_status === "active" ? "Ativo" : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(member.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Eventos</CardTitle>
                <CardDescription>
                  Histórico e agenda de eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(events) && events.slice(0, 10).map((event: any) => {
                        const isPast = new Date(event.event_date) < new Date();
                        return (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>
                              {event.type === "palestra" ? "Palestra" : 
                               event.type === "supervisao" ? "Supervisão" : "Grupo de Estudo"}
                            </TableCell>
                            <TableCell>{formatDate(event.event_date)}</TableCell>
                            <TableCell>{event.start_time} - {event.end_time}</TableCell>
                            <TableCell>
                              <Badge variant={isPast ? "outline" : "default"}>
                                {isPast ? "Realizado" : "Agendado"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Histórico Financeiro</CardTitle>
                <CardDescription>
                  Registro de todos os pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Associado</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(payments) && payments.slice(0, 10).map((payment: any) => {
                        const member = Array.isArray(members) 
                          ? members.find((m: any) => m.id === payment.user_id) 
                          : null;
                        
                        return (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{member ? member.name : `ID ${payment.user_id}`}</TableCell>
                            <TableCell>R$ {typeof payment.amount === 'string' 
                              ? payment.amount 
                              : payment.amount?.toFixed(2).replace('.', ',')}</TableCell>
                            <TableCell>
                              {payment.plan === "monthly" ? "Mensal" : "Anual"}
                            </TableCell>
                            <TableCell>{payment.payment_date 
                              ? formatDate(payment.payment_date)
                              : formatDate(payment.created_at)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  payment.status === "paid" ? "default" : 
                                  payment.status === "pending" ? "outline" : 
                                  payment.status === "failed" ? "destructive" : "secondary"
                                }
                              >
                                {payment.status === "paid" ? "Pago" : 
                                 payment.status === "pending" ? "Pendente" : 
                                 payment.status === "failed" ? "Falhou" : "Reembolsado"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
}