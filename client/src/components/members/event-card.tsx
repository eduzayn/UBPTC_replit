import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Download, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    type: string;
    date: string;
    time: string;
    meetingUrl?: string;
    certificateAvailable: boolean;
    registered: boolean;
    attended: boolean;
  };
  onRegister?: () => void;
}

export default function EventCard({ event, onRegister }: EventCardProps) {
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(event.registered);
  const [hasAttended, setHasAttended] = useState(event.attended);

  const isPast = new Date(event.date) < new Date();
  const canGetCertificate = isPast && hasAttended && event.certificateAvailable;

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      
      await apiRequest("POST", `/api/events/${event.id}/register`, {});
      
      setIsRegistered(true);
      toast({
        title: "Inscrição realizada",
        description: `Você foi inscrito em "${event.title}" com sucesso.`,
      });
      
      if (onRegister) {
        onRegister();
      }
    } catch (error) {
      toast({
        title: "Erro na inscrição",
        description: "Não foi possível realizar sua inscrição. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch(`/api/events/${event.id}/certificate`);
      
      if (!response.ok) {
        throw new Error("Failed to download certificate");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-${event.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download iniciado",
        description: "Seu certificado está sendo baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o certificado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="bg-primary text-white p-2 text-center font-montserrat font-semibold">
        {event.type}
        {isPast && (
          <Badge className="ml-2 bg-gray-700">Evento passado</Badge>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-montserrat font-semibold text-xl mb-3">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
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
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {!isPast ? (
          isRegistered ? (
            <>
              <div className="flex items-center text-green-600 font-semibold mb-2">
                <Check className="mr-2 h-4 w-4" />
                Inscrito
              </div>
              {event.meetingUrl && (
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90"
                  asChild
                >
                  <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Acessar Reunião
                  </a>
                </Button>
              )}
            </>
          ) : (
            <Button 
              onClick={handleRegister} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isRegistering}
            >
              {isRegistering ? "Processando..." : "Inscrever-se"}
            </Button>
          )
        ) : canGetCertificate ? (
          <Button 
            onClick={handleDownloadCertificate} 
            className="w-full bg-secondary hover:bg-secondary/90"
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Baixando..." : "Baixar Certificado"}
          </Button>
        ) : isRegistered && hasAttended ? (
          <div className="text-center text-gray-500 text-sm">
            Você participou deste evento. Certificado indisponível.
          </div>
        ) : isRegistered ? (
          <div className="text-center text-gray-500 text-sm">
            Você se inscreveu, mas não participou deste evento.
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm">
            Evento passado. Inscrições encerradas.
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
