import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, PenSquare, Trash2, Eye, Upload, BookOpen, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Definir categorias de ebooks comuns
const ebookCategories = [
  "Psicanálise Clínica",
  "Terapia Cognitiva",
  "Neuropsicologia",
  "Psicopatologia",
  "Psicanálise Infantil",
  "Psiquiatria",
  "Saúde Mental",
  "Relações Humanas",
  "Artigos Científicos",
  "Material Didático"
];

// Esquema de validação para o formulário de ebook
const ebookFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  author: z.string().min(3, "O autor deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  category: z.string().min(3, "A categoria deve ter pelo menos 3 caracteres"),
  cover_url: z.string().url("A URL da capa deve ser uma URL válida"),
  file_url: z.string().url("A URL do arquivo deve ser uma URL válida"),
});

type EbookFormValues = z.infer<typeof ebookFormSchema>;

export default function AdminEbooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEbookId, setCurrentEbookId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Formulário de ebook
  const form = useForm<EbookFormValues>({
    resolver: zodResolver(ebookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      category: "",
      cover_url: "",
      file_url: "",
    },
  });

  // Consulta para obter ebooks
  const { data: ebooks = [], isLoading } = useQuery({
    queryKey: ["/api/ebooks"],
    queryFn: getQueryFn(),
    retry: false,
  });

  // Mutação para criar novo ebook
  const createEbookMutation = useMutation({
    mutationFn: async (data: EbookFormValues) => {
      return await apiRequest("POST", "/api/ebooks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ebooks"] });
      toast({
        title: "E-book adicionado",
        description: "O e-book foi adicionado com sucesso à biblioteca.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o e-book. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutação para atualizar ebook
  const updateEbookMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EbookFormValues }) => {
      return await apiRequest("PUT", `/api/ebooks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ebooks"] });
      toast({
        title: "E-book atualizado",
        description: "O e-book foi atualizado com sucesso.",
      });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setCurrentEbookId(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o e-book. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutação para excluir ebook
  const deleteEbookMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/ebooks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ebooks"] });
      toast({
        title: "E-book excluído",
        description: "O e-book foi excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o e-book. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Obter categorias únicas dos ebooks
  const uniqueCategories = Array.isArray(ebooks) 
    ? ebooks
        .map((ebook: any) => ebook.category)
        .filter((value: string, index: number, self: string[]) => 
          self.indexOf(value) === index && value
        )
    : [];

  // Filtrar os ebooks
  const filteredEbooks = Array.isArray(ebooks) 
    ? ebooks.filter((ebook: any) => {
        const matchesSearch = searchQuery === "" || 
          ebook.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          ebook.author?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === "all" || 
          ebook.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
      })
    : [];

  // Função para carregar dados do ebook para edição
  const handleEditEbook = (ebook: any) => {
    form.reset({
      title: ebook.title,
      author: ebook.author,
      description: ebook.description,
      category: ebook.category,
      cover_url: ebook.cover_url,
      file_url: ebook.file_url,
    });
    setCurrentEbookId(ebook.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Função para abrir modal de adição
  const handleAddNewEbook = () => {
    form.reset({
      title: "",
      author: "",
      description: "",
      category: "",
      cover_url: "",
      file_url: "",
    });
    setIsEditMode(false);
    setCurrentEbookId(null);
    setIsDialogOpen(true);
  };

  // Função para confirmar exclusão do ebook
  const handleDeleteEbook = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este e-book? Esta ação não poderá ser desfeita.")) {
      deleteEbookMutation.mutate(id);
    }
  };

  // Enviar formulário
  const onSubmit = (data: EbookFormValues) => {
    if (isEditMode && currentEbookId) {
      updateEbookMutation.mutate({ id: currentEbookId, data });
    } else {
      createEbookMutation.mutate(data);
    }
  };

  return (
    <AdminShell title="Gestão de E-books">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Biblioteca Digital</CardTitle>
          <CardDescription>
            Gerencie o catálogo de e-books e materiais digitais disponíveis para os associados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por título ou autor..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {uniqueCategories.map((category: string) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button className="gap-2" onClick={handleAddNewEbook}>
              <Plus className="h-4 w-4" />
              <span>Adicionar E-book</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de E-books</CardTitle>
          <CardDescription>
            Total: {filteredEbooks.length} e-books{" "}
            {categoryFilter !== "all" && (
              <>na categoria "{categoryFilter}"</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredEbooks.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-book</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEbooks.map((ebook: any) => (
                    <TableRow key={ebook.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {ebook.cover_url ? (
                              <img src={ebook.cover_url} alt={ebook.title} className="object-cover w-full h-full" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{ebook.title}</p>
                            <p className="text-xs text-muted-foreground">{ebook.description.substring(0, 60)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{ebook.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ebook.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={ebook.file_url} target="_blank" rel="noreferrer">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Visualizar</span>
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={ebook.file_url} download>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditEbook(ebook)}>
                            <PenSquare className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteEbook(ebook.id)}>
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
            <div className="text-center py-8 text-muted-foreground">
              Nenhum e-book encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar E-book" : "Adicionar Novo E-book"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edite as informações do e-book selecionado."
                : "Preencha as informações para adicionar um novo e-book à biblioteca."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do e-book" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do autor" {...field} />
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
                        placeholder="Descreva o conteúdo do e-book" 
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {ebookCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Ou digite uma nova categoria personalizada
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ou digite uma nova categoria</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ex: Saúde Mental" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="cover_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Capa</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="URL da imagem de capa" 
                          {...field} 
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Cole a URL da imagem de capa (JPG, PNG) ou use o botão para fazer upload
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Arquivo</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="URL do arquivo PDF" 
                          {...field} 
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Cole a URL do arquivo PDF ou use o botão para fazer upload
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
                  {isEditMode ? "Salvar Alterações" : "Adicionar E-book"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}