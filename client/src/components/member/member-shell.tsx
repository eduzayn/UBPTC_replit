import { ReactNode } from "react";
import { MemberSidebar } from "./member-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface MemberShellProps {
  children: ReactNode;
  title?: string;
}

export function MemberShell({ children, title }: MemberShellProps) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-muted-foreground">
          Você precisa estar autenticado para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MemberSidebar />
      <div className="flex-1 flex flex-col">
        {title && (
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}