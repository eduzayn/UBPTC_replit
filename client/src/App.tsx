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
      <Route path="/admin">
        {matches => matches && <AdminRoute path="/admin" component={AdminDashboardPage} />}
      </Route>
      <Route path="/admin/members">
        {matches => matches && <AdminRoute path="/admin/members" component={AdminMembersPage} />}
      </Route>
      <Route path="/admin/ebooks">
        {matches => matches && <AdminRoute path="/admin/ebooks" component={AdminEbooksPage} />}
      </Route>
      <Route path="/admin/events">
        {matches => matches && <AdminRoute path="/admin/events" component={AdminEventsPage} />}
      </Route>
      <Route path="/admin/finance">
        {matches => matches && <AdminRoute path="/admin/finance" component={AdminFinancePage} />}
      </Route>
      <Route path="/admin/benefits">
        {matches => matches && <AdminRoute path="/admin/benefits" component={AdminBenefitsPage} />}
      </Route>
      <Route path="/admin/communication">
        {matches => matches && <AdminRoute path="/admin/communication" component={AdminCommunicationPage} />}
      </Route>
      
      {/* Páginas Públicas - Com header e footer */}
      <Route path="/">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <HomePage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/auth">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <AuthPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/about">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <AboutPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/services">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <ServicesPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/events-public">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <EventsPublicPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/blog">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <BlogPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/contact">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <ContactPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/validate/:credentialId">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <ValidateCredentialPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/terms">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <TermsPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/privacy">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <PrivacyPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route path="/payment-required">
        {matches => matches && (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <PaymentRequiredPage />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      {/* Protected Pages */}
      <Route path="/dashboard">
        {matches => matches && <ProtectedRoute path="/dashboard" component={DashboardPage} />}
      </Route>
      
      <Route path="/profile">
        {matches => matches && <ProtectedRoute path="/profile" component={ProfilePage} />}
      </Route>
      
      <Route path="/credential">
        {matches => matches && <ProtectedRoute path="/credential" component={CredentialPage} />}
      </Route>
      
      <Route path="/library">
        {matches => matches && <ProtectedRoute path="/library" component={LibraryPage} />}
      </Route>
      
      <Route path="/events">
        {matches => matches && <ProtectedRoute path="/events" component={EventsPage} />}
      </Route>
      
      <Route path="/certificates">
        {matches => matches && <ProtectedRoute path="/certificates" component={CertificatesPage} />}
      </Route>
      
      <Route path="/benefits">
        {matches => matches && <ProtectedRoute path="/benefits" component={BenefitsPage} />}
      </Route>
      
      {/* Fallback to 404 */}
      <Route>
        {() => (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <NotFound />
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
