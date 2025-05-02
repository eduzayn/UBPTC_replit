import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AppShell } from "../components/ui/app-shell";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CreditCard, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PaymentRequiredPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Se o usuário não estiver logado, redirecionar para a página de login
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  async function handleCreatePaymentLink(plan: "monthly" | "annual") {
    if (!user) return;

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/payments/update-method", {
        userId: user.id,
        plan: plan
      });
      
      const data = await response.json();
      setPaymentLink(data.paymentLink);
      
      // Redirecionar para o link de pagamento
      window.location.href = data.paymentLink;
    } catch (error) {
      toast({
        title: "Erro ao gerar link de pagamento",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="container py-10 max-w-4xl mx-auto">
        <Card className="w-full border-orange-500 shadow-lg">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/30">
            <div className="flex flex-col items-center text-center">
              <ShieldAlert className="h-16 w-16 text-orange-500 mb-4" />
              <CardTitle className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                Assinatura Pendente
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                É necessário regularizar sua assinatura para continuar acessando os recursos exclusivos
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-lg">Acesso bloqueado</h3>
                  <p className="text-muted-foreground">
                    Identificamos que sua assinatura está inativa ou com pagamento pendente.
                    Para continuar acessando todos os recursos exclusivos da plataforma, é necessário regularizar
                    seu pagamento.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-lg">Como regularizar</h3>
                  <p className="text-muted-foreground mb-4">
                    Escolha abaixo seu plano preferido para regularizar sua assinatura imediatamente.
                    Após a confirmação do pagamento, seu acesso será restaurado automaticamente.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Card className="border-green-200 hover:border-green-400 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Plano Mensal</CardTitle>
                        <CardDescription>Assinatura renovada mensalmente</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-green-600">R$ 69,90<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant="outline" 
                          onClick={() => handleCreatePaymentLink("monthly")}
                          disabled={loading}
                        >
                          Assinar Plano Mensal
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="border-green-200 hover:border-green-400 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Plano Anual</CardTitle>
                        <CardDescription>Economize 20% no valor total</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-green-600">R$ 699,00<span className="text-sm font-normal text-muted-foreground">/ano</span></p>
                        <p className="text-sm text-green-600 font-medium">Economia de R$ 139,80</p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700" 
                          onClick={() => handleCreatePaymentLink("annual")}
                          disabled={loading}
                        >
                          Assinar Plano Anual
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center text-center bg-slate-50 dark:bg-slate-800/30 py-4">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda? Entre em contato pelo e-mail <a href="mailto:suporte@ubpct.org.br" className="text-blue-600 hover:underline">suporte@ubpct.org.br</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}