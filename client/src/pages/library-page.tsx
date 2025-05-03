import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { MemberShell } from "../components/member/member-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  BookOpen,
  Search,
  Download,
  FileText,
  Tag,
  Calendar,
  ChevronRight,
  Bookmark,
  ListFilter,
  BookMarked,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function LibraryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [downloading, setDownloading] = useState<number | null>(null);

  // Fetch all e-books
  const {
    data: ebooks,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/ebooks"],
    enabled: !!user,
  });

  // Function to handle e-book download
  const handleDownload = async (ebookId: number, title: string) => {
    setDownloading(ebookId);
    try {
      const response = await fetch(`/api/ebooks/${ebookId}/download`);
      if (!response.ok) {
        throw new Error("Erro ao baixar e-book");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download iniciado",
        description: "Seu download começou automaticamente",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar e-book",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  // Filter e-books based on search query and category
  const filteredEbooks = ebooks
    ? ebooks.filter((ebook) => {
        const matchesSearch =
          searchQuery === "" ||
          ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ebook.autor &&
            ebook.autor.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          categoryFilter === "all" || ebook.categoria === categoryFilter;

        return matchesSearch && matchesCategory;
      })
    : [];

  // Extract unique categories for the filter
  const categories = ebooks
    ? Array.from(
        new Set(
          ebooks
            .map((ebook) => ebook.categoria)
            .filter((categoria) => categoria)
        )
      )
    : [];

  // Get featured e-books (newest 3)
  const featuredEbooks = ebooks
    ? [...ebooks]
        .sort(
          (a, b) =>
            new Date(b.dataUpload).getTime() - new Date(a.dataUpload).getTime()
        )
        .slice(0, 3)
    : [];

  if (!user) return null;

  return (
    <MemberShell title="Biblioteca Digital">
      <div>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Acesse nossa biblioteca de e-books exclusivos para associados
        </p>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Pesquisar por título ou autor..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <ListFilter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por categoria" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Alert variant="destructive" className="mb-6">
            <FileText className="h-4 w-4" />
            <AlertTitle>Erro ao carregar e-books</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Não foi possível carregar a biblioteca. Tente novamente mais tarde."}
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => refetch()}
            >
              Tentar novamente
            </Button>
          </Alert>
        ) : (
          <Tabs defaultValue="all" className="mb-10">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                <BookOpen className="mr-2 h-4 w-4" />
                Todos os E-books
              </TabsTrigger>
              <TabsTrigger value="featured">
                <BookMarked className="mr-2 h-4 w-4" />
                Destaques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="featured">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredEbooks.length > 0 ? (
                  featuredEbooks.map((ebook) => (
                    <Card key={ebook.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-primary">Destaque</Badge>
                          {ebook.categoria && (
                            <Badge variant="outline">{ebook.categoria}</Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2">
                          {ebook.title}
                        </CardTitle>
                        {ebook.autor && (
                          <CardDescription>
                            <span className="text-sm font-medium">
                              {ebook.autor}
                            </span>
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(ebook.dataUpload).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                        {ebook.descricao && (
                          <p className="text-sm line-clamp-3">
                            {ebook.descricao}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        <Button
                          className="bg-primary"
                          onClick={() =>
                            handleDownload(ebook.id, ebook.title)
                          }
                          disabled={downloading === ebook.id}
                        >
                          {downloading === ebook.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Baixando...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3">
                    <Alert>
                      <BookOpen className="h-4 w-4" />
                      <AlertTitle>Nenhum destaque disponível</AlertTitle>
                      <AlertDescription>
                        No momento não temos e-books em destaque. Confira nossa
                        biblioteca completa.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all">
              {filteredEbooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEbooks.map((ebook) => (
                    <Card key={ebook.id} className="h-full flex flex-col">
                      <CardHeader>
                        {ebook.categoria && (
                          <div className="flex items-center mb-2">
                            <Tag className="h-4 w-4 text-primary mr-2" />
                            <Badge variant="outline">{ebook.categoria}</Badge>
                          </div>
                        )}
                        <CardTitle className="line-clamp-2">
                          {ebook.title}
                        </CardTitle>
                        {ebook.autor && (
                          <CardDescription>
                            <span className="text-sm font-medium">
                              {ebook.autor}
                            </span>
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(ebook.dataUpload).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                        {ebook.descricao && (
                          <p className="text-sm line-clamp-3">
                            {ebook.descricao}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        <Button
                          className="bg-primary"
                          onClick={() =>
                            handleDownload(ebook.id, ebook.title)
                          }
                          disabled={downloading === ebook.id}
                        >
                          {downloading === ebook.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Baixando...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <Search className="h-4 w-4" />
                  <AlertTitle>Nenhum resultado encontrado</AlertTitle>
                  <AlertDescription>
                    Não encontramos e-books que correspondam à sua pesquisa.
                    Tente outros termos ou remova os filtros.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Bookmark className="h-5 w-5 mr-2 text-primary" />
              Sobre a Biblioteca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Nossa biblioteca digital contém materiais exclusivos para uso dos
              associados da UBPCT, incluindo artigos, livros e publicações
              relacionadas à psicanálise clínica e terapêutica.
            </p>
            <p className="text-sm">
              Todo o conteúdo disponibilizado é de uso pessoal e não deve ser
              redistribuído sem autorização. Novos materiais são adicionados
              regularmente.
            </p>
          </CardContent>
        </Card>
      </div>
    </MemberShell>
  );
}