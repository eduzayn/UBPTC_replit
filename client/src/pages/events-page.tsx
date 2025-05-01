import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Loader2, AlertCircle, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import EventCard from "@/components/members/event-card";

export default function EventsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tab, setTab] = useState("upcoming");

  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/events'],
    enabled: !!user,
  });

  if (!user) return null;

  // Filter events based on search and type
  const filteredEvents = events?.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      event.type.toLowerCase() === typeFilter.toLowerCase();
    
    // Check if past or upcoming
    const isPast = new Date(event.date.split('/').reverse().join('-')) < new Date();
    const matchesTab = (tab === "upcoming" && !isPast) || (tab === "past" && isPast);
    
    return matchesSearch && matchesType && matchesTab;
  });

  // Extract unique event types
  const eventTypes = events 
    ? [...new Set(events.map(event => event.type))]
    : [];

  const handleRefetchEvents = () => {
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Eventos</h1>
        <p className="text-gray-600">
          Participe de nossas palestras, supervisões e grupos de estudo
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="past">Eventos Passados</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar eventos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
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
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar eventos</h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            Não foi possível carregar os eventos. Por favor, tente novamente mais tarde.
          </p>
          <Button 
            onClick={() => refetch()} 
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      ) : filteredEvents && filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onRegister={handleRefetchEvents} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {tab === "upcoming" 
              ? "Não há próximos eventos disponíveis" 
              : "Não há eventos passados"}
          </h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            {tab === "upcoming" 
              ? "Nenhum evento futuro foi encontrado com os filtros atuais." 
              : "Nenhum evento passado foi encontrado com os filtros atuais."}
          </p>
          {(searchTerm || typeFilter !== "all") && (
            <Button 
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
              }}
              variant="outline"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
