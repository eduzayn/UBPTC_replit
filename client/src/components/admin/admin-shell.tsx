import { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface AdminShellProps {
  children: ReactNode;
  title: string;
}

export function AdminShell({ children, title }: AdminShellProps) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta área.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}