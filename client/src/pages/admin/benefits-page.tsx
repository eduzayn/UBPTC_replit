import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, ExternalLink, Award, Building, Phone, Globe } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Categorias para os benefícios
const benefitCategories = [
  "Saúde",
  "Educação",
  "Livrarias",
  "Bem-estar",
  "Tecnologia",
  "Serviços",
  "Lazer",
  "Hotéis",
  "Alimentação",
  "Outros"
];

// Esquema de validação para o formulário de benefício
const benefitFormSchema = z.object({
  company: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  discount: z.string().min(1, "Informe o desconto ou benefício oferecido"),
  category: z.string().min(1, "Selecione uma categoria"),
  logo_url: z.string().url("Informe uma URL válida para o logo").or(z.literal("")),
  contact_info: z.string().optional(),
  website: z.string().url("Informe uma URL válida para o site").or(z.literal("")),
  active: z.boolean().default(true),
});

type BenefitFormValues = z.infer<typeof benefitFormSchema>;

export default function AdminBenefitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBenefitId, setCurrentBenefitId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Formulário de benefício
  const form = useForm<BenefitFormValues>({
    resolver: zodResolver(benefitFormSchema),
    defaultValues: {
      company: "",
      description: "",
      discount: "",
      category: "",
      logo_url: "",
      contact_info: "",
      website: "",
      active: true,
    },
  });

  // Consulta para obter benefícios
  const { data: benefits = [], isLoading } = useQuery({
    queryKey: ["/api/benefits"],
    retry: false,
  });

  // Mutação para criar novo benefício
  const createBenefitMutation = useMutation({
    mutationFn: async (data: BenefitFormValues) => {
      return await apiRequest("POST", "/api/benefits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/benefits"] });
      toast({
        title: "Benefício adicionado",
        description: "O benefício foi adicionado com sucesso.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o benefício. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutação para atualizar benefício
  const updateBenefitMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BenefitFormValues }) => {
      return await apiRequest("PUT", `/api/benefits/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/benefits"] });
      toast({
        title: "Benefício atualizado",
        description: "O benefício foi atualizado com sucesso.",
      });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setCurrentBenefitId(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o benefício. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutação para excluir benefício
  const deleteBenefitMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/benefits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/benefits"] });
      toast({
        title: "Benefício excluído",
        description: "O benefício foi excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o benefício. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Filtrar os benefícios
  const filteredBenefits = Array.isArray(benefits) 
    ? benefits.filter((benefit: any) => {
        const matchesSearch = searchQuery === "" || 
          benefit.company?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          benefit.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === "all" || 
          benefit.category === categoryFilter;
        
        const matchesStatus = statusFilter === "all" || 
          (statusFilter === "active" && benefit.active) || 
          (statusFilter === "inactive" && !benefit.active);
        
        return matchesSearch && matchesCategory && matchesStatus;
      })
    : [];

  // Função para carregar dados do benefício para edição
  const handleEditBenefit = (benefit: any) => {
    form.reset({
      company: benefit.company,
      description: benefit.description,
      discount: benefit.discount,
      category: benefit.category,
      logo_url: benefit.logo_url || "",
      contact_info: benefit.contact_info || "",
      website: benefit.website || "",
      active: benefit.active,
    });
    setCurrentBenefitId(benefit.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Função para abrir modal de adição
  const handleAddNewBenefit = () => {
    form.reset({
      company: "",
      description: "",
      discount: "",
      category: "",
      logo_url: "",
      contact_info: "",
      website: "",
      active: true,
    });
    setIsEditMode(false);
    setCurrentBenefitId(null);
    setIsDialogOpen(true);
  };

  // Função para confirmar exclusão do benefício
  const handleDeleteBenefit = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este benefício? Esta ação não poderá ser desfeita.")) {
      deleteBenefitMutation.mutate(id);
    }
  };

  // Enviar formulário
  const onSubmit = (data: BenefitFormValues) => {
    if (isEditMode && currentBenefitId) {
      updateBenefitMutation.mutate({ id: currentBenefitId, data });
    } else {
      createBenefitMutation.mutate(data);
    }
  };

  return (
    <AdminShell title="Gestão de Convênios e Benefícios">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Convênios e Parcerias</CardTitle>
          <CardDescription>
            Gerencie os benefícios disponíveis para os associados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por empresa ou descrição..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {benefitCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="gap-2" onClick={handleAddNewBenefit}>
              <Plus className="h-4 w-4" />
              <span>Novo Convênio</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Convênios</CardTitle>
          <CardDescription>
            Total: {filteredBenefits.length} convênios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredBenefits.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBenefits.map((benefit: any) => (
                    <TableRow key={benefit.id} className={!benefit.active ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {benefit.logo_url ? (
                              <img src={benefit.logo_url} alt={benefit.company} className="object-cover w-full h-full" />
                            ) : (
                              <Building className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{benefit.company}</div>
                            <div className="text-xs text-muted-foreground">{benefit.discount}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {benefit.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{benefit.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={benefit.active ? "outline" : "secondary"}>
                          {benefit.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {benefit.website && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={benefit.website} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Visitar site</span>
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEditBenefit(benefit)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteBenefit(benefit.id)}>
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
              Nenhum convênio encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Convênio" : "Adicionar Novo Convênio"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edite as informações do convênio selecionado."
                : "Preencha as informações para adicionar um novo convênio."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da empresa parceira" {...field} />
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
                        placeholder="Descreva o convênio detalhadamente" 
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
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desconto ou Benefício</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 15% de desconto em todos os serviços" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {benefitCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Logo (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="URL da imagem do logo da empresa" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Endereço completo da imagem (JPG, PNG ou SVG) do logo da empresa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informações de Contato (opcional)</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Phone className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                          <Input 
                            placeholder="Telefone, email ou nome de contato" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site (opcional)</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Globe className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                          <Input 
                            placeholder="https://www.exemplo.com.br" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status do Convênio</FormLabel>
                      <FormDescription>
                        Determine se o convênio está ativo e visível para os associados
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
                  {isEditMode ? "Salvar Alterações" : "Adicionar Convênio"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}