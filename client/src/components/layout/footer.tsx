import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre a UBPCT</h3>
            <p className="text-gray-300 text-sm">
              A União Brasileira de Psicanálise Clínica e Terapêutica é uma associação de profissionais da saúde mental dedicada ao desenvolvimento da psicanálise e terapias no Brasil.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Área do Membro</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-gray-300 hover:text-white transition">
                  Biblioteca
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-gray-300 hover:text-white transition">
                  Certificados
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <p className="text-gray-300 mb-2 text-sm">contato@ubpct.org.br</p>
            <p className="text-gray-300 mb-2 text-sm">+55 (11) 3333-4444</p>
            <p className="text-gray-300 text-sm">Av. Paulista, 1000 - São Paulo, SP</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {currentYear} União Brasileira de Psicanálise Clínica e Terapêutica. Todos os direitos reservados.</p>
          
          <div className="mt-4 md:mt-0 space-x-4 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-white transition">
              Termos de Uso
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}