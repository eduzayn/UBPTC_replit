import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Search, Plus, Edit, Trash2, Users, CalendarCheck, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Tipos de eventos disponíveis
const eventTypes = [
  { value: "palestra", label: "Palestra" },
  { value: "supervisao", label: "Supervisão Clínica" },
  { value: "grupo_estudo", label: "Grupo de Estudo" },
  { value: "congresso", label: "Congresso" },
  { value: "formacao", label: "Formação" },
  { value: "workshop", label: "Workshop" },
];

// Esquema de validação para o formulário de evento
const eventFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.string().min(1, "Selecione um tipo de evento"),
  event_date: z.date({
    required_error: "Selecione uma data para o evento",
  }),
  start_time: z.string().min(1, "Selecione um horário de início"),
  end_time: z.string().min(1, "Selecione um horário de término"),
  meeting_url: z.string().url("Insira uma URL válida para a reunião").optional().or(z.literal("")),
  certificate_template: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();

  // Formulário de evento
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      event_date: undefined,
      start_time: "",
      end_time: "",
      meeting_url: "",
      certificate_template: "",
    },
  });

  // Consulta para obter eventos
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getQueryFn(),
    retry: false,
  });

  // Consulta para obter registros de eventos
  const { data: registrations = [], isLoading: isLoadingRegistrations } = useQuery({
    queryKey: ["/api/events/registrations"],
    queryFn: getQueryFn(),
    retry: false,
    enabled: activeTab === "attendees"
  });

  // Mutação para criar novo evento
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      return await apiRequest("POST", "/api/events", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Evento criado",
        description: "O evento foi criado com sucesso.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao criar",
        description: "Não foi possível criar o evento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutação para atualizar evento
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EventFormValues }) => {
      return await apiRequest("PUT", `/api/events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Evento atualizado",
        description: "O evento foi atualizado com sucesso.",
      });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setCurrentEventId(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o evento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutação para excluir evento
  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o evento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutação para atualizar presença
  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ eventId, userId, attended }: { eventId: number; userId: number; attended: boolean }) => {
      return await apiRequest("PUT", `/api/events/${eventId}/attendance`, { userId, attended });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events/registrations"] });
      toast({
        title: "Presença atualizada",
        description: "A presença do associado foi atualizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar presença",
        description: "Não foi possível atualizar a presença. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Filtrar os eventos por data atual
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = Array.isArray(events) 
    ? events.filter((event: any) => new Date(event.event_date) >= today)
    : [];
    
  const pastEvents = Array.isArray(events)
    ? events.filter((event: any) => new Date(event.event_date) < today)
    : [];

  // Filtrar os eventos
  const filteredEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;
  
  const filteredFilteredEvents = filteredEvents.filter((event: any) => {
    const matchesSearch = searchQuery === "" || 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || 
      event.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Função para carregar dados do evento para edição
  const handleEditEvent = (event: any) => {
    form.reset({
      title: event.title,
      description: event.description,
      type: event.type,
      event_date: new Date(event.event_date),
      start_time: event.start_time,
      end_time: event.end_time,
      meeting_url: event.meeting_url || "",
      certificate_template: event.certificate_template || "",
    });
    setCurrentEventId(event.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Função para abrir modal de adição
  const handleAddNewEvent = () => {
    form.reset({
      title: "",
      description: "",
      type: "",
      event_date: undefined,
      start_time: "",
      end_time: "",
      meeting_url: "",
      certificate_template: "",
    });
    setIsEditMode(false);
    setCurrentEventId(null);
    setIsDialogOpen(true);
  };

  // Função para confirmar exclusão do evento
  const handleDeleteEvent = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este evento? Esta ação não poderá ser desfeita.")) {
      deleteEventMutation.mutate(id);
    }
  };

  // Função para marcar presença
  const handleToggleAttendance = (eventId: number, userId: number, currentAttendance: boolean) => {
    updateAttendanceMutation.mutate({ 
      eventId, 
      userId, 
      attended: !currentAttendance 
    });
  };

  // Enviar formulário
  const onSubmit = (data: EventFormValues) => {
    if (isEditMode && currentEventId) {
      updateEventMutation.mutate({ id: currentEventId, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  // Organizar registros por evento
  const registrationsByEvent: Record<number, any[]> = {};
  
  if (Array.isArray(registrations)) {
    for (const reg of registrations) {
      if (!registrationsByEvent[reg.event_id]) {
        registrationsByEvent[reg.event_id] = [];
      }
      registrationsByEvent[reg.event_id].push(reg);
    }
  }

  return (
    <AdminShell title="Gestão de Eventos">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
            <TabsTrigger value="past">Eventos Passados</TabsTrigger>
            <TabsTrigger value="attendees">Presenças</TabsTrigger>
          </TabsList>
          <Button className="gap-2 mt-4 sm:mt-0" onClick={handleAddNewEvent}>
            <Plus className="h-4 w-4" />
            <span>Novo Evento</span>
          </Button>
        </div>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtrar Eventos</CardTitle>
              <CardDescription>
                Pesquise e filtre os próximos eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por título ou descrição..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredFilteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFilteredEvents.map((event: any) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <Badge variant="outline" className="mb-2">
                        {eventTypes.find(t => t.value === event.type)?.label || event.type}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(new Date(event.event_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.start_time} - {event.end_time}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>0 inscritos</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-muted rounded-lg">
              Nenhum evento futuro encontrado com os filtros aplicados.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtrar Eventos Passados</CardTitle>
              <CardDescription>
                Pesquise e filtre os eventos já realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por título ou descrição..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredFilteredEvents.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFilteredEvents.map((event: any) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{event.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(event.event_date), "dd/MM/yyyy")}
                        <p className="text-xs text-muted-foreground">{event.start_time} - {event.end_time}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {eventTypes.find(t => t.value === event.type)?.label || event.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>0</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-muted rounded-lg">
              Nenhum evento passado encontrado com os filtros aplicados.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="attendees" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Presenças</CardTitle>
              <CardDescription>
                Gerencie a presença dos associados nos eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRegistrations ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : Object.keys(registrationsByEvent).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(registrationsByEvent).map(([eventId, eventRegistrations]) => {
                    const event = events.find((e: any) => e.id === parseInt(eventId));
                    if (!event) return null;
                    
                    return (
                      <div key={eventId} className="border rounded-lg p-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{format(new Date(event.event_date), "dd/MM/yyyy")}</span>
                            <span>({event.start_time} - {event.end_time})</span>
                          </div>
                        </div>
                        
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Associado</TableHead>
                                <TableHead>Data de Inscrição</TableHead>
                                <TableHead className="text-center">Presença</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {eventRegistrations.map((registration: any) => (
                                <TableRow key={registration.id}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{registration.user?.name || "Associado"}</p>
                                      <p className="text-xs text-muted-foreground">{registration.user?.email || "Email não disponível"}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(registration.created_at), "dd/MM/yyyy")}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Button 
                                      variant={registration.attended ? "default" : "outline"}
                                      size="sm"
                                      className="gap-2"
                                      onClick={() => handleToggleAttendance(
                                        parseInt(eventId), 
                                        registration.user_id, 
                                        registration.attended
                                      )}
                                    >
                                      {registration.attended ? (
                                        <>
                                          <CalendarCheck className="h-4 w-4" />
                                          <span>Presente</span>
                                        </>
                                      ) : (
                                        "Marcar Presença"
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-muted rounded-lg">
                  Nenhuma inscrição em eventos encontrada.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Evento" : "Criar Novo Evento"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edite as informações do evento selecionado."
                : "Preencha as informações para criar um novo evento."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o evento" 
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Evento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Data do Evento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Início</FormLabel>
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
                      <FormLabel>Horário de Término</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
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
                    <FormLabel>URL da Reunião (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Link para a videochamada (Zoom, Meet, etc.)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Para eventos online, insira o link da reunião
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
                    <FormLabel>Template de Certificado (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="URL do template de certificado" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      URL para o template de certificado a ser emitido para os participantes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {isEditMode ? "Salvar Alterações" : "Criar Evento"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}