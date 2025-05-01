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
  DialogTrigger,
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
  Book,
  FileUp,
  X
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Ebook {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  file_url: string;
  category: string;
  created_at: string;
}

// Schema for ebook form
const ebookSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  author: z.string().min(3, "O autor deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  category: z.string().min(2, "Selecione uma categoria"),
  cover_url: z.string().url("Insira uma URL válida para a capa"),
  file_url: z.string().url("Insira uma URL válida para o arquivo"),
});

type EbookFormValues = z.infer<typeof ebookSchema>;

export default function AdminEbooksPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [ebookToDelete, setEbookToDelete] = useState<Ebook | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch ebooks
  const { data: ebooks, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/ebooks'],
    enabled: !!user && user.role === "admin",
  });

  // Form for adding/editing ebooks
  const form = useForm<EbookFormValues>({
    resolver: zodResolver(ebookSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      category: "",
      cover_url: "",
      file_url: "",
    },
  });

  // Reset form when editing ebook changes
  useEffect(() => {
    if (editingEbook) {
      form.reset({
        title: editingEbook.title,
        author: editingEbook.author,
        description: editingEbook.description,
        category: editingEbook.category,
        cover_url: editingEbook.cover_url,
        file_url: editingEbook.file_url,
      });
    } else {
      form.reset({
        title: "",
        author: "",
        description: "",
        category: "",
        cover_url: "",
        file_url: "",
      });
    }
  }, [editingEbook, form]);

  // Create ebook mutation
  const createEbookMutation = useMutation({
    mutationFn: async (data: EbookFormValues) => {
      const response = await apiRequest("POST", "/api/ebooks", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "E-book adicionado",
        description: "O e-book foi adicionado com sucesso.",
      });
      setIsAddDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/ebooks'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar e-book",
        description: error.message || "Ocorreu um erro ao adicionar o e-book. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Update ebook mutation
  const updateEbookMutation = useMutation({
    mutationFn: async (data: EbookFormValues & { id: number }) => {
      const { id, ...ebookData } = data;
      const response = await apiRequest("PUT", `/api/ebooks/${id}`, ebookData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "E-book atualizado",
        description: "O e-book foi atualizado com sucesso.",
      });
      setIsAddDialogOpen(false);
      setEditingEbook(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/ebooks'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar e-book",
        description: error.message || "Ocorreu um erro ao atualizar o e-book. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Delete ebook mutation
  const deleteEbookMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/ebooks/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "E-book excluído",
        description: "O e-book foi excluído com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setEbookToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['/api/ebooks'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir e-book",
        description: error.message || "Ocorreu um erro ao excluir o e-book. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EbookFormValues) => {
    if (editingEbook) {
      updateEbookMutation.mutate({ ...data, id: editingEbook.id });
    } else {
      createEbookMutation.mutate(data);
    }
  };

  const handleDeleteEbook = () => {
    if (ebookToDelete) {
      deleteEbookMutation.mutate(ebookToDelete.id);
    }
  };

  if (!user || user.role !== "admin") return null;

  // Filter ebooks based on search and category
  const filteredEbooks = ebooks?.filter(ebook => {
    const matchesSearch = 
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      ebook.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = ebooks 
    ? [...new Set(ebooks.map(ebook => ebook.category))]
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de E-books</h1>
          <p className="text-gray-600">
            Administre a biblioteca digital da UBPCT
          </p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-primary"
          onClick={() => {
            setEditingEbook(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Adicionar E-book
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>
            Encontre e-books específicos usando os filtros abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar por título, autor ou descrição..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
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
            <Card key={index} className="h-96 animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <p className="text-red-500 mb-4">
              Ocorreu um erro ao carregar os e-books. Por favor, tente novamente mais tarde.
            </p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        ) : filteredEbooks && filteredEbooks.length > 0 ? (
          filteredEbooks.map((ebook) => (
            <Card key={ebook.id} className="overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <img 
                  src={ebook.cover_url} 
                  alt={`Capa de ${ebook.title}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 bg-white shadow-md"
                    onClick={() => {
                      setEditingEbook(ebook);
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      setEbookToDelete(ebook);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="mb-1 text-sm text-gray-500">
                  Categoria: {ebook.category.charAt(0).toUpperCase() + ebook.category.slice(1)}
                </div>
                <h3 className="text-lg font-semibold mb-1">{ebook.title}</h3>
                <p className="text-sm text-gray-600 mb-2">por {ebook.author}</p>
                <p className="text-sm text-gray-600 line-clamp-3 mb-auto">
                  {ebook.description}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Adicionado em {formatDate(ebook.created_at)}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <a href={ebook.file_url} target="_blank" rel="noopener noreferrer">
                    <Book className="h-4 w-4 mr-2" />
                    Ver Arquivo
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 mb-4">
              Nenhum e-book encontrado com os filtros atuais.
            </p>
            {(searchTerm || categoryFilter !== "all") && (
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit E-book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEbook ? "Editar E-book" : "Adicionar Novo E-book"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {editingEbook ? "editar o" : "adicionar um novo"} e-book à biblioteca.
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
                          <Input placeholder="Título do e-book" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do autor" {...field} />
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
                      <FormLabel>Categoria *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="psicanálise">Psicanálise</SelectItem>
                          <SelectItem value="terapia">Terapia</SelectItem>
                          <SelectItem value="diagnóstico">Diagnóstico</SelectItem>
                          <SelectItem value="desenvolvimento">Desenvolvimento Profissional</SelectItem>
                          <SelectItem value="estudos">Estudos de Caso</SelectItem>
                        </SelectContent>
                      </Select>
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
                            placeholder="Descreva o conteúdo do e-book" 
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
                  name="cover_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Capa *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/capa.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Insira o link para a imagem de capa
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
                      <FormLabel>URL do Arquivo *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/ebook.pdf" {...field} />
                      </FormControl>
                      <FormDescription>
                        Insira o link para o arquivo PDF
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
                    setEditingEbook(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary"
                  disabled={createEbookMutation.isPending || updateEbookMutation.isPending}
                >
                  {(createEbookMutation.isPending || updateEbookMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingEbook ? "Salvar Alterações" : "Adicionar E-book"}
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
              Você está prestes a excluir o e-book <span className="font-semibold">{ebookToDelete?.title}</span>. 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setEbookToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEbook}
              disabled={deleteEbookMutation.isPending}
            >
              {deleteEbookMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir E-book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
