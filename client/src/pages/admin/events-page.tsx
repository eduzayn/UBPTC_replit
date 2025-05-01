import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Loader2, 
  Search, 
  Plus, 
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Users,
  Link as LinkIcon
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  description: string;
  type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  meeting_url?: string;
  certificate_template?: string;
  created_at: string;
}

// Schema for event form
const eventSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.string().min(2, "Selecione um tipo de evento"),
  event_date: z.string().min(1, "Selecione uma data"),
  start_time: z.string().min(1, "Informe a hora de início"),
  end_time: z.string().min(1, "Informe a hora de término"),
  meeting_url: z.string().url("Insira uma URL válida").or(z.string().length(0).optional()),
  certificate_template: z.string().url("Insira uma URL válida").or(z.string().length(0).optional()),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function AdminEventsPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tabView, setTabView] = useState("upcoming");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch events
  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/events'],
    enabled: !!user && user.role === "admin",
  });

  // Form for adding/editing events
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      event_date: "",
      start_time: "",
      end_time: "",
      meeting_url: "",
      certificate_template: "",
    },
  });

  // Reset form when editing event changes
  useEffect(() => {
    if (editingEvent) {
      form.reset({
        title: editingEvent.title,
        description: editingEvent.description,
        type: editingEvent.type,
        event_date: new Date(editingEvent.event_date).toISOString().split('T')[0], // Format as YYYY-MM-DD
        start_time: editingEvent.start_time,
        end_time: editingEvent.end_time,
        meeting_url: editingEvent.meeting_url || "",
        certificate_template: editingEvent.certificate_template || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        type: "",
        event_date: "",
        start_time: "",
        end_time: "",
        meeting_url: "",
        certificate_template: "",
      });
    }
  }, [editingEvent, form]);

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const response = await apiRequest("POST", "/api/events", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Evento adicionado",
        description: "O evento foi adicionado com sucesso.",
      });
      setIsAddDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar evento",
        description: error.message || "Ocorreu um erro ao adicionar o evento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async (data: EventFormValues & { id: number }) => {
      const { id, ...eventData } = data;
      const response = await apiRequest("PUT", `/api/events/${id}`, eventData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Evento atualizado",
        description: "O evento foi atualizado com sucesso.",
      });
      setIsAddDialogOpen(false);
      setEditingEvent(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar evento",
        description: error.message || "Ocorreu um erro ao atualizar o evento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir evento",
        description: error.message || "Ocorreu um erro ao excluir o evento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EventFormValues) => {
    if (editingEvent) {
      updateEventMutation.mutate({ ...data, id: editingEvent.id });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleDeleteEvent = () => {
    if (eventToDelete) {
      deleteEventMutation.mutate(eventToDelete.id);
    }
  };

  if (!user || user.role !== "admin") return null;

  // Filter events based on search, type, and tab
  const filteredEvents = events?.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      event.type.toLowerCase() === typeFilter.toLowerCase();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.event_date);
    eventDate.setHours(0, 0, 0, 0);
    const isPast = eventDate < today;
    
    const matchesTab = 
      (tabView === "upcoming" && !isPast) || 
      (tabView === "past" && isPast);
    
    return matchesSearch && matchesType && matchesTab;
  }) || [];

  // Sort events: upcoming by date (closest first), past by date (most recent first)
  filteredEvents.sort((a, b) => {
    const dateA = new Date(a.event_date);
    const dateB = new Date(b.event_date);
    
    if (tabView === "upcoming") {
      return dateA.getTime() - dateB.getTime(); // Ascending for upcoming
    } else {
      return dateB.getTime() - dateA.getTime(); // Descending for past
    }
  });

  // Extract unique event types
  const eventTypes = events 
    ? [...new Set(events.map(event => event.type))]
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Eventos</h1>
          <p className="text-gray-600">
            Administre os eventos e supervisões da UBPCT
          </p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-primary"
          onClick={() => {
            setEditingEvent(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Criar Evento
        </Button>
      </div>

      <Tabs value={tabView} onValueChange={setTabView} className="mb-6">
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="past">Eventos Passados</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>
            Encontre eventos específicos usando os filtros abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar por título ou descrição..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="h-80 animate-pulse">
              <div className="h-12 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <p className="text-red-500 mb-4">
              Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.
            </p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden flex flex-col">
              <div className="bg-primary text-white p-2 text-center font-semibold flex justify-between items-center">
                <span>{event.type}</span>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white hover:bg-primary/80"
                    onClick={() => {
                      setEditingEvent(event);
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white hover:bg-primary/80"
                    onClick={() => {
                      setEventToDelete(event);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold mb-3">{event.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {event.description}
                </p>
                
                <div className="mt-auto space-y-2">
                  <div className="flex items-center text-gray-700 text-sm">
                    <Calendar className="h-4 w-4 text-primary mr-2" />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-center text-gray-700 text-sm">
                    <Clock className="h-4 w-4 text-primary mr-2" />
                    <span>{event.start_time} - {event.end_time}</span>
                  </div>
                  {event.meeting_url && (
                    <div className="flex items-center text-gray-700 text-sm">
                      <LinkIcon className="h-4 w-4 text-primary mr-2" />
                      <a 
                        href={event.meeting_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline overflow-hidden text-ellipsis"
                      >
                        Link da Reunião
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm mt-1">
                    <Badge variant="outline" className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(event.event_date) > new Date() ? 'Futuro' : 'Passado'}
                    </Badge>
                    {event.certificate_template && (
                      <Badge variant="outline" className="bg-green-50">
                        Certificado Disponível
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/admin/events/${event.id}/attendees`)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ver Inscritos
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 mb-4">
              {tabView === "upcoming" 
                ? "Não há próximos eventos planejados" 
                : "Não há eventos passados"} 
              {(searchTerm || typeFilter !== "all") && " com os filtros atuais"}.
            </p>
            {(searchTerm || typeFilter !== "all") && (
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editar Evento" : "Criar Novo Evento"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {editingEvent ? "editar o" : "criar um novo"} evento.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do evento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Evento *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Supervisão Clínica">Supervisão Clínica</SelectItem>
                          <SelectItem value="Palestra">Palestra</SelectItem>
                          <SelectItem value="Grupo de Estudo">Grupo de Estudo</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Início *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Término *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o evento" 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="meeting_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link da Reunião</FormLabel>
                      <FormControl>
                        <Input placeholder="https://meet.google.com/..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Link para a videoconferência (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="certificate_template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template de Certificado</FormLabel>
                      <FormControl>
                        <Input placeholder="URL do template" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL do template de certificado (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingEvent(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary"
                  disabled={createEventMutation.isPending || updateEventMutation.isPending}
                >
                  {(createEventMutation.isPending || updateEventMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingEvent ? "Salvar Alterações" : "Criar Evento"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Você está prestes a excluir o evento <span className="font-semibold">{eventToDelete?.title}</span>. 
              Esta ação não pode ser desfeita e excluirá todos os dados relacionados a este evento.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setEventToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEvent}
              disabled={deleteEventMutation.isPending}
            >
              {deleteEventMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
