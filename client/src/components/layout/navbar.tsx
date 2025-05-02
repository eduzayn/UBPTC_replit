import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl font-bold hover:cursor-pointer">UBPCT</a>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/">
            <a className="hover:text-primary-foreground/80 transition">Início</a>
          </Link>
          <Link href="/about">
            <a className="hover:text-primary-foreground/80 transition">Sobre</a>
          </Link>
          <Link href="/services">
            <a className="hover:text-primary-foreground/80 transition">Serviços</a>
          </Link>
          <Link href="/contact">
            <a className="hover:text-primary-foreground/80 transition">Contato</a>
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-white/80">
                  <User className="mr-2 h-4 w-4" />
                  Área do Membro
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-white hover:text-white/80"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}