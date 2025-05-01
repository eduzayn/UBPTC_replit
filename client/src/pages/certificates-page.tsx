import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Award, AlertCircle, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Certificate {
  id: number;
  type: string;
  issueDate: string;
  expiryDate: string | null;
  fileUrl: string;
  eventId?: number;
}

export default function CertificatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const { data: certificates, isLoading, error } = useQuery({
    queryKey: ['/api/certificates'],
    enabled: !!user,
  });

  const filteredCertificates = certificates?.filter(cert => {
    if (filter === "all") return true;
    return cert.type === filter;
  });

  const handleDownload = async (certificateId: number) => {
    try {
      setIsDownloading(certificateId);
      
      const response = await fetch(`/api/certificates/${certificateId}/download`);
      
      if (!response.ok) {
        throw new Error("Failed to download certificate");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-ubpct-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download iniciado",
        description: "Seu certificado está sendo baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o certificado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  const getCertificateTitle = (type: string) => {
    switch (type) {
      case "formacao_livre":
        return "Certificado de Formação Livre em Psicanálise Clínica e Terapêutica";
      case "pos_graduacao":
        return "Certificado de Pós-Graduação em Psicanálise Clínica e Terapêutica";
      case "evento":
        return "Certificado de Participação em Evento";
      default:
        return "Certificado";
    }
  };

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case "formacao_livre":
      case "pos_graduacao":
        return <Award className="h-10 w-10 text-primary" />;
      case "evento":
        return <FileText className="h-10 w-10 text-primary" />;
      default:
        return <Award className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certificados</h1>
        <p className="text-gray-600">
          Visualize e baixe seus certificados da UBPCT
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold mb-1">Sobre os Certificados</h2>
          <p className="text-gray-600">
            A UBPCT emite certificados para eventos e um certificado anual após 12 meses de associação adimplente.
            {user?.graduated 
              ? " Por ser graduado, você recebe um Certificado de Pós-Graduação." 
              : " Você recebe um Certificado de Formação Livre."}
          </p>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar certificados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os certificados</SelectItem>
              <SelectItem value="formacao_livre">Formação Livre</SelectItem>
              <SelectItem value="pos_graduacao">Pós-Graduação</SelectItem>
              <SelectItem value="evento">Eventos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar certificados</h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            Não foi possível carregar seus certificados. Por favor, tente novamente mais tarde.
          </p>
        </div>
      ) : filteredCertificates && filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  {getCertificateIcon(certificate.type)}
                  <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                    Emitido em {certificate.issueDate}
                  </div>
                </div>
                <CardTitle className="mt-3">{getCertificateTitle(certificate.type)}</CardTitle>
                <CardDescription>
                  {certificate.expiryDate 
                    ? `Válido até ${certificate.expiryDate}` 
                    : "Sem data de expiração"}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-1">
                <Button 
                  onClick={() => handleDownload(certificate.id)} 
                  className="w-full bg-primary"
                  disabled={isDownloading === certificate.id}
                >
                  {isDownloading === certificate.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Baixar Certificado
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Nenhum certificado encontrado</h3>
            <p className="text-gray-500 text-center max-w-md mb-2">
              {filter !== "all" 
                ? `Você não possui certificados do tipo "${filter}" no momento.` 
                : "Você ainda não possui certificados."}
            </p>
            <p className="text-gray-500 text-center max-w-md">
              Certificados de formação são emitidos após 12 meses de assinatura ativa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
