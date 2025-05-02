import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, BookOpen, Calendar, CreditCard, Users, Award } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
  });

  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ["/api/events"],
    retry: false,
  });

  const { data: ebooks = [], isLoading: isLoadingEbooks } = useQuery({
    queryKey: ["/api/ebooks"],
    retry: false,
  });

  const { data: benefits = [], isLoading: isLoadingBenefits } = useQuery({
    queryKey: ["/api/benefits"],
    retry: false,
  });

  const isLoading = isLoadingUsers || isLoadingEvents || isLoadingEbooks || isLoadingBenefits;

  // Cálculos para os cartões
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const activeUsers = Array.isArray(users) ? users.filter((user: any) => user.subscription_status === "active").length : 0;
  const totalEvents = Array.isArray(events) ? events.length : 0;
  const totalEbooks = Array.isArray(ebooks) ? ebooks.length : 0;
  const totalBenefits = Array.isArray(benefits) ? benefits.length : 0;

  const statCards = [
    {
      title: "Total de Associados",
      value: totalUsers,
      icon: <UserRound className="h-5 w-5 text-blue-500" />,
      description: "Associados cadastrados"
    },
    {
      title: "Associados Ativos",
      value: activeUsers,
      icon: <Users className="h-5 w-5 text-green-500" />,
      description: "Com assinatura ativa"
    },
    {
      title: "Eventos",
      value: totalEvents,
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      description: "Palestras e formações"
    },
    {
      title: "E-books",
      value: totalEbooks,
      icon: <BookOpen className="h-5 w-5 text-yellow-500" />,
      description: "Materiais disponíveis"
    },
    {
      title: "Convênios",
      value: totalBenefits,
      icon: <Award className="h-5 w-5 text-red-500" />,
      description: "Parceiros ativos"
    },
    {
      title: "Valor da Anuidade",
      value: "R$ 699,00",
      icon: <CreditCard className="h-5 w-5 text-teal-500" />,
      description: "Plano anual"
    }
  ];

  return (
    <AdminShell title="Dashboard Administrativo">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "-" : card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Associados Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <p className="text-center py-4 text-muted-foreground">Carregando...</p>
            ) : Array.isArray(users) && users.length > 0 ? (
              <div className="space-y-4">
                {users.slice(0, 5).map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserRound className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Nenhum associado encontrado.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEvents ? (
              <p className="text-center py-4 text-muted-foreground">Carregando...</p>
            ) : Array.isArray(events) && events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event: any) => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.event_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Nenhum evento encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}