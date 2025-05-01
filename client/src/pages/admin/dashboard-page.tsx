import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Wallet,
  DollarSign,
  Building,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simple admin stats overview component
function StatsCard({ title, value, icon, description, change }: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  change?: { value: number; positive: boolean };
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change && (
                <span className={`text-xs ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {change.positive ? '+' : ''}{change.value}%
                </span>
              )}
            </div>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();

  // Redirect if not admin
  if (user && user.role !== "admin") {
    navigate("/");
    return null;
  }

  // Fetch statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !!user && user.role === "admin",
    queryFn: async () => {
      // In a real implementation, we would fetch stats from the API
      // For now, return mocked data
      return {
        totalMembers: 247,
        activeMembers: 203,
        memberChange: { value: 12, positive: true },
        totalEbooks: 45,
        totalEvents: 28,
        upcomingEvents: 5,
        monthlyRevenue: "R$ 14.180,70",
        revenueChange: { value: 8, positive: true },
        pendingPayments: 18,
        totalSubscriptions: 195,
        annualSubscriptions: 42
      };
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">
            Gerencie associados, eventos, ebooks e muito mais
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/members">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Associados
            </Button>
          </Link>
          <Link href="/admin/events">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Eventos
            </Button>
          </Link>
          <Link href="/admin/ebooks">
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              E-books
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total de Associados" 
          value={isLoadingStats ? "..." : stats?.totalMembers || 0}
          description={`${isLoadingStats ? "..." : stats?.activeMembers || 0} associados ativos`}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          change={stats?.memberChange}
        />
        <StatsCard 
          title="Biblioteca" 
          value={isLoadingStats ? "..." : stats?.totalEbooks || 0}
          description="E-books disponíveis"
          icon={<BookOpen className="h-5 w-5 text-amber-600" />}
        />
        <StatsCard 
          title="Eventos" 
          value={isLoadingStats ? "..." : stats?.totalEvents || 0}
          description={`${isLoadingStats ? "..." : stats?.upcomingEvents || 0} eventos programados`}
          icon={<Calendar className="h-5 w-5 text-green-600" />}
        />
        <StatsCard 
          title="Receita Mensal" 
          value={isLoadingStats ? "..." : stats?.monthlyRevenue || "R$ 0,00"}
          description={`${isLoadingStats ? "..." : stats?.pendingPayments || 0} pagamentos pendentes`}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          change={stats?.revenueChange}
        />
      </div>

      {/* Members and Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Visão Geral dos Associados</CardTitle>
              <Link href="/admin/members">
                <Button variant="ghost" size="sm" className="h-8 text-primary">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Distribuição dos associados por status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Adimplentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {isLoadingStats ? "..." : stats?.activeMembers || 0}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({isLoadingStats ? "..." : stats ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Inadimplentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {isLoadingStats ? "..." : stats ? stats.totalMembers - stats.activeMembers : 0}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({isLoadingStats ? "..." : stats ? Math.round(((stats.totalMembers - stats.activeMembers) / stats.totalMembers) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ 
                    width: `${isLoadingStats ? 0 : stats ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}%` 
                  }}
                ></div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Assinatura Mensal</p>
                  <p className="text-lg font-semibold">
                    {isLoadingStats ? "..." : stats ? stats.totalSubscriptions - stats.annualSubscriptions : 0}
                    <span className="text-xs text-gray-500 ml-1">associados</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assinatura Anual</p>
                  <p className="text-lg font-semibold">
                    {isLoadingStats ? "..." : stats?.annualSubscriptions || 0}
                    <span className="text-xs text-gray-500 ml-1">associados</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Relatório Financeiro</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-primary">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-xs">Exportar</span>
              </Button>
            </div>
            <CardDescription>Visão geral dos pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Receita Mensal</p>
                      <p className="text-lg font-bold">{isLoadingStats ? "..." : stats?.monthlyRevenue || "R$ 0,00"}</p>
                    </div>
                  </div>
                  <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                    +{isLoadingStats ? "..." : stats?.revenueChange.value || 0}% este mês
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Pagamentos Recebidos</p>
                    <p className="text-lg font-semibold mt-1">
                      {isLoadingStats ? "..." : stats?.activeMembers || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Pagamentos Pendentes</p>
                    <p className="text-lg font-semibold mt-1 text-amber-600">
                      {isLoadingStats ? "..." : stats?.pendingPayments || 0}
                    </p>
                  </div>
                </div>
                
                <Link href="/admin/payments">
                  <Button className="w-full bg-primary mt-2">
                    Ver Relatório Completo
                  </Button>
                </Link>
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Pagamentos Pendentes</p>
                  <p className="text-sm font-bold">{isLoadingStats ? "..." : stats?.pendingPayments || 0}</p>
                </div>
                
                <div className="text-sm text-gray-500">
                  Há {isLoadingStats ? "..." : stats?.pendingPayments || 0} associados com pagamentos pendentes que 
                  precisam ser regularizados. Você pode enviar lembretes ou gerenciar esses pagamentos
                  na seção de gerenciamento financeiro.
                </div>
                
                <Link href="/admin/payments/pending">
                  <Button className="w-full bg-primary mt-2">
                    Gerenciar Pagamentos Pendentes
                  </Button>
                </Link>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Novo associado registrado</p>
                  <p className="text-xs text-gray-500">Maria Silva completou o registro</p>
                  <p className="text-xs text-gray-400 mt-1">Hoje, 10:32</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pagamento recebido</p>
                  <p className="text-xs text-gray-500">João Santos - R$ 69,90 (Assinatura Mensal)</p>
                  <p className="text-xs text-gray-400 mt-1">Hoje, 09:15</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 rounded-full p-2 mt-1">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Novo e-book adicionado</p>
                  <p className="text-xs text-gray-500">"Técnicas Avançadas em Psicanálise Clínica"</p>
                  <p className="text-xs text-gray-400 mt-1">Ontem, 15:47</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-red-100 rounded-full p-2 mt-1">
                  <Calendar className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Novo evento criado</p>
                  <p className="text-xs text-gray-500">"Supervisão Clínica: Casos de Ansiedade"</p>
                  <p className="text-xs text-gray-400 mt-1">Ontem, 14:22</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            <CardDescription>Funcionalidades frequentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/members/add">
              <Button className="w-full bg-primary justify-start" variant="default">
                <Users className="h-4 w-4 mr-2" />
                Adicionar Associado
              </Button>
            </Link>
            
            <Link href="/admin/events/add">
              <Button className="w-full bg-primary justify-start" variant="default">
                <Calendar className="h-4 w-4 mr-2" />
                Criar Evento
              </Button>
            </Link>
            
            <Link href="/admin/ebooks/add">
              <Button className="w-full bg-primary justify-start" variant="default">
                <BookOpen className="h-4 w-4 mr-2" />
                Adicionar E-book
              </Button>
            </Link>
            
            <Link href="/admin/benefits/add">
              <Button className="w-full bg-primary justify-start" variant="default">
                <Building className="h-4 w-4 mr-2" />
                Adicionar Convênio
              </Button>
            </Link>
            
            <Link href="/admin/certificates/generate">
              <Button className="w-full bg-primary justify-start" variant="default">
                <BarChart3 className="h-4 w-4 mr-2" />
                Gerar Certificados
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
