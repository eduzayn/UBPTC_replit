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
  
  // Administradores não precisam de assinatura ativa
  const isAdmin = user?.role === "admin";
  const needsToRenew = !isCheckingPayment && user && !isPaymentValid && !isAdmin;

  return (
    <Route path={path}>
      {isLoading || isCheckingPayment ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : needsToRenew ? (
        <Redirect to="/payment-required" />
      ) : (
        <Component />
      )}
    </Route>
  );
}
