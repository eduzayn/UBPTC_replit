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
import AboutPage from "./pages/about-page";
import ServicesPage from "./pages/services-page";
import EventsPublicPage from "./pages/events-public-page";
import BlogPage from "./pages/blog-page";
import ContactPage from "./pages/contact-page";
import TermsPage from "./pages/terms-page";
import PrivacyPage from "./pages/privacy-page";

// Admin Pages
import AdminDashboardPage from "./pages/admin/dashboard-page";
import AdminMembersPage from "./pages/admin/members-page";
import AdminEbooksPage from "./pages/admin/ebooks-page";
import AdminEventsPage from "./pages/admin/events-page";

import NotFound from "./pages/not-found";

function Router() {
  return (
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
