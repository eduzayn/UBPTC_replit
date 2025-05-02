import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "../components/ui/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Video,
  Users,
  MapPin,
  ListFilter,
  AlertCircle,
  Info,
  CheckCircle,
  CalendarRange,
  Award,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Tipos
type EventType = "supervisao" | "grupo_estudo" | "palestra" | "workshop";

interface Event {
  id: number;
  titulo: string;
  descricao: string;
  tipo: EventType;
  dataInicio: string;
  dataFim: string;
  linkReuniao?: string;
  local?: string;
  certificado: boolean;
}

interface Registration {
  id: number;
  eventId: number;
  userId: number;
  dataInscricao: string;
  presente: boolean;
  certificadoEmitido: boolean;
  event?: Event;
}

export default function EventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [registeringEvent, setRegisteringEvent] = useState<number | null>(null);

  // Fetch all upcoming events
  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    error: errorEvents,
  } = useQuery({
    queryKey: ["/api/events/upcoming"],
    enabled: !!user,
  });

  // Fetch user's event registrations
  const {
    data: userRegistrations,
    isLoading: isLoadingRegistrations,
    isError: isErrorRegistrations,
    error: errorRegistrations,
  } = useQuery({
    queryKey: ["/api/events/registrations/user"],
    enabled: !!user,
  });

  // Register for an event mutation
  const registerMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await apiRequest("POST", `/api/events/${eventId}/register`, {});
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao se inscrever no evento");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events/registrations/user"] });
      toast({
        title: "Inscrição realizada",
        description: "Você foi inscrito com sucesso no evento",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao se inscrever",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setRegisteringEvent(null);
    }
  });

  // Filter events based on type
  const filteredEvents = events
    ? events.filter((event) => {
        return typeFilter === "all" || event.tipo === typeFilter;
      })
    : [];

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Check if user is registered for an event
  const isRegistered = (eventId: number) => {
    return userRegistrations
      ? userRegistrations.some((reg: Registration) => reg.eventId === eventId)
      : false;
  };

  // Find user's registration for an event
  const getRegistration = (eventId: number) => {
    return userRegistrations
      ? userRegistrations.find((reg: Registration) => reg.eventId === eventId)
      : null;
  };

  // Handle registration
  const handleRegister = (eventId: number) => {
    setRegisteringEvent(eventId);
    registerMutation.mutate(eventId);
  };

  // Get event type label
  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "supervisao":
        return "Supervisão";
      case "grupo_estudo":
        return "Grupo de Estudo";
      case "palestra":
        return "Palestra";
      case "workshop":
        return "Workshop";
      default:
        return type;
    }
  };

  // Get event type color
  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case "supervisao":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "grupo_estudo":
        return "bg-green-100 text-green-800 border-green-300";
      case "palestra":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "workshop":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (!user) return null;

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Eventos e Supervisões</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inscreva-se e participe de eventos, supervisões e grupos de estudo exclusivos para associados
          </p>
        </div>

        {/* Filter Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-64">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <ListFilter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por tipo" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="supervisao">Supervisões</SelectItem>
                    <SelectItem value="grupo_estudo">Grupos de Estudo</SelectItem>
                    <SelectItem value="palestra">Palestras</SelectItem>
                    <SelectItem value="workshop">Workshops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground md:ml-auto">
                Os eventos estão ordenados por data, do mais próximo para o mais distante.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upcoming" className="mb-10">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">
              <Calendar className="mr-2 h-4 w-4" />
              Próximos Eventos
            </TabsTrigger>
            <TabsTrigger value="registered">
              <Users className="mr-2 h-4 w-4" />
              Minhas Inscrições
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Events Tab */}
          <TabsContent value="upcoming">
            {isLoadingEvents ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-24 rounded mb-2" />
                        <Skeleton className="h-6 w-24 rounded" />
                      </div>
                      <Skeleton className="h-8 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : isErrorEvents ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar eventos</AlertTitle>
                <AlertDescription>
                  {errorEvents instanceof Error
                    ? errorEvents.message
                    : "Não foi possível carregar os eventos. Tente novamente mais tarde."}
                </AlertDescription>
              </Alert>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => {
                  const { date, time } = formatDateTime(event.dataInicio);
                  const isUserRegistered = isRegistered(event.id);
                  
                  return (
                    <Card key={event.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <Badge
                            className={`${getEventTypeColor(event.tipo)} border`}
                            variant="outline"
                          >
                            {getEventTypeLabel(event.tipo)}
                          </Badge>
                          {event.certificado && (
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-800 border-blue-300">
                              <Award className="h-3 w-3 mr-1" />
                              Certificado
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="mt-2 line-clamp-2">
                          {event.titulo}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{date}</span>
                            <Clock className="h-4 w-4 ml-4 mr-2 text-gray-500" />
                            <span>{time}</span>
                          </div>
                          {event.local && (
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{event.local}</span>
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3">{event.descricao}</p>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        {isUserRegistered ? (
                          <div className="w-full">
                            <div className="flex items-center justify-between w-full mb-3">
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                <span className="text-sm font-medium">Inscrito</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {getRegistration(event.id)?.dataInscricao 
                                  ? `Inscrito em ${new Date(getRegistration(event.id)!.dataInscricao).toLocaleDateString("pt-BR")}` 
                                  : ""}
                              </span>
                            </div>
                            {event.linkReuniao && (
                              <Button className="w-full bg-primary" asChild>
                                <a href={event.linkReuniao} target="_blank" rel="noopener noreferrer">
                                  <Video className="mr-2 h-4 w-4" />
                                  Acessar Reunião
                                </a>
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button 
                            className="w-full bg-primary" 
                            onClick={() => handleRegister(event.id)}
                            disabled={registeringEvent === event.id}
                          >
                            {registeringEvent === event.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Inscrevendo...
                              </>
                            ) : (
                              <>
                                <Users className="mr-2 h-4 w-4" />
                                Inscrever-se
                              </>
                            )}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Nenhum evento encontrado</AlertTitle>
                <AlertDescription>
                  {typeFilter === "all" 
                    ? "Não há eventos programados para os próximos dias."
                    : "Não há eventos do tipo selecionado. Tente filtrar por outro tipo de evento."}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* My Registrations Tab */}
          <TabsContent value="registered">
            {isLoadingRegistrations ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-24 rounded mb-2" />
                        <Skeleton className="h-6 w-24 rounded" />
                      </div>
                      <Skeleton className="h-8 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : isErrorRegistrations ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar inscrições</AlertTitle>
                <AlertDescription>
                  {errorRegistrations instanceof Error
                    ? errorRegistrations.message
                    : "Não foi possível carregar suas inscrições. Tente novamente mais tarde."}
                </AlertDescription>
              </Alert>
            ) : userRegistrations && userRegistrations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRegistrations.map((registration: Registration) => {
                  const event = registration.event;
                  if (!event) return null;
                  
                  const { date, time } = formatDateTime(event.dataInicio);
                  const now = new Date();
                  const eventDate = new Date(event.dataInicio);
                  const isPast = eventDate < now;
                  
                  return (
                    <Card key={registration.id} className={`h-full flex flex-col ${isPast ? 'border-gray-300 opacity-80' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <Badge
                            className={`${getEventTypeColor(event.tipo)} border`}
                            variant="outline"
                          >
                            {getEventTypeLabel(event.tipo)}
                          </Badge>
                          {isPast ? (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                              Finalizado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              Inscrito
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="mt-2 line-clamp-2">
                          {event.titulo}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{date}</span>
                            <Clock className="h-4 w-4 ml-4 mr-2 text-gray-500" />
                            <span>{time}</span>
                          </div>
                          {event.local && (
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{event.local}</span>
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3">{event.descricao}</p>
                        
                        {registration.presente && (
                          <div className="flex items-center mt-3 text-green-600 dark:text-green-500">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">Presença confirmada</span>
                          </div>
                        )}
                        
                        {isPast && event.certificado && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {registration.certificadoEmitido 
                                ? "Certificado emitido e disponível para download" 
                                : registration.presente 
                                  ? "Seu certificado será emitido em breve" 
                                  : "Certificado não disponível - presença não confirmada"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        {!isPast && event.linkReuniao ? (
                          <Button className="w-full bg-primary" asChild>
                            <a href={event.linkReuniao} target="_blank" rel="noopener noreferrer">
                              <Video className="mr-2 h-4 w-4" />
                              Acessar Reunião
                            </a>
                          </Button>
                        ) : isPast && registration.certificadoEmitido ? (
                          <Button className="w-full bg-primary" asChild>
                            <a href={`/api/events/registrations/${registration.id}/certificate`}>
                              <Download className="mr-2 h-4 w-4" />
                              Download do Certificado
                            </a>
                          </Button>
                        ) : (
                          <Button className="w-full" variant="outline" disabled>
                            {isPast 
                              ? "Evento finalizado" 
                              : "Aguardando data do evento"}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Nenhuma inscrição encontrada</AlertTitle>
                <AlertDescription>
                  Você ainda não se inscreveu em nenhum evento. Explore os eventos disponíveis na aba "Próximos Eventos" e inscreva-se.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CalendarRange className="h-5 w-5 mr-2 text-primary" />
              Sobre Eventos e Supervisões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              A UBPCT oferece regularmente eventos, supervisões e grupos de estudo para o desenvolvimento profissional de seus associados.
              A participação em eventos e supervisões com frequência mínima pode gerar certificados.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Video className="h-4 w-4 mr-2 text-primary" />
                  Eventos Virtuais
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Os eventos virtuais são realizados através de plataformas de videoconferência.
                  O link para acesso fica disponível após a inscrição e também é enviado por e-mail.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-primary" />
                  Certificados
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Os certificados são emitidos para participantes que confirmarem presença nos eventos.
                  Eventos marcados com o selo "Certificado" geram certificados de participação.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}