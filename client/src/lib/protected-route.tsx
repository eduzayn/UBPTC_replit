import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlertCircle } from "lucide-react";
import { Redirect, Route, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getPaymentLink } from "@/lib/asaas";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element | null;
}) {
  const { user, isLoading } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<{
    status: "adimplente" | "inadimplente" | "cancelado";
    expiryDate: string | null;
  } | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  useEffect(() => {
    async function checkPaymentStatus() {
      if (!user) return;
      
      setIsCheckingPayment(true);
      try {
        const response = await fetch(`/api/payments/status/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setPaymentStatus(data);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      } finally {
        setIsCheckingPayment(false);
      }
    }
    
    if (user) {
      checkPaymentStatus();
    }
  }, [user]);

  // User needs to be logged in
  if (!isLoading && !user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Payment status check
  const isPaymentValid = paymentStatus?.status === "adimplente";
  const needsToRenew = !isCheckingPayment && user && !isPaymentValid;

  return (
    <Route path={path}>
      {isLoading || isCheckingPayment ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : needsToRenew ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Assinatura Inativa</h2>
            <p className="text-gray-600 mb-6">
              Sua assinatura expirou ou está pendente de pagamento. Por favor, renove sua assinatura para continuar acessando os recursos exclusivos.
            </p>
            
            <div className="grid gap-3">
              <a href={getPaymentLink("monthly")} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Renovar Assinatura Mensal
                </Button>
              </a>
              
              <a href={getPaymentLink("annual")} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-primary/80 hover:bg-primary">
                  Renovar Assinatura Anual (Economize 20%)
                </Button>
              </a>
              
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Voltar para a Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <Component />
      )}
    </Route>
  );
}
