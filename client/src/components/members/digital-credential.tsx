import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { generateQRCodeUrl, downloadCredentialAsPDF } from "@/lib/qrcode";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/shared/logo";
import { useAuth } from "@/hooks/use-auth";

export default function DigitalCredential() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: credential,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/credentials/my"],
    queryFn: async () => {
      const response = await fetch("/api/credentials/my");
      if (!response.ok) {
        throw new Error("Failed to fetch credential");
      }
      return response.json();
    },
  });

  if (!user) {
    return null;
  }

  const handleDownload = async () => {
    if (!credential) return;
    
    try {
      setIsDownloading(true);
      await downloadCredentialAsPDF(credential.id, user.name);
      toast({
        title: "Download concluído",
        description: "Sua credencial foi baixada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar sua credencial. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Credencial atualizada",
      description: "Sua credencial foi atualizada com sucesso.",
    });
  };

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !credential) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-montserrat font-bold text-xl text-red-500 mb-2">Erro ao carregar credencial</h3>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar sua credencial. Verifique seu status de pagamento ou tente novamente mais tarde.
            </p>
            <Button onClick={handleRefresh} className="bg-primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const qrCodeUrl = generateQRCodeUrl(credential.credential_number);
  const expiryDate = new Date(credential.expiry_date).toLocaleDateString('pt-BR');
  const isValid = new Date(credential.expiry_date) > new Date();

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-primary">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={`Foto de ${user.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="font-montserrat font-bold text-xl text-center mb-1">
            {user.name}
          </h3>
          <p className="text-primary font-semibold text-center mb-3">
            {user.occupation}
          </p>
          <div className="w-32 h-32 mb-3 mx-auto">
            <img src={qrCodeUrl} alt="QR Code de validação" className="w-full h-full" />
          </div>
          <p className="text-gray-500 text-sm text-center">
            Credencial: <span className="font-semibold">{credential.credential_number}</span>
          </p>
          <p className="text-gray-500 text-sm text-center">
            Válida até: <span className="font-semibold">{expiryDate}</span>
          </p>
          {!isValid && (
            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-xs text-center">
              Sua credencial está expirada. Por favor, verifique seu status de pagamento.
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <Logo className="h-6" />
          </div>
        </div>
        
        <div className="flex justify-center mt-4 space-x-4">
          <Button
            onClick={handleDownload}
            className="bg-primary hover:bg-primary/90"
            disabled={isDownloading || !isValid}
          >
            {isDownloading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Baixar PDF
          </Button>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
