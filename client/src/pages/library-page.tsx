import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LibraryCard from "@/components/members/library-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Loader2, BookX } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LibraryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: ebooks, isLoading, error } = useQuery({
    queryKey: ['/api/ebooks'],
    enabled: !!user,
  });

  // Filter ebooks based on search and category
  const filteredEbooks = ebooks?.filter(ebook => {
    const matchesSearch = 
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      ebook.categories.includes(categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories from ebooks
  const categories = ebooks 
    ? [...new Set(ebooks.flatMap(ebook => ebook.categories))]
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Biblioteca de E-books</h1>
        <p className="text-gray-600">
          Acesse nossa biblioteca digital exclusiva para associados
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar por título ou autor..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            Ocorreu um erro ao carregar a biblioteca. Por favor, tente novamente mais tarde.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      ) : filteredEbooks && filteredEbooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEbooks.map((ebook) => (
            <LibraryCard key={ebook.id} ebook={ebook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum e-book encontrado</h3>
          <p className="text-gray-600 mb-4">
            Não encontramos e-books que correspondam aos seus critérios de busca.
          </p>
          <Button 
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
            }}
            variant="outline"
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
