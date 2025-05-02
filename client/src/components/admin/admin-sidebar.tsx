import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Gift,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}

function NavItem({ href, icon, title, active }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )}
      >
        {icon}
        <span>{title}</span>
        {active && (
          <span className="ml-auto">
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </a>
    </Link>
  );
}

export function AdminSidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-card">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <div className="font-bold text-xl">UBPCT Admin</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            Dashboard
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/admin"
              icon={<LayoutDashboard className="h-4 w-4" />}
              title="Painel de Controle"
              active={isActive("/admin")}
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            Gerenciamento
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/admin/members"
              icon={<Users className="h-4 w-4" />}
              title="Associados"
              active={isActive("/admin/members")}
            />
            <NavItem
              href="/admin/ebooks"
              icon={<BookOpen className="h-4 w-4" />}
              title="E-books"
              active={isActive("/admin/ebooks")}
            />
            <NavItem
              href="/admin/events"
              icon={<Calendar className="h-4 w-4" />}
              title="Eventos"
              active={isActive("/admin/events")}
            />
            <NavItem
              href="/admin/finance"
              icon={<DollarSign className="h-4 w-4" />}
              title="Finanças"
              active={isActive("/admin/finance")}
            />
            <NavItem
              href="/admin/benefits"
              icon={<Gift className="h-4 w-4" />}
              title="Benefícios/Parcerias"
              active={isActive("/admin/benefits")}
            />
            <NavItem
              href="/admin/communication"
              icon={<Mail className="h-4 w-4" />}
              title="Comunicação"
              active={isActive("/admin/communication")}
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            Sistema
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/admin/settings"
              icon={<Settings className="h-4 w-4" />}
              title="Configurações"
              active={isActive("/admin/settings")}
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}