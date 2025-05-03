import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import { AdminRoute } from "./lib/admin-route";

// Layouts
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

// Pages
import HomePage from "./pages/home-page";
import AuthPage from "./pages/auth-page";
import DashboardPage from "./pages/dashboard-page";
import ProfilePage from "./pages/profile-page";
import CredentialPage from "./pages/credential-page";
import LibraryPage from "./pages/library-page";
import EventsPage from "./pages/events-page";
import CertificatesPage from "./pages/certificates-page";
import BenefitsPage from "./pages/benefits-page";
import ValidateCredentialPage from "./pages/validate-credential";
import AboutPage from "./pages/about-page";
import ServicesPage from "./pages/services-page";
import EventsPublicPage from "./pages/events-public-page";
import BlogPage from "./pages/blog-page";
import ContactPage from "./pages/contact-page";
import TermsPage from "./pages/terms-page";
import PrivacyPage from "./pages/privacy-page";
import PaymentRequiredPage from "./pages/payment-required-page";

// Admin Pages
import AdminDashboardPage from "./pages/admin/dashboard-page";
import AdminMembersPage from "./pages/admin/members-page";
import AdminEbooksPage from "./pages/admin/ebooks-page";
import AdminEventsPage from "./pages/admin/events-page";
import AdminFinancePage from "./pages/admin/finance-page";
import AdminBenefitsPage from "./pages/admin/benefits-page";
import AdminCommunicationPage from "./pages/admin/communication-page";

import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Admin Routes - Sem header e footer */}
      <AdminRoute path="/admin" component={AdminDashboardPage} />
      <AdminRoute path="/admin/members" component={AdminMembersPage} />
      <AdminRoute path="/admin/ebooks" component={AdminEbooksPage} />
      <AdminRoute path="/admin/events" component={AdminEventsPage} />
      <AdminRoute path="/admin/finance" component={AdminFinancePage} />
      <AdminRoute path="/admin/benefits" component={AdminBenefitsPage} />
      <AdminRoute path="/admin/communication" component={AdminCommunicationPage} />
      
      {/* Páginas públicas e protegidas - Com header e footer */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Switch>
            {/* Public Pages */}
            <Route path="/" component={HomePage} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/events-public" component={EventsPublicPage} />
            <Route path="/blog" component={BlogPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/validate/:credentialId" component={ValidateCredentialPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/payment-required" component={PaymentRequiredPage} />
            
            {/* Protected Pages */}
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
            <ProtectedRoute path="/profile" component={ProfilePage} />
            <ProtectedRoute path="/credential" component={CredentialPage} />
            <ProtectedRoute path="/library" component={LibraryPage} />
            <ProtectedRoute path="/events" component={EventsPage} />
            <ProtectedRoute path="/certificates" component={CertificatesPage} />
            <ProtectedRoute path="/benefits" component={BenefitsPage} />
            
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
