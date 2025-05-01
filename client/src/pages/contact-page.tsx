import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Mail, Phone, MessageSquare, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Por favor, informe um e-mail válido"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulação de envio - substituir por implementação real
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: "Entraremos em contato em breve!",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "E-mail",
      description: "contato@ubpct.com.br",
      action: "Envie um e-mail",
      link: "mailto:contato@ubpct.com.br"
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Telefone",
      description: "(11) 99999-9999",
      action: "Ligue para nós",
      link: "tel:+5511999999999"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "WhatsApp",
      description: "(11) 99999-9999",
      action: "Chame no WhatsApp",
      link: "https://wa.me/5511999999999"
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Localização",
      description: "100% Virtual",
      action: "Conheça mais",
      link: "/about"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contato | UBPCT</title>
        <meta name="description" content="Entre em contato com a União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT) para dúvidas, sugestões ou informações." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos à disposição para esclarecer dúvidas, receber sugestões ou fornecer informações adicionais sobre nossos serviços.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Envie uma mensagem</h2>
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Motivo do contato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Escreva sua mensagem detalhada aqui..." 
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Enviando...</span>
                          <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                        </>
                      ) : (
                        "Enviar Mensagem"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Informações de Contato</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        <a 
                          href={item.link} 
                          className="text-primary hover:underline font-medium inline-flex items-center"
                        >
                          {item.action}
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Horário de Atendimento</h3>
              <p className="mb-4">Nossa equipe está disponível para atendimento nos seguintes horários:</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Segunda a Sexta</span>
                  <span>9h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sábados</span>
                  <span>9h às 13h</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Domingos e Feriados</span>
                  <span>Fechado</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">FAQ - Perguntas Frequentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Qual o tempo médio de resposta?</h4>
                  <p className="text-gray-600">Respondemos todas as mensagens em até 24 horas úteis.</p>
                </div>
                <div>
                  <h4 className="font-medium">Como posso solicitar um certificado perdido?</h4>
                  <p className="text-gray-600">Envie um e-mail para certificados@ubpct.com.br com seu nome completo e data de emissão.</p>
                </div>
                <div>
                  <h4 className="font-medium">Oferecem atendimento presencial?</h4>
                  <p className="text-gray-600">No momento, nosso atendimento é 100% virtual/remoto.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}