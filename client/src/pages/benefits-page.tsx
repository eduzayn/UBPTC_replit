import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Handshake,
  Search,
  AlertCircle,
  ExternalLink,
  Tag,
  Info,
  Heart,
  ShieldCheck,
  Stethoscope,
  Pill,
  BookOpen,
  GraduationCap,
  Percent,
  ListFilter,
  MapPin,
  Phone,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Benefit {
  id: number;
  title: string;
  description: string;
  category: "saude" | "educacao" | "servicos" | "produtos";
  discount: string;
  partner: string;
  website?: string;
  address?: string;
  phone?: string;
  logo?: string;
  featured: boolean;
}

export default function BenefitsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch all benefits
  const {
    data: benefits,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/benefits"],
    enabled: !!user,
  });

  // Filter benefits based on search query and category
  const filteredBenefits = benefits
    ? benefits.filter((benefit) => {
        const matchesSearch =
          searchQuery === "" ||
          benefit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          benefit.partner.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          categoryFilter === "all" || benefit.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
    : [];

  // Get featured benefits
  const featuredBenefits = benefits
    ? benefits.filter((benefit) => benefit.featured)
    : [];

  // Get category icon and label
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "saude":
        return {
          icon: <Stethoscope className="h-4 w-4 mr-2" />,
          label: "Saúde",
          badgeColor: "bg-green-100 text-green-800 border-green-300",
        };
      case "educacao":
        return {
          icon: <GraduationCap className="h-4 w-4 mr-2" />,
          label: "Educação",
          badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
        };
      case "servicos":
        return {
          icon: <ShieldCheck className="h-4 w-4 mr-2" />,
          label: "Serviços",
          badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
        };
      case "produtos":
        return {
          icon: <Pill className="h-4 w-4 mr-2" />,
          label: "Produtos",
          badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
        };
      default:
        return {
          icon: <Tag className="h-4 w-4 mr-2" />,
          label: "Outros",
          badgeColor: "bg-gray-100 text-gray-800 border-gray-300",
        };
    }
  };

  if (!user) return null;

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Convênios e Benefícios</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acesse descontos e parcerias exclusivas para associados da UBPCT
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Pesquisar benefícios ou parceiros..."
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
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="produtos">Produtos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="mb-10">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              <Handshake className="mr-2 h-4 w-4" />
              Todos os Benefícios
            </TabsTrigger>
            <TabsTrigger value="featured">
              <Heart className="mr-2 h-4 w-4" />
              Destaques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar benefícios</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Não foi possível carregar os benefícios. Tente novamente mais tarde."}
                </AlertDescription>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  Tentar novamente
                </Button>
              </Alert>
            ) : featuredBenefits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredBenefits.map((benefit) => {
                  const { icon, label, badgeColor } = getCategoryInfo(
                    benefit.category
                  );
                  return (
                    <Card key={benefit.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-primary">Destaque</Badge>
                          <Badge variant="outline" className={badgeColor}>
                            <div className="flex items-center">
                              {icon}
                              <span>{label}</span>
                            </div>
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2">
                          {benefit.title}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-1 text-green-600" />
                            <span className="font-semibold text-green-600">
                              {benefit.discount}
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {benefit.description}
                        </p>
                        {(benefit.address || benefit.phone) && (
                          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                            {benefit.address && (
                              <div className="flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{benefit.address}</span>
                              </div>
                            )}
                            {benefit.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{benefit.phone}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        {benefit.website ? (
                          <Button className="bg-primary" asChild>
                            <a
                              href={benefit.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Acessar
                            </a>
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Para mais informações, entre em contato com o parceiro
                          </span>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Nenhum destaque disponível</AlertTitle>
                <AlertDescription>
                  No momento não temos benefícios em destaque. Confira todos os
                  benefícios disponíveis.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="all">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar benefícios</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Não foi possível carregar os benefícios. Tente novamente mais tarde."}
                </AlertDescription>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  Tentar novamente
                </Button>
              </Alert>
            ) : filteredBenefits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredBenefits.map((benefit) => {
                  const { icon, label, badgeColor } = getCategoryInfo(
                    benefit.category
                  );
                  return (
                    <Card key={benefit.id} className="h-full flex flex-col">
                      <CardHeader>
                        <Badge variant="outline" className={badgeColor}>
                          <div className="flex items-center">
                            {icon}
                            <span>{label}</span>
                          </div>
                        </Badge>
                        <CardTitle className="mt-2 line-clamp-2">
                          {benefit.title}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-1 text-green-600" />
                            <span className="font-semibold text-green-600">
                              {benefit.discount}
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {benefit.description}
                        </p>
                        {(benefit.address || benefit.phone) && (
                          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                            {benefit.address && (
                              <div className="flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{benefit.address}</span>
                              </div>
                            )}
                            {benefit.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{benefit.phone}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        {benefit.website ? (
                          <Button className="bg-primary" asChild>
                            <a
                              href={benefit.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Acessar
                            </a>
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Para mais informações, entre em contato com o parceiro
                          </span>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Nenhum benefício encontrado</AlertTitle>
                <AlertDescription>
                  Não encontramos benefícios que correspondam à sua pesquisa.
                  Tente outros termos ou remova os filtros.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Handshake className="h-5 w-5 mr-2 text-primary" />
              Sobre Convênios e Benefícios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              A UBPCT mantém parcerias com diversas empresas e instituições para oferecer
              benefícios exclusivos a seus associados. Estes benefícios incluem descontos em
              serviços de saúde, educação, produtos e serviços diversos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                  Benefícios em Saúde
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Descontos em consultas médicas, exames, planos de saúde,
                  farmácias e clínicas parceiras.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                  Benefícios em Educação
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Descontos em cursos, especializações, livros, eventos e materiais
                  educacionais em instituições parceiras.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  Como Utilizar
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Para utilizar os benefícios, basta apresentar sua credencial digital 
                  ou número de associado nos estabelecimentos parceiros.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                  Novas Parcerias
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Estamos sempre buscando novas parcerias. Se você conhece uma empresa
                  que poderia se tornar parceira, entre em contato com a administração.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}