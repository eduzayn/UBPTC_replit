import { Link } from "wouter";
import Logo from "../shared/logo";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Logo className="h-10 w-10 bg-white rounded-full" />
              <span className="font-montserrat font-bold text-xl ml-2">UBPCT</span>
            </div>
            <p className="text-gray-300 mb-4">
              União Brasileira de Psicanálise Clínica e Terapêutica - Associação nacional de profissionais da saúde mental.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-white hover:text-primary transition duration-300"
                aria-label="Facebook"
              >
                <Facebook />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-primary transition duration-300"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-primary transition duration-300"
                aria-label="Youtube"
              >
                <Youtube />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-primary transition duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Sobre Nós</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Serviços</a>
                </Link>
              </li>
              <li>
                <Link href="/events-public">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Eventos</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Contato</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">Associados</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Login</a>
                </Link>
              </li>
              <li>
                <Link href="/#associe-se">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Associe-se</a>
                </Link>
              </li>
              <li>
                <Link href="/library">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Biblioteca</a>
                </Link>
              </li>
              <li>
                <Link href="/certificates">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Certificados</a>
                </Link>
              </li>
              <li>
                <Link href="/benefits">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Convênios</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="text-primary mr-2 mt-1 h-5 w-5" />
                <span className="text-gray-300">contato@ubpct.com.br</span>
              </li>
              <li className="flex items-start">
                <Phone className="text-primary mr-2 mt-1 h-5 w-5" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </li>
              <li className="flex items-start">
                <MapPin className="text-primary mr-2 mt-1 h-5 w-5" />
                <span className="text-gray-300">100% Virtual</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} UBPCT - União Brasileira de Psicanálise Clínica e Terapêutica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
