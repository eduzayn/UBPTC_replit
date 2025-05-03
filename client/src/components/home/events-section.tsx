import { Link } from "wouter";
import { Calendar, Clock, Video, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface Event {
  id: number;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
      <div className="bg-primary text-white p-2 text-center font-montserrat font-semibold">
        {event.type}
      </div>
      <div className="p-6">
        <h3 className="font-montserrat font-semibold text-xl mb-3">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="flex items-center mb-3">
          <Calendar className="text-primary mr-2 h-5 w-5" />
          <span className="text-gray-700">{event.date}</span>
        </div>
        <div className="flex items-center mb-3">
          <Clock className="text-primary mr-2 h-5 w-5" />
          <span className="text-gray-700">{event.time}</span>
        </div>
        <div className="flex items-center mb-4">
          <Video className="text-primary mr-2 h-5 w-5" />
          <span className="text-gray-700">Evento Virtual</span>
        </div>
        <Link href={`/events-public/${event.id}`}>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-montserrat font-semibold">
            Inscrever-se
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function EventsSection() {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events/upcoming'],
    queryFn: getQueryFn(),
  });

  // Fallback events if API request fails or is loading
  const fallbackEvents: Event[] = [
    {
      id: 1,
      title: "Abordagem Psicanalítica em Casos de Ansiedade",
      description: "Supervisão clínica com discussão de casos e abordagens terapêuticas para transtornos de ansiedade.",
      type: "Supervisão Clínica",
      date: "15 de Outubro, 2023",
      time: "19:00 - 21:00"
    },
    {
      id: 2,
      title: "Psicanálise Contemporânea: Desafios e Perspectivas",
      description: "Palestra sobre os novos caminhos da psicanálise e sua aplicação nos contextos atuais.",
      type: "Palestra",
      date: "20 de Outubro, 2023",
      time: "20:00 - 22:00"
    },
    {
      id: 3,
      title: "Introdução às Obras de Freud",
      description: "Grupo de estudo semanal sobre os principais conceitos e obras de Sigmund Freud.",
      type: "Grupo de Estudo",
      date: "Toda Quarta-feira",
      time: "19:30 - 21:30"
    }
  ];

  const displayEvents = events || fallbackEvents;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl text-secondary mb-4">
            Próximos Eventos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Participe de nossos eventos virtuais semanais e tenha acesso a conteúdo exclusivo e certificado.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link href="/events-public">
                <Button variant="link" className="inline-flex items-center font-montserrat font-semibold text-primary hover:text-primary/80">
                  Ver todos os eventos
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
