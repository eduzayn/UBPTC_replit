import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Mail, 
  Send, 
  Clock, 
  FileText, 
  Users, 
  Calendar, 
  Check, 
  Ban, 
  MessageSquare,
  Bell,
  HelpCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Esquema de validação para o e-mail
const emailFormSchema = z.object({
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  content: z.string().min(10, "O conteúdo do e-mail deve ter pelo menos 10 caracteres"),
  recipient_type: z.enum(["all", "active", "inactive", "custom"]),
  recipients: z.array(z.number()).optional(),
  schedule_date: z.date().optional(),
  template_id: z.string().optional(),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

// Tipos de destinatários
const recipientTypes = [
  { value: "all", label: "Todos os Associados" },
  { value: "active", label: "Associados Adimplentes" },
  { value: "inactive", label: "Associados Inadimplentes" },
  { value: "custom", label: "Personalizado" }
];

// Templates de e-mail
const emailTemplates = [
  { id: "welcome", name: "Boas-vindas", description: "E-mail de boas-vindas para novos associados" },
  { id: "payment_reminder", name: "Lembrete de Pagamento", description: "Aviso sobre pagamento pendente" },
  { id: "new_event", name: "Novo Evento", description: "Anúncio de novo evento" },
  { id: "new_ebook", name: "Nova Publicação", description: "Anúncio de novo e-book" },
  { id: "certificate", name: "Certificado Disponível", description: "Aviso de certificado disponível" },
];

export default function AdminCommunicationPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Consulta para obter usuários
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
  });

  // Formulário de e-mail
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      subject: "",
      content: "",
      recipient_type: "all",
      recipients: [],
      template_id: "",
    },
  });

  // Mutação para enviar e-mail
  const sendEmailMutation = useMutation({
    mutationFn: async (data: EmailFormValues) => {
      return await apiRequest("POST", "/api/communications/send-email", data);
    },
    onSuccess: () => {
      toast({
        title: "E-mail enviado",
        description: "O e-mail foi enviado com sucesso para os destinatários.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o e-mail. Verifique as configurações de e-mail.",
        variant: "destructive",
      });
    },
  });

  // Função para enviar teste
  const handleSendTestEmail = () => {
    toast({
      title: "Teste enviado",
      description: "Um e-mail de teste foi enviado para o seu endereço.",
    });
  };

  // Selecionar um template de e-mail
  const handleSelectTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    
    if (!template) return;
    
    // Para fins de demonstração, preenchemos com conteúdo simples
    let subject = "";
    let content = "";
    
    switch (templateId) {
      case "welcome":
        subject = "Bem-vindo à União Brasileira de Psicanálise Clínica e Terapêutica";
        content = "Olá, {nome}!\n\nÉ com grande satisfação que damos as boas-vindas à União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT). Estamos muito felizes em ter você como associado.\n\nAcesse sua área do associado para explorar todos os benefícios e recursos disponíveis.\n\nAtenciosamente,\nEquipe UBPCT";
        break;
      case "payment_reminder":
        subject = "Lembrete: Pagamento da Anuidade UBPCT";
        content = "Olá, {nome}!\n\nEste é um lembrete sobre o pagamento da sua anuidade, que está próximo do vencimento.\n\nPara continuar aproveitando todos os benefícios de associado, por favor, efetue o pagamento até a data de vencimento.\n\nAtenciosamente,\nEquipe UBPCT";
        break;
      case "new_event":
        subject = "Novo Evento: {nome_evento}";
        content = "Olá, {nome}!\n\nTemos o prazer de convidar você para o nosso próximo evento: {nome_evento}.\n\nData: {data_evento}\nLocal: {local_evento}\n\nInscreva-se pela sua área do associado.\n\nAtenciosamente,\nEquipe UBPCT";
        break;
      default:
        subject = "";
        content = "";
    }
    
    form.setValue("subject", subject);
    form.setValue("content", content);
    form.setValue("template_id", templateId);
  };

  // Enviar formulário
  const onSubmit = (data: EmailFormValues) => {
    // Mensagem de confirmação
    const recipientCount = data.recipient_type === "custom" && data.recipients
      ? data.recipients.length
      : data.recipient_type === "all" 
        ? users.length 
        : (data.recipient_type === "active" 
           ? users.filter((u: any) => u.subscription_status === "active").length 
           : users.filter((u: any) => u.subscription_status !== "active").length);
    
    if (window.confirm(`Você está prestes a enviar este e-mail para ${recipientCount} destinatários. Confirma o envio?`)) {
      sendEmailMutation.mutate(data);
    }
  };

  return (
    <AdminShell title="Comunicação">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="border-b w-full pb-0 justify-start">
          <TabsTrigger className="rounded-t-lg rounded-b-none data-[state=active]:border-b-primary data-[state=active]:border-b-2" value="email">E-mail</TabsTrigger>
          <TabsTrigger className="rounded-t-lg rounded-b-none data-[state=active]:border-b-primary data-[state=active]:border-b-2" value="templates">Templates</TabsTrigger>
          <TabsTrigger className="rounded-t-lg rounded-b-none data-[state=active]:border-b-primary data-[state=active]:border-b-2" value="automated">Automações</TabsTrigger>
          <TabsTrigger className="rounded-t-lg rounded-b-none data-[state=active]:border-b-primary data-[state=active]:border-b-2" value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Enviar E-mail</CardTitle>
                  <CardDescription>
                    Envie e-mails para seus associados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsDialogOpen(true)}>
                      <Mail className="h-4 w-4" />
                      <span>Novo E-mail</span>
                    </Button>
                  </div>

                  <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <Mail className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Comunique-se com seus associados</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Envie e-mails diretamente para seus associados, utilizando templates predefinidos ou criando mensagens personalizadas.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button variant="outline" size="sm" className="gap-1 h-8" onClick={() => setIsDialogOpen(true)}>
                        <Send className="h-3 w-3" />
                        <span>Enviar</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 h-8">
                        <Clock className="h-3 w-3" />
                        <span>Agendar</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 h-8">
                        <FileText className="h-3 w-3" />
                        <span>Ver Templates</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>
                    Templates prontos para uso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {emailTemplates.map((template) => (
                      <Button 
                        key={template.id} 
                        variant="outline" 
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => {
                          handleSelectTemplate(template.id);
                          setIsDialogOpen(true);
                        }}
                      >
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                  <CardDescription>
                    Desempenho de e-mails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Taxa de abertura</div>
                      <div className="font-medium">68%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Taxa de cliques</div>
                      <div className="font-medium">42%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Cancelamentos</div>
                      <div className="font-medium">3%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Templates de E-mail</CardTitle>
              <CardDescription>
                Gerencie os modelos de e-mail para diferentes situações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => {
                          handleSelectTemplate(template.id);
                          setIsDialogOpen(true);
                        }}>
                          <Mail className="h-3 w-3" />
                          <span>Usar</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1" onClick={handleSendTestEmail}>
                          <Send className="h-3 w-3" />
                          <span>Testar</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="automated" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Automações</CardTitle>
              <CardDescription>
                Configura e-mails que serão enviados automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium mb-1">Lembrete de Pagamento</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Enviado automaticamente 7 dias antes do vencimento da assinatura
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-green-50 text-green-600 hover:bg-green-50">Ativo</Badge>
                        <Badge variant="outline">7 dias antes</Badge>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium mb-1">Novidades da Semana</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        E-mail semanal com as novidades da plataforma (toda segunda-feira)
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-green-50 text-green-600 hover:bg-green-50">Ativo</Badge>
                        <Badge variant="outline">Segunda, 08:00</Badge>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium mb-1">Boas-vindas</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        E-mail enviado automaticamente após o cadastro do associado
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-green-50 text-green-600 hover:bg-green-50">Ativo</Badge>
                        <Badge variant="outline">Ao cadastrar</Badge>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Comunicações</CardTitle>
              <CardDescription>
                Registro de todas as comunicações enviadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Data de Envio</TableHead>
                      <TableHead>Destinatários</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Taxa de Abertura</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Convite para Supervisão Clínica Online</div>
                        <div className="text-xs text-muted-foreground">Evento mensal</div>
                      </TableCell>
                      <TableCell>{format(new Date(2023, 3, 15), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50">Todos (124)</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-1" />
                          <span>Enviado</span>
                        </div>
                      </TableCell>
                      <TableCell>78%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Renovação de Assinatura</div>
                        <div className="text-xs text-muted-foreground">Lembrete automático</div>
                      </TableCell>
                      <TableCell>{format(new Date(2023, 3, 10), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50">Específico (18)</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-1" />
                          <span>Enviado</span>
                        </div>
                      </TableCell>
                      <TableCell>92%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Novo E-book Disponível</div>
                        <div className="text-xs text-muted-foreground">Publicação de conteúdo</div>
                      </TableCell>
                      <TableCell>{format(new Date(2023, 2, 28), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-50 text-green-600 hover:bg-green-50">Adimplentes (97)</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-1" />
                          <span>Enviado</span>
                        </div>
                      </TableCell>
                      <TableCell>64%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Certificado de Formação</div>
                        <div className="text-xs text-muted-foreground">Anual de associação</div>
                      </TableCell>
                      <TableCell>{format(new Date(2023, 2, 15), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-50 text-green-600 hover:bg-green-50">Adimplentes (85)</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Ban className="h-4 w-4 text-red-500 mr-1" />
                          <span>Falha (3)</span>
                        </div>
                      </TableCell>
                      <TableCell>71%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Enviar E-mail</DialogTitle>
            <DialogDescription>
              Crie e envie um e-mail para seus associados
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o assunto do e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite o conteúdo do e-mail..." 
                        rows={10} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="flex items-center gap-1">
                      <HelpCircle className="h-3 w-3" />
                      <span>Use {'{nome}'} para incluir o nome do associado</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recipient_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatários</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione os destinatários" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {recipientTypes.map((type) => (
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
              
              {form.watch("recipient_type") === "custom" && (
                <FormField
                  control={form.control}
                  name="recipients"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Selecione os Associados</FormLabel>
                        <FormDescription>
                          Escolha quais associados receberão este e-mail
                        </FormDescription>
                      </div>
                      <div className="border rounded-md p-4 space-y-4 max-h-[200px] overflow-y-auto">
                        {isLoadingUsers ? (
                          <div className="flex justify-center">
                            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        ) : Array.isArray(users) && users.length > 0 ? (
                          <div className="space-y-2">
                            {users.map((user: any) => (
                              <FormField
                                key={user.id}
                                control={form.control}
                                name="recipients"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={user.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(user.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), user.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== user.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        <div>{user.name}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            Nenhum associado encontrado
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="schedule_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Envio (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          value={field.value ? field.value.toISOString().slice(0, 16) : ""}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Deixe em branco para enviar imediatamente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="template_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template (opcional)</FormLabel>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSelectTemplate(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Sem template</SelectItem>
                          {emailTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendTestEmail}
                >
                  Enviar Teste
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  <span>Enviar</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}