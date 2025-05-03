import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Home,
  Menu,
  User,
  FileText,
  BookOpen,
  Calendar,
  Award,
  Handshake,
  LogOut,
} from "lucide-react";

type SidebarLink = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export function MemberSidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const links: SidebarLink[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Meu Perfil",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Credencial",
      href: "/credential",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Biblioteca",
      href: "/library",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Eventos",
      href: "/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Certificados",
      href: "/certificates",
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "Benefícios",
      href: "/benefits",
      icon: <Handshake className="h-5 w-5" />,
    },
  ];

  // Links de administração (somente para administradores)
  const adminLinks: SidebarLink[] = user.role === "admin" ? [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: <CreditCard className="h-5 w-5" />,
    },
  ] : [];

  const allLinks = [...links, ...adminLinks];

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const sidebarContent = (
    <>
      <div className="flex flex-col h-full">
        <div className="py-4 px-3 border-b">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              {user?.photo_url && <AvatarImage src={user.photo_url} alt={user.name} />}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold truncate max-w-[140px]">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="px-3 py-2">
            <nav className="flex flex-col space-y-1">
              {allLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      location === link.href && "bg-secondary"
                    )}
                    onClick={() => isMobile && setOpen(false)}
                  >
                    {link.icon}
                    <span className="ml-3">{link.title}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
        
        <div className="py-4 px-3 border-t mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
          </Button>
        </div>
      </div>
    </>
  );
  
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden md:block w-64 border-r h-screen sticky top-0">
      {sidebarContent}
    </aside>
  );
}