import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Logo from "@/components/shared/logo";

interface ValidationResult {
  isValid: boolean;
  member?: {
    name: string;
    occupation: string;
    status: string;
    validUntil: string;
  };
  message?: string;
}

export default function ValidateCredentialPage() {
  const { credentialId } = useParams();
  
  const { data, isLoading, error } = useQuery<ValidationResult>({
    queryKey: [`/api/validate/${credentialId}`],
    queryFn: async () => {
      const res = await fetch(`/api/validate/${credentialId}`);
      if (!res.ok) throw new Error("Falha ao validar credencial");
      return res.json();
    },
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Logo className="h-12 w-12" />
            <div className="ml-3">
              <h1 className="text-xl font-bold">UBPCT</h1>
              <p className="text-sm text-gray-600">Sistema de Validação de Credencial</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Validação de Credencial UBPCT</CardTitle>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-gray-600">Verificando credencial...</p>
              </div>
            ) : error ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-700 mb-2">Credencial Inválida</h2>
                <p className="text-gray-600 text-center">
                  A credencial informada não foi encontrada ou não é válida.
                </p>
              </div>
            ) : data?.isValid ? (
              <div className="py-4">
                <div className="flex flex-col items-center mb-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-xl font-bold text-green-700 mb-1">Credencial Válida</h2>
                  <p className="text-sm text-gray-500">Verificada em {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="font-bold text-xl mb-1">{data.member?.name}</h3>
                  <p className="text-primary font-semibold">{data.member?.occupation}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{data.member?.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Válida até</p>
                        <p className="font-medium">{data.member?.validUntil}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Esta credencial confirma que o profissional acima é um associado ativo da 
                    União Brasileira de Psicanálise Clínica e Terapêutica.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center">
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-700 mb-2">Credencial Inválida</h2>
                <p className="text-gray-600 text-center mb-4">
                  {data?.message || "Esta credencial não é válida ou está expirada."}
                </p>
                
                {data?.member && (
                  <div className="bg-gray-50 p-4 rounded-md w-full">
                    <h3 className="font-bold text-lg mb-1">{data.member.name}</h3>
                    <p className="text-gray-600">{data.member.occupation}</p>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium text-red-600">{data.member.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Válida até</p>
                          <p className="font-medium">{data.member.validUntil}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o site
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} UBPCT - União Brasileira de Psicanálise Clínica e Terapêutica
          </p>
        </div>
      </footer>
    </div>
  );
}
