import { useEffect, useRef } from "react";
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
  // Ref para a seção associe-se
  const signupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificar se há um parâmetro de consulta 'anchor'
    const params = new URLSearchParams(window.location.search);
    const anchor = params.get('anchor');
    
    // Se o anchor for 'associe-se', rolar para a seção
    if (anchor === 'associe-se' && signupRef.current) {
      signupRef.current.scrollIntoView({ behavior: 'smooth' });
      
      // Limpar o parâmetro de consulta da URL para evitar problemas de navegação
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

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
      <div ref={signupRef}>
        <SignupSection />
      </div>
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
