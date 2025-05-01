import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";

// Dados simulados para artigos do blog
const blogPosts = [
  {
    id: 1,
    title: "A importância da supervisão clínica na prática psicanalítica",
    excerpt: "A supervisão clínica é um elemento fundamental na formação e na prática continuada do psicanalista. Este artigo discute por que ela é essencial e como aproveitá-la ao máximo.",
    image: "/blog-placeholder-1.jpg",
    category: "Formação Profissional",
    author: "Dra. Carla Santos",
    date: "2023-11-15",
    readTime: "8 min"
  },
  {
    id: 2,
    title: "Transferência e contratransferência: desafios contemporâneos",
    excerpt: "Os conceitos de transferência e contratransferência, fundamentais na psicanálise clássica, ganham novos contornos na clínica contemporânea. Saiba como identificar e trabalhar com esses fenômenos.",
    image: "/blog-placeholder-2.jpg",
    category: "Teoria Psicanalítica",
    author: "Dr. Roberto Ferreira",
    date: "2023-10-28",
    readTime: "12 min"
  },
  {
    id: 3,
    title: "Psicanálise online: limitações e potencialidades",
    excerpt: "A pandemia acelerou a adoção do atendimento online. Este artigo analisa os desafios e as novas possibilidades que emergiram da clínica psicanalítica remota.",
    image: "/blog-placeholder-3.jpg",
    category: "Prática Clínica",
    author: "Dr. Marcelo Alves",
    date: "2023-10-10",
    readTime: "10 min"
  },
  {
    id: 4,
    title: "O papel do setting terapêutico na eficácia do tratamento",
    excerpt: "O ambiente e as condições em que ocorre a terapia têm influência direta nos resultados. Conheça estratégias para otimizar seu setting terapêutico.",
    image: "/blog-placeholder-4.jpg",
    category: "Prática Clínica",
    author: "Dra. Luciana Costa",
    date: "2023-09-22",
    readTime: "7 min"
  },
  {
    id: 5,
    title: "Trauma e resiliência: perspectivas contemporâneas",
    excerpt: "Como a psicanálise moderna compreende e trabalha com o trauma psíquico. Uma análise das abordagens mais eficazes para promover a resiliência.",
    image: "/blog-placeholder-5.jpg",
    category: "Teoria Psicanalítica",
    author: "Dra. Ana Paula",
    date: "2023-09-05",
    readTime: "15 min"
  },
  {
    id: 6,
    title: "Aspectos éticos da prática psicanalítica",
    excerpt: "Os dilemas éticos são parte do cotidiano do psicanalista. Este artigo discute os princípios fundamentais e casos práticos para orientar sua conduta profissional.",
    image: "/blog-placeholder-6.jpg",
    category: "Ética",
    author: "Dr. Paulo Mendes",
    date: "2023-08-18",
    readTime: "9 min"
  }
];

export default function BlogPage() {
  const [visiblePosts, setVisiblePosts] = useState(4);
  const [activeCategory, setActiveCategory] = useState("Todos");
  
  const categories = ["Todos", "Formação Profissional", "Teoria Psicanalítica", "Prática Clínica", "Ética"];
  
  const filteredPosts = activeCategory === "Todos" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 4);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog | UBPCT</title>
        <meta name="description" content="Artigos, insights e notícias sobre psicanálise clínica e terapêutica da União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT)." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Artigos, insights e reflexões sobre psicanálise, psicoterapia e saúde mental.
            Conteúdo produzido por nossos especialistas para sua constante atualização profissional.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "bg-primary hover:bg-primary/90" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {filteredPosts.slice(0, visiblePosts).map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="md:w-2/3">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-primary">{post.category}</span>
                      <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Por {post.author}</span>
                      <span className="text-sm text-gray-500">{post.readTime} de leitura</span>
                    </div>
                    <Button className="w-full mt-4">
                      Ler Artigo
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredPosts.length > visiblePosts && (
          <div className="text-center">
            <Button variant="outline" onClick={handleLoadMore}>
              Carregar Mais Artigos
            </Button>
          </div>
        )}
        
        <div className="mt-16 p-8 bg-primary/10 rounded-lg text-center">
          <h2 className="text-3xl font-semibold mb-4">Seja um colaborador do nosso blog!</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Você é associado da UBPCT e tem interesse em contribuir com artigos para o nosso blog? 
            Entre em contato conosco e compartilhe seu conhecimento com milhares de profissionais.
          </p>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90">
              Entre em Contato
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}