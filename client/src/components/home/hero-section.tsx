import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getPaymentLink } from "@/lib/asaas";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-secondary to-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              União Brasileira de Psicanálise Clínica e Terapêutica
            </h1>
            <p className="text-lg mb-6">
              Associação dedicada a profissionais da saúde mental, oferecendo desenvolvimento, networking e credenciamento para psicanalistas e terapeutas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={getPaymentLink("monthly")} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold px-6 py-3 h-auto">
                  Associe-se Agora
                </Button>
              </a>
              <Link href="/about">
                <Button variant="outline" className="bg-transparent border border-white hover:bg-white hover:text-secondary font-montserrat font-semibold px-6 py-3 h-auto">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Profissionais de saúde mental" 
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
