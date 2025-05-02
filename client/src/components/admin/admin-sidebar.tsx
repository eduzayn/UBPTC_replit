import { useLocation, Link } from "wouter";
import { 
  Layout, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Award, 
  Mail, 
  BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

function SidebarLink({ href, icon, children, isActive }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <a className={cn(
        "flex items-center gap-3 py-2 px-3 rounded-md transition-colors", 
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-primary/10 hover:text-primary"
      )}>
        {icon}
        <span>{children}</span>
      </a>
    </Link>
  );
}

export function AdminSidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <div className="w-64 border-r h-full min-h-screen sticky top-0 p-4 space-y-6 bg-background flex flex-col">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layout className="h-5 w-5" /> 
          <span>Portal Admin</span>
        </h2>
      </div>
      
      <nav className="space-y-1 flex-1">
        <SidebarLink 
          href="/admin" 
          icon={<BarChart3 className="h-5 w-5" />} 
          isActive={isActive("/admin")}
        >
          Dashboard
        </SidebarLink>
        
        <SidebarLink 
          href="/admin/members" 
          icon={<Users className="h-5 w-5" />} 
          isActive={isActive("/admin/members")}
        >
          Associados
        </SidebarLink>
        
        <SidebarLink 
          href="/admin/ebooks" 
          icon={<BookOpen className="h-5 w-5" />} 
          isActive={isActive("/admin/ebooks")}
        >
          E-books
        </SidebarLink>
        
        <SidebarLink 
          href="/admin/events" 
          icon={<Calendar className="h-5 w-5" />} 
          isActive={isActive("/admin/events")}
        >
          Eventos
        </SidebarLink>
        
        <SidebarLink 
          href="/admin/finance" 
          icon={<CreditCard className="h-5 w-5" />} 
          isActive={isActive("/admin/finance")}
        >
          Financeiro
        </SidebarLink>
        
        <SidebarLink 
          href="/admin/benefits" 
          icon={<Award className="h-5 w-5" />} 
          isActive={isActive("/admin/benefits")}
        >
          Convênios
        </SidebarLink>
        
        <SidebarLink 
          href="/admin/communication" 
          icon={<Mail className="h-5 w-5" />} 
          isActive={isActive("/admin/communication")}
        >
          Comunicações
        </SidebarLink>
      </nav>
      
      <div className="border-t pt-4">
        <Link href="/dashboard">
          <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <span>Voltar ao Portal do Associado</span>
          </a>
        </Link>
      </div>
    </div>
  );
}