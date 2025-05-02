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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Award,
  Calendar,
  FileText,
  Download,
  Info,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  ListFilter,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Tipos para os certificados
interface Certificate {
  id: number;
  userId: number;
  type: "formacao_livre" | "pos_graduacao" | "eventos";
  titulo: string;
  descricao: string;
  cargaHoraria: number;
  dataEmissao: string;
  evento?: {
    id: number;
    titulo: string;
    tipo: string;
    dataInicio: string;
  }
}

export default function CertificatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Fetch user's certificates
  const {
    data: certificates,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/certificates"],
    enabled: !!user,
  });

  // Fetch payment status to check progress
  const { 
    data: paymentStatus
  } = useQuery({
    queryKey: [`/api/payments/status/${user?.id}`],
    enabled: !!user,
  });

  // Handle certificate download
  const handleDownload = async (id: number, title: string) => {
    setDownloadingId(id);
    try {
      const response = await fetch(`/api/certificates/${id}/download`);
      if (!response.ok) {
        throw new Error("Erro ao baixar certificado");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado_${title.replace(/\s+/g, "_").toLowerCase()}.pdf`;
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
        title: "Erro ao baixar certificado",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  // Filter certificates based on search query and type
  const filteredCertificates = certificates
    ? certificates.filter((cert) => {
        const matchesSearch =
          searchQuery === "" ||
          cert.titulo.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
          typeFilter === "all" || cert.type === typeFilter;

        return matchesSearch && matchesType;
      })
    : [];

  // Calculate progress for annual certification
  const calculateProgress = () => {
    if (!paymentStatus || !paymentStatus.memberSince) return 0;
    
    const memberSince = new Date(paymentStatus.memberSince);
    const now = new Date();
    const monthsActive = 
      (now.getFullYear() - memberSince.getFullYear()) * 12 +
      (now.getMonth() - memberSince.getMonth());
    
    // Cap at 12 months (100%)
    const progress = Math.min(Math.max(monthsActive / 12 * 100, 0), 100);
    return Math.round(progress);
  };

  const formatDateBR = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Get certificate type label
  const getCertificateTypeLabel = (type: string) => {
    switch (type) {
      case "formacao_livre":
        return "Formação Livre";
      case "pos_graduacao":
        return "Pós-Graduação";
      case "eventos":
        return "Eventos";
      default:
        return type;
    }
  };

  // Get certificate type badge color
  const getCertificateTypeBadgeColor = (type: string) => {
    switch (type) {
      case "formacao_livre":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pos_graduacao":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "eventos":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (!user) return null;

  const progress = calculateProgress();
  const isActive = paymentStatus?.status === "adimplente";

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Certificados</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acesse e faça download dos seus certificados de eventos e formação
          </p>
        </div>

        {/* Annual Certificate Progress */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Progresso para Certificação Anual
                </CardTitle>
                <CardDescription>
                  {isActive
                    ? "Mantenha sua assinatura em dia para receber seu certificado após 12 meses."
                    : "Sua assinatura está inadimplente. Regularize seu pagamento para continuar o progresso."}
                </CardDescription>
              </div>
              <Badge variant={isActive ? "outline" : "destructive"}>
                {isActive ? "Ativo" : "Parado"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Progresso: {progress}%
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.min(Math.round(progress / 100 * 12), 12)}/12 meses
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded-full ${progress >= 100 ? "bg-green-100" : "bg-gray-100"}`}>
                  <CheckCircle className={`h-4 w-4 ${progress >= 100 ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">Associado há 12 meses completos</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {progress >= 100
                      ? "Você já completou o período mínimo para certificação."
                      : `Você precisa completar ${12 - Math.min(Math.round(progress / 100 * 12), 12)} meses para atingir o período mínimo.`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded-full ${isActive ? "bg-green-100" : "bg-red-100"}`}>
                  <CheckCircle className={`h-4 w-4 ${isActive ? "text-green-600" : "text-red-600"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">Assinatura Ativa</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {isActive
                      ? "Sua assinatura está ativa e em dia."
                      : "Regularize sua assinatura para continuar o progresso."}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded-full ${
                  (certificates?.some(c => c.type === "formacao_livre" || c.type === "pos_graduacao"))
                    ? "bg-green-100" : "bg-gray-100"
                }`}>
                  <CheckCircle className={`h-4 w-4 ${
                    (certificates?.some(c => c.type === "formacao_livre" || c.type === "pos_graduacao"))
                      ? "text-green-600" : "text-gray-400"
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium">Certificado Emitido</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {(certificates?.some(c => c.type === "formacao_livre" || c.type === "pos_graduacao"))
                      ? "Você já possui certificado anual emitido."
                      : progress >= 100
                        ? "Seu certificado será emitido em breve pela administração."
                        : "Seu certificado será emitido quando você completar os requisitos."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          {!isActive && (
            <CardFooter className="pt-0">
              <Button className="bg-primary w-full" asChild>
                <a href="/payment-required">Regularizar Pagamento</a>
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Certificate List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Meus Certificados</CardTitle>
            <CardDescription>
              Acesse todos os seus certificados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Pesquisar por título..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <ListFilter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por tipo" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="formacao_livre">Formação Livre</SelectItem>
                    <SelectItem value="pos_graduacao">Pós-Graduação</SelectItem>
                    <SelectItem value="eventos">Eventos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-4 border rounded-lg animate-pulse">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-9 w-24" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar certificados</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Não foi possível carregar seus certificados. Tente novamente mais tarde."}
                </AlertDescription>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  Tentar novamente
                </Button>
              </Alert>
            ) : filteredCertificates.length > 0 ? (
              <div className="space-y-4">
                {filteredCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
                  >
                    <div className="mb-3 md:mb-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={getCertificateTypeBadgeColor(cert.type)}
                        >
                          {getCertificateTypeLabel(cert.type)}
                        </Badge>
                        {cert.cargaHoraria && (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {cert.cargaHoraria}h
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-base">{cert.titulo}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Emitido em {formatDateBR(cert.dataEmissao)}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(cert.id, cert.titulo)}
                      disabled={downloadingId === cert.id}
                      className="bg-primary mt-2 md:mt-0"
                    >
                      {downloadingId === cert.id ? (
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
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Nenhum certificado encontrado</AlertTitle>
                <AlertDescription>
                  {searchQuery || typeFilter !== "all"
                    ? "Não encontramos certificados que correspondam à sua pesquisa. Tente outros termos ou remova os filtros."
                    : "Você ainda não possui certificados. Participe dos eventos e mantenha sua assinatura em dia para receber certificados."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Informações sobre Certificados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              A UBPCT oferece diferentes tipos de certificados para seus associados:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2">Certificado de Formação Livre</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Emitido para associados não-graduados após 12 meses de assinatura 
                  ativa ininterrupta. Atesta a formação em Psicanálise Clínica e Terapêutica.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2">Certificado de Pós-Graduação</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Emitido para associados graduados após 12 meses de assinatura 
                  ativa ininterrupta. Em parceria com a Faculdade Dynamus.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2">Certificados de Eventos</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Emitidos após participação em eventos específicos que 
                  oferecem certificação, como palestras, workshops e cursos.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium mb-2">Validação de Certificados</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Todos os certificados emitidos pela UBPCT contêm um 
                  código de verificação que pode ser validado no site.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}