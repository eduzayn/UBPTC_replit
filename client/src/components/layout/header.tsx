import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "../shared/logo";
import { Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Sobre Nós", path: "/about" },
    { name: "Serviços", path: "/services" },
    { name: "Eventos", path: "/events-public" },
    { name: "Blog", path: "/blog" },
  ];

  const memberLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Credencial", path: "/credential" },
    { name: "Biblioteca", path: "/library" },
    { name: "Eventos", path: "/events" },
    { name: "Certificados", path: "/certificates" },
    { name: "Benefícios", path: "/benefits" },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin" },
    { name: "Associados", path: "/admin/members" },
    { name: "E-books", path: "/admin/ebooks" },
    { name: "Eventos", path: "/admin/events" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
                <Logo className="h-12 w-12" />
                <span className="ml-2 font-montserrat font-bold text-secondary text-xl hidden md:block">
                  UBPCT
                </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-montserrat ${
                  isActive(link.path)
                    ? "text-primary font-semibold"
                    : "text-gray-700 hover:text-primary"
                } transition duration-300`}
              >
                {link.name}
              </Link>
            ))}

            <Link href="/#associe-se">
              <Button className="font-montserrat bg-primary hover:bg-primary/90 text-white">
                Associe-se
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium leading-none mb-1">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Member Links */}
                  {memberLinks.map((link) => (
                    <Link key={link.path} href={link.path}>
                      <DropdownMenuItem className="cursor-pointer">
                        {link.name}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  
                  {/* Admin Links - only show if user is admin */}
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      {adminLinks.map((link) => (
                        <Link key={link.path} href={link.path}>
                          <DropdownMenuItem className="cursor-pointer">
                            {link.name}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                href="/auth"
                className="font-montserrat text-gray-700 hover:text-primary transition duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={`font-montserrat ${
                      isActive(link.path)
                        ? "text-primary font-semibold"
                        : "text-gray-700"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <Link href="/#associe-se">
                  <Button 
                    className="font-montserrat bg-primary hover:bg-primary/90 text-white w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Associe-se
                  </Button>
                </Link>
                
                {user ? (
                  <>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    {/* Member Links */}
                    <div className="space-y-3 pt-2">
                      {memberLinks.map((link) => (
                        <Link key={link.path} href={link.path}>
                          <a
                            className="block text-gray-700 hover:text-primary"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Admin Links - only show if user is admin */}
                    {user.role === "admin" && (
                      <>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-sm font-medium">Administração</p>
                        </div>
                        <div className="space-y-3">
                          {adminLinks.map((link) => (
                            <Link key={link.path} href={link.path}>
                              <a
                                className="block text-gray-700 hover:text-primary"
                                onClick={() => setIsOpen(false)}
                              >
                                {link.name}
                              </a>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      className="flex items-center justify-start px-0 hover:bg-transparent hover:text-primary"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </Button>
                  </>
                ) : (
                  <Link href="/auth">
                    <a
                      className="font-montserrat text-gray-700 hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </a>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
