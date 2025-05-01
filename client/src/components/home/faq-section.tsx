import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const faqs: FAQ[] = [
    {
      question: "Quais são os requisitos para me associar à UBPCT?",
      answer: "Não há pré-requisitos específicos para se associar à UBPCT. A associação é aberta a profissionais e estudantes da área de saúde mental interessados em psicanálise e terapias. Basta preencher o cadastro e realizar o pagamento da assinatura mensal ou anual."
    },
    {
      question: "Como funciona o certificado após 12 meses?",
      answer: "Após 12 meses de assinatura adimplente, você receberá um certificado conforme sua formação. Associados graduados recebem certificado de Pós-Graduação em parceria com a Faculdade Dynamus de Campinas. Associados não-graduados recebem certificado de Formação Livre em Psicanálise Clínica e Terapêutica."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento através da sua área de associado. No entanto, para receber o certificado anual, é necessário completar 12 meses de assinatura adimplente."
    },
    {
      question: "Como funciona a supervisão clínica semanal?",
      answer: "As supervisões clínicas ocorrem semanalmente através de plataformas de videoconferência como Zoom ou Google Meet. Você poderá apresentar casos, discutir dúvidas e aprender com profissionais experientes. O link para participação é disponibilizado na área do associado e você receberá lembretes por e-mail."
    },
    {
      question: "A credencial digital tem validade legal?",
      answer: "A credencial digital da UBPCT serve como comprovante de filiação à nossa associação e pode ser utilizada para fins de identificação profissional. No entanto, ela não substitui registros profissionais específicos exigidos por lei para determinadas práticas."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl text-secondary mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre a UBPCT e o processo de associação.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                <AccordionTrigger className="p-4 text-left bg-gray-100 hover:bg-gray-200 transition duration-300 font-montserrat font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">Não encontrou o que procurava?</p>
            <Link href="/contact">
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-montserrat font-semibold px-6 py-3 h-auto">
                Entre em Contato
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
