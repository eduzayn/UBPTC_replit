import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, CalendarClock, Percent, ArrowUpRight, ArrowDownRight, UserMinus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminFinancePage() {
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Consulta para obter pagamentos
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["/api/payments"],
    queryFn: getQueryFn(),
    retry: false,
  });

  // Consulta para obter usuários
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/users"],
    queryFn: getQueryFn(),
    retry: false,
  });

  // Formatação de valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular KPIs financeiros
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const totalUsers = Array.isArray(users) ? users.length : 0;
  const activeUsers = Array.isArray(users) ? users.filter((user: any) => user.subscription_status === "active").length : 0;
  const inactiveUsers = totalUsers - activeUsers;
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Filtrar pagamentos
  const filteredPayments = Array.isArray(payments)
    ? payments.filter((payment: any) => {
        const paymentDate = payment.payment_date ? new Date(payment.payment_date) : null;
        const paymentMonth = paymentDate ? paymentDate.getMonth() : -1;
        const paymentYear = paymentDate ? paymentDate.getFullYear() : -1;
        
        const matchesMonth = monthFilter === "all" || (paymentMonth === parseInt(monthFilter) - 1);
        const matchesYear = yearFilter === "all" || (paymentYear === parseInt(yearFilter));
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        
        const user = Array.isArray(users) 
          ? users.find((u: any) => u.id === payment.user_id) 
          : null;
        
        const matchesSearch = searchQuery === "" || 
          (user && user.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user && user.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (payment.external_id && payment.external_id.includes(searchQuery));
        
        return matchesMonth && matchesYear && matchesStatus && matchesSearch;
      })
    : [];

  // Calcular total dos pagamentos atuais
  const currentMonthPayments = Array.isArray(payments)
    ? payments.filter((payment: any) => {
        const paymentDate = payment.payment_date ? new Date(payment.payment_date) : null;
        return paymentDate && 
          paymentDate.getMonth() === currentMonth && 
          paymentDate.getFullYear() === currentYear &&
          payment.status === "paid";
      })
    : [];

  const previousMonthPayments = Array.isArray(payments)
    ? payments.filter((payment: any) => {
        const paymentDate = payment.payment_date ? new Date(payment.payment_date) : null;
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return paymentDate && 
          paymentDate.getMonth() === previousMonth && 
          paymentDate.getFullYear() === previousMonthYear &&
          payment.status === "paid";
      })
    : [];

  const currentMonthTotal = currentMonthPayments.reduce((sum: number, payment: any) => {
    return sum + parseFloat(payment.amount);
  }, 0);

  const previousMonthTotal = previousMonthPayments.reduce((sum: number, payment: any) => {
    return sum + parseFloat(payment.amount);
  }, 0);

  const monthlyGrowth = previousMonthTotal === 0
    ? 100
    : Math.round(((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100);

  // Calcular totais por plano
  const monthlyPlanTotal = Array.isArray(payments)
    ? payments.filter(p => p.plan === "monthly" && p.status === "paid")
        .reduce((sum: number, payment: any) => sum + parseFloat(payment.amount), 0)
    : 0;

  const annualPlanTotal = Array.isArray(payments)
    ? payments.filter(p => p.plan === "annual" && p.status === "paid")
        .reduce((sum: number, payment: any) => sum + parseFloat(payment.amount), 0)
    : 0;

  // Gerar dados para o gráfico de pagamentos mensais
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  
  // Função para determinar o status do usuário com base nos pagamentos
  const getUserSubscriptionStatusText = (status: string) => {
    switch (status) {
      case "active": return "Adimplente";
      case "pending": return "Pendente";
      case "inactive": return "Inadimplente";
      default: return "Desconhecido";
    }
  };

  // Função para obter o status visual do pagamento
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">Pago</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50">Pendente</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">Falhou</Badge>;
      case "refunded":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminShell title="Gestão Financeira">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="border-b w-full pb-0 justify-start">
          <TabsTrigger className="rounded-t-lg rounded-b-none data-[state=active]:border-b-primary data-[state=active]:border-b-2" value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger className="rounded-t-lg rounded-b-none data-[state=active]:border-b-primary data-[state=active]:border-b-2" value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger className="rounded-t-lg rounded-b-none data-[state=active]:border-b-primary data-[state=active]:border-b-2" value="defaulters">Inadimplentes</TabsTrigger>
          <TabsTrigger className="rounded-t-lg rounded-b-none data-[state=active]:border-b-primary data-[state=active]:border-b-2" value="discounts">Descontos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(currentMonthTotal)}
                </div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {monthlyGrowth > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 mr-1">+{monthlyGrowth}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500 mr-1">{monthlyGrowth}%</span>
                    </>
                  )}
                  <span>comparado ao mês anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Membros Adimplentes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeUsers} de {totalUsers}
                </div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <span className="text-green-500 mr-1">{activePercentage}%</span>
                  <span>dos membros estão adimplentes</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Plano Anual</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(annualPlanTotal)}
                </div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <span>Total de receita com o plano anual</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Inadimplentes</CardTitle>
                <UserMinus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inactiveUsers}
                </div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <span className="text-red-500 mr-1">{100 - activePercentage}%</span>
                  <span>dos membros estão inadimplentes</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Planos</CardTitle>
                <CardDescription>
                  Análise de assinantes por tipo de plano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Plano Mensal</div>
                      <div className="text-xs text-muted-foreground">R$ 69,90/mês</div>
                    </div>
                    <div className="font-bold">{formatCurrency(monthlyPlanTotal)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Plano Anual</div>
                      <div className="text-xs text-muted-foreground">R$ 699,00/ano</div>
                    </div>
                    <div className="font-bold">{formatCurrency(annualPlanTotal)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Total</div>
                    </div>
                    <div className="font-bold">{formatCurrency(monthlyPlanTotal + annualPlanTotal)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Recentes</CardTitle>
                <CardDescription>
                  Últimos pagamentos recebidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingPayments ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : Array.isArray(payments) && payments.length > 0 ? (
                    <>
                      {payments
                        .filter(p => p.status === "paid")
                        .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
                        .slice(0, 5)
                        .map((payment: any, index: number) => {
                          const user = Array.isArray(users) 
                            ? users.find((u: any) => u.id === payment.user_id) 
                            : null;
                          
                          return (
                            <div key={index} className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="text-sm font-medium">{user?.name || "Usuário"}</div>
                                <div className="text-xs text-muted-foreground">
                                  {payment.payment_date ? format(new Date(payment.payment_date), "dd/MM/yyyy") : "Data não disponível"}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {payment.plan === "monthly" ? "Mensal" : "Anual"}
                                </Badge>
                                <div className="font-bold">{formatCurrency(parseFloat(payment.amount))}</div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhum pagamento encontrado.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Veja todos os pagamentos e filtre por período ou status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Mês</label>
                    <Select value={monthFilter} onValueChange={setMonthFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os meses</SelectItem>
                        {months.map((month, index) => (
                          <SelectItem key={month} value={(index + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Ano</label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os anos</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                        <SelectItem value="refunded">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Buscar</label>
                    <Input
                      placeholder="Nome ou email"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {isLoadingPayments || isLoadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredPayments.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Associado</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment: any) => {
                        const user = Array.isArray(users) 
                          ? users.find((u: any) => u.id === payment.user_id) 
                          : null;
                        
                        return (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user?.name || 'Associado'}</div>
                                <div className="text-xs text-muted-foreground">{user?.email || 'Email não disponível'}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {payment.payment_date ? (
                                format(new Date(payment.payment_date), "dd/MM/yyyy")
                              ) : (
                                payment.due_date ? (
                                  <span className="text-muted-foreground">
                                    Venc: {format(new Date(payment.due_date), "dd/MM/yyyy")}
                                  </span>
                                ) : "Data não disponível"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {payment.plan === "monthly" ? "Mensal" : "Anual"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {payment.payment_method === "credit_card" ? "Cartão de Crédito" : 
                               payment.payment_method === "boleto" ? "Boleto" : 
                               payment.payment_method === "pix" ? "Pix" : 
                               payment.payment_method || "N/A"}
                            </TableCell>
                            <TableCell>
                              {getPaymentStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(parseFloat(payment.amount))}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-muted rounded-lg">
                  Nenhum pagamento encontrado com os filtros aplicados.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="defaulters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Associados Inadimplentes</CardTitle>
              <CardDescription>
                Relação de associados com pagamentos pendentes ou atrasados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : Array.isArray(users) && users.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Associado</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Pagamento</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users
                        .filter((user: any) => user.subscription_status !== "active")
                        .map((user: any) => {
                          const userPayments = Array.isArray(payments) 
                            ? payments.filter((p: any) => p.user_id === user.id)
                            : [];
                            
                          const lastPayment = userPayments.length > 0 
                            ? userPayments.sort((a: any, b: any) => {
                                const dateA = a.payment_date ? new Date(a.payment_date).getTime() : 0;
                                const dateB = b.payment_date ? new Date(b.payment_date).getTime() : 0;
                                return dateB - dateA;
                              })[0]
                            : null;
                            
                          const paymentPlan = lastPayment ? (lastPayment.plan === "monthly" ? "Mensal" : "Anual") : "N/A";
                          
                          return (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.subscription_status === "pending" ? "outline" : "destructive"}>
                                  {getUserSubscriptionStatusText(user.subscription_status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {lastPayment && lastPayment.payment_date ? (
                                  format(new Date(lastPayment.payment_date), "dd/MM/yyyy")
                                ) : (
                                  "Nunca"
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{paymentPlan}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Enviar Lembrete
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-muted rounded-lg">
                  Nenhum associado inadimplente encontrado.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discounts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Descontos</CardTitle>
              <CardDescription>
                Configuração de códigos promocionais e descontos especiais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground bg-muted rounded-lg">
                Funcionalidade em desenvolvimento. Em breve você poderá:
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li>Criar cupons de desconto para campanhas</li>
                  <li>Configurar descontos para grupos específicos</li>
                  <li>Definir períodos promocionais</li>
                  <li>Acompanhar a utilização dos descontos</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}