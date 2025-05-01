import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Search, ExternalLink, AlertCircle, Handshake, Building, Pill, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Benefit {
  id: number;
  company: string;
  description: string;
  discount: string;
  category: string;
  logo_url?: string;
  contact_info?: string;
  website?: string;
  active: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'saúde':
      return <User className="h-8 w-8 text-blue-500" />;
    case 'farmácia':
      return <Pill className="h-8 w-8 text-green-500" />;
    case 'educação':
      return <Building className="h-8 w-8 text-amber-500" />;
    default:
      return <Handshake className="h-8 w-8 text-primary" />;
  }
};

export default function BenefitsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: benefits, isLoading, error } = useQuery({
    queryKey: ['/api/benefits'],
    enabled: !!user,
  });

  if (!user) return null;

  const filterBenefits = (benefits: Benefit[] | undefined) => {
    if (!benefits) return [];
    
    return benefits.filter(benefit => {
      const matchesSearch = 
        benefit.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
        benefit.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        activeTab === "all" || 
        benefit.category.toLowerCase() === activeTab.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  };

  const filteredBenefits = filterBenefits(benefits);
  
  // Extract unique categories
  const categories = benefits 
    ? [...new Set(benefits.map(benefit => benefit.category.toLowerCase()))]
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Convênios e Benefícios</h1>
        <p className="text-gray-600">
          Descontos exclusivos para associados da UBPCT
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Buscar por empresa ou benefício..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar benefícios</h3>
              <p className="text-gray-600 mb-4 text-center max-w-md">
                Não foi possível carregar os benefícios. Por favor, tente novamente mais tarde.
              </p>
            </div>
          ) : filteredBenefits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBenefits.map((benefit) => (
                <Card key={benefit.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      {getCategoryIcon(benefit.category)}
                      <div className="text-xl font-bold text-primary">{benefit.discount}</div>
                    </div>
                    <CardTitle className="mt-2">{benefit.company}</CardTitle>
                    <CardDescription>
                      Categoria: {benefit.category.charAt(0).toUpperCase() + benefit.category.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4">{benefit.description}</p>
                    
                    {benefit.contact_info && (
                      <div className="text-sm text-gray-500 mb-3">
                        <span className="font-semibold block mb-1">Contato:</span>
                        {benefit.contact_info}
                      </div>
                    )}
                    
                    {benefit.website && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                      >
                        <a href={benefit.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visitar Site
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Handshake className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Nenhum benefício encontrado</h3>
                <p className="text-gray-500 text-center max-w-md mb-4">
                  {searchTerm 
                    ? "Nenhum benefício corresponde à sua busca." 
                    : "Não há benefícios disponíveis nesta categoria no momento."}
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                  >
                    Limpar busca
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-gray-50 mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Como utilizar os benefícios?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold">Apresente sua credencial digital</h4>
                <p className="text-sm text-gray-600">
                  Mostre sua credencial UBPCT com QR Code para validação no estabelecimento parceiro.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold">Mencione o convênio UBPCT</h4>
                <p className="text-sm text-gray-600">
                  Informe que você é associado da UBPCT antes de realizar o pagamento.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold">Verifique as condições específicas</h4>
                <p className="text-sm text-gray-600">
                  Alguns convênios podem ter regras específicas. Consulte as informações de cada parceiro.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
