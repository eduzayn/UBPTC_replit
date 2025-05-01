import HeroSection from "../components/home/hero-section";
import BenefitsSection from "../components/home/benefits-section";
import CredentialShowcase from "../components/home/credential-showcase";
import EventsSection from "../components/home/events-section";
import EbooksSection from "../components/home/ebooks-section";
import SignupSection from "../components/home/signup-section";
import TestimonialsSection from "../components/home/testimonials-section";
import FAQSection from "../components/home/faq-section";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>UBPCT - União Brasileira de Psicanálise Clínica e Terapêutica</title>
        <meta name="description" content="Associação dedicada a profissionais da saúde mental, oferecendo desenvolvimento, networking e credenciamento para psicanalistas e terapeutas." />
      </Helmet>
    
      <HeroSection />
      <BenefitsSection />
      <CredentialShowcase />
      <EventsSection />
      <EbooksSection />
      <SignupSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
