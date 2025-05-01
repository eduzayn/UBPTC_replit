import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface Ebook {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
}

function EbookCard({ ebook }: { ebook: Ebook }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-48 overflow-hidden">
        <img
          src={ebook.coverUrl}
          alt={`Capa do E-book ${ebook.title}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-montserrat font-semibold text-sm md:text-base line-clamp-2 mb-1">
          {ebook.title}
        </h3>
        <p className="text-gray-500 text-xs mb-3">{ebook.author}</p>
        <Link href="/auth">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-montserrat h-7">
            Acessar
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function EbooksSection() {
  const { data: ebooks, isLoading, error } = useQuery<Ebook[]>({
    queryKey: ['/api/ebooks/featured'],
    queryFn: async () => {
      const response = await fetch('/api/ebooks/featured');
      if (!response.ok) {
        throw new Error('Failed to fetch ebooks');
      }
      return response.json();
    },
  });

  // Fallback ebooks if API request fails or is loading
  const fallbackEbooks: Ebook[] = [
    {
      id: 1,
      title: "Fundamentos da Teoria Psicanalítica",
      author: "Dr. Carlos Mendes",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Técnicas Terapêuticas Contemporâneas",
      author: "Dra. Lúcia Santos",
      coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "O Inconsciente na Prática Clínica",
      author: "Dr. Paulo Ribeiro",
      coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Introdução à Terapia Cognitivo-Comportamental",
      author: "Dra. Marta Alves",
      coverUrl: "https://images.unsplash.com/photo-1603033156166-2ae22eb2b7e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Psicopatologia e Diagnóstico Clínico",
      author: "Dr. Ricardo Sousa",
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const displayEbooks = ebooks || fallbackEbooks;

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl text-secondary mb-4">
            Biblioteca de E-books
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acesse nossa biblioteca exclusiva com ebooks especializados em psicanálise, terapias e desenvolvimento profissional.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Ocorreu um erro ao carregar os e-books. Por favor, tente novamente mais tarde.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
            {displayEbooks.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} />
            ))}
          </div>
        )}
        
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-center mb-6">
            <h3 className="font-montserrat font-semibold text-xl text-secondary">
              Acesso Exclusivo para Associados
            </h3>
            <p className="text-gray-600">
              Associe-se agora para ter acesso completo à nossa biblioteca digital com mais de 50 ebooks.
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="#associe-se">
              <Button className="bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold px-6 py-3 h-auto">
                Associe-se Agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
