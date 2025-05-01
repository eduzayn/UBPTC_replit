import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";

// Layouts
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

// Pages
import HomePage from "./pages/home-page";
import AuthPage from "./pages/auth-page";
import DashboardPage from "./pages/dashboard-page";
import CredentialPage from "./pages/credential-page";
import LibraryPage from "./pages/library-page";
import EventsPage from "./pages/events-page";
import CertificatesPage from "./pages/certificates-page";
import BenefitsPage from "./pages/benefits-page";
import ValidateCredentialPage from "./pages/validate-credential";

// Admin Pages
import AdminDashboardPage from "./pages/admin/dashboard-page";
import AdminMembersPage from "./pages/admin/members-page";
import AdminEbooksPage from "./pages/admin/ebooks-page";
import AdminEventsPage from "./pages/admin/events-page";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          {/* Public Pages */}
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/validate/:credentialId" component={ValidateCredentialPage} />
          <Route path="/terms" component={() => <div className="container mx-auto px-4 py-12 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
            <p className="mb-4">Este documento contém os termos e condições para o uso do site e serviços da União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT).</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Aceitação dos Termos</h2>
            <p className="mb-4">Ao acessar e utilizar nosso site e serviços, você confirma que leu, entendeu e concorda com estes termos de uso. Se você não concordar com estes termos, por favor, não utilize nosso site ou serviços.</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Cadastro e Associação</h2>
            <p className="mb-4">Para se associar à UBPCT, é necessário fornecer informações corretas e atualizadas. Você é responsável por manter a confidencialidade de seus dados de login e por todas as atividades realizadas em sua conta.</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Pagamentos e Mensalidades</h2>
            <p className="mb-4">As mensalidades e pagamentos relacionados à associação devem ser efetuados conforme o plano escolhido. A não efetivação do pagamento pode resultar na suspensão temporária ou permanente do acesso aos benefícios exclusivos para associados.</p>
            <p className="mb-4">Consulte nossa política de reembolso para mais informações sobre cancelamentos e estornos.</p>
          </div>} />
          <Route path="/privacy" component={() => <div className="container mx-auto px-4 py-12 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
            <p className="mb-4">Esta política de privacidade explica como a União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT) coleta, usa e protege seus dados pessoais.</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Coleta de Dados</h2>
            <p className="mb-4">Coletamos dados pessoais quando você se cadastra em nosso site, associa-se à UBPCT, participa de eventos, ou interage com nossas plataformas digitais. Estes dados podem incluir nome, e-mail, telefone, CPF, dados profissionais e informações de pagamento.</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Uso dos Dados</h2>
            <p className="mb-4">Os dados coletados são utilizados para: processar associações e pagamentos, fornecer acesso a conteúdos exclusivos, emitir certificados e credenciais, comunicar sobre eventos e atualizações relevantes, e melhorar nossos serviços.</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Proteção de Dados</h2>
            <p className="mb-4">Implementamos medidas de segurança apropriadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados pessoais são tratados de acordo com a Lei Geral de Proteção de Dados (LGPD).</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Seus Direitos</h2>
            <p className="mb-4">Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais. Para exercer estes direitos ou esclarecer dúvidas sobre nossa política de privacidade, entre em contato conosco através do e-mail: contato@ubpct.com.br.</p>
          </div>} />
          
          {/* Protected Pages */}
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <ProtectedRoute path="/credential" component={CredentialPage} />
          <ProtectedRoute path="/library" component={LibraryPage} />
          <ProtectedRoute path="/events" component={EventsPage} />
          <ProtectedRoute path="/certificates" component={CertificatesPage} />
          <ProtectedRoute path="/benefits" component={BenefitsPage} />
          
          {/* Admin Routes */}
          <ProtectedRoute path="/admin" component={AdminDashboardPage} />
          <ProtectedRoute path="/admin/members" component={AdminMembersPage} />
          <ProtectedRoute path="/admin/ebooks" component={AdminEbooksPage} />
          <ProtectedRoute path="/admin/events" component={AdminEventsPage} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;
