import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
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
import { 
  Download, 
  QrCode, 
  Shield, 
  Info, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function CredentialPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Fetch user's credential
  const {
    data: credential,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["/api/credentials/my"],
    enabled: !!user,
  });

  // Fetch payment status to check if user is eligible
  const { 
    data: paymentStatus
  } = useQuery({
    queryKey: [`/api/payments/status/${user?.id}`],
    enabled: !!user,
  });

  const isActive = paymentStatus?.status === "adimplente";
  const expiryDate = credential?.validade 
    ? new Date(credential.validade).toLocaleDateString("pt-BR") 
    : null;

  const handleDownloadPdf = async () => {
    if (!credential || !user) return;
    
    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/credentials/${credential.id}/download`);
      if (!response.ok) {
        throw new Error("Erro ao baixar credencial");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credencial_${user.name.replace(/\s+/g, '_').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Erro ao baixar credencial",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (!user) return null;

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minha Credencial Digital</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sua identificação profissional como associado da UBPCT
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              <Skeleton className="h-64 w-96 rounded-xl mb-6" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        ) : isError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar credencial</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Não foi possível carregar sua credencial. Tente novamente mais tarde."}
            </AlertDescription>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </Alert>
        ) : credential ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <CardTitle>Sua Credencial</CardTitle>
                    {isActive ? (
                      <Badge className="bg-green-500">Ativa</Badge>
                    ) : (
                      <Badge variant="destructive">Suspensa</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {isActive 
                      ? `Válida até ${expiryDate}` 
                      : "Sua credencial está suspensa devido a pendências no pagamento"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex flex-col items-center">
                  <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 rounded-xl w-full max-w-md mx-auto shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-xl font-bold">UNIÃO BRASILEIRA</h2>
                        <p className="text-sm">de Psicanálise Clínica e Terapêutica</p>
                      </div>
                      <Shield className="h-10 w-10 text-blue-300" />
                    </div>
                    
                    <div className="bg-white text-blue-900 p-3 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold">REGISTRO</p>
                        <p className="text-sm font-mono">{credential.numeroCredencial}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs uppercase mb-1">NOME</p>
                      <p className="font-semibold">{user.name}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs uppercase mb-1">OCUPAÇÃO</p>
                      <p className="font-semibold">{credential.ocupacao || user.occupation}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase mb-1">EMISSÃO</p>
                        <p className="font-semibold">{new Date(credential.dataEmissao).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase mb-1">VALIDADE</p>
                        <p className="font-semibold">{expiryDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      {credential.qrCodeUrl && (
                        <div className="bg-white p-2 rounded">
                          <img 
                            src={credential.qrCodeUrl} 
                            alt="QR Code para validação" 
                            className="h-24 w-24"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-8">
                    <Button 
                      className="bg-primary"
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf || !isActive}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {downloadingPdf ? "Baixando..." : "Baixar em PDF"}
                    </Button>
                    
                    <Button variant="outline">
                      <QrCode className="mr-2 h-4 w-4" />
                      Ver QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Sobre sua Credencial
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      Sua credencial digital serve como comprovante oficial de associação à UBPCT. 
                      Ela contém um QR Code para verificação da autenticidade e status atual.
                    </p>
                    
                    <div className="flex items-start gap-2">
                      {isActive ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">Status: {isActive ? "Ativa" : "Suspensa"}</p>
                        <p className="text-sm text-muted-foreground">
                          {isActive 
                            ? "Sua credencial está ativa e pode ser utilizada." 
                            : "Regularize sua assinatura para reativar sua credencial."}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm">
                      Caso precise de uma credencial física impressa, utilize a 
                      opção "Baixar em PDF" e imprima o documento gerado.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <QrCode className="h-4 w-4 mr-2" />
                      Verificação de Autenticidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      Qualquer pessoa pode verificar a autenticidade da sua credencial 
                      através do QR Code ou do link de validação:
                    </p>
                    
                    <div className="bg-muted p-3 rounded text-sm font-mono break-all">
                      {`${window.location.origin}/validate/${credential.numeroCredencial}`}
                    </div>
                  </CardContent>
                </Card>
                
                {!isActive && (
                  <Alert variant="warning" className="bg-amber-50 border-amber-500">
                    <AlertCircle className="h-4 w-4 text-amber-800" />
                    <AlertTitle>Credencial suspensa</AlertTitle>
                    <AlertDescription>
                      Sua credencial está suspensa devido a pendências no pagamento. 
                      Regularize seu pagamento para reativar sua credencial.
                    </AlertDescription>
                    <Button className="mt-2 bg-primary" asChild>
                      <a href="/payment-required">Regularizar Pagamento</a>
                    </Button>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Credencial não encontrada</AlertTitle>
            <AlertDescription>
              Não foi possível encontrar uma credencial associada ao seu cadastro.
              Entre em contato com o suporte para mais informações.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </AppShell>
  );
}