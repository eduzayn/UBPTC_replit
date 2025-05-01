import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@shared/schema";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function EventsPublicPage() {
  const [visibleEvents, setVisibleEvents] = useState(6);
  const { user } = useAuth();
  
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
    queryFn: async () => {
      const res = await fetch("/api/events/upcoming");
      if (!res.ok) throw new Error("Falha ao carregar eventos");
      return res.json();
    }
  });

  const handleLoadMore = () => {
    setVisibleEvents(prev => prev + 6);
  };

  const renderEventDate = (event: Event) => {
    if (!event.event_date) return "Data a definir";
    
    const eventDate = new Date(event.event_date);
    return formatDate(eventDate, "dd 'de' MMMM 'de' yyyy");
  };

  return (
    <>
      <Helmet>
        <title>Eventos | UBPCT</title>
        <meta name="description" content="Confira os próximos eventos, workshops e cursos da União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT)." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Próximos Eventos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Confira nossa programação de eventos, workshops, cursos e supervisões. 
            Amplie seu conhecimento e conecte-se com outros profissionais.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-semibold mb-2">Nenhum evento programado</h3>
            <p className="text-gray-600">
              No momento não temos eventos agendados. Volte em breve para novidades!
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {events.slice(0, visibleEvents).map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image_url} 
                        alt={event.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-3">{event.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{renderEventDate(event)}</span>
                      </div>
                      
                      {event.start_time && (
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{event.start_time} - {event.end_time || "A definir"}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location || "Evento Online"}</span>
                      </div>
                      
                      {event.capacity && (
                        <div className="flex items-center text-gray-700">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Vagas limitadas: {event.capacity}</span>
                        </div>
                      )}
                    </div>
                    
                    {user ? (
                      <Link href={`/events?id=${event.id}`}>
                        <Button className="w-full">Ver Detalhes</Button>
                      </Link>
                    ) : (
                      <Link href="/auth">
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Inscreva-se
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {events.length > visibleEvents && (
              <div className="text-center">
                <Button variant="outline" onClick={handleLoadMore}>
                  Carregar Mais Eventos
                </Button>
              </div>
            )}
          </>
        )}
        
        <div className="mt-16 p-8 bg-primary/10 rounded-lg text-center">
          <h2 className="text-3xl font-semibold mb-4">Não perca nossas atividades!</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Como associado da UBPCT, você tem acesso prioritário e muitas vezes gratuito aos nossos eventos, 
            além de receber certificados de participação.
          </p>
          {user ? (
            <Link href="/events">
              <Button className="bg-primary hover:bg-primary/90">
                Ver Todos os Eventos
              </Button>
            </Link>
          ) : (
            <Link href="/auth?redirect=/events">
              <Button className="bg-primary hover:bg-primary/90">
                Associe-se Agora
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}