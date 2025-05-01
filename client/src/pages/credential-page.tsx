import { useState } from "react";
import DigitalCredential from "@/components/members/digital-credential";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";

export default function CredentialPage() {
  const [activeTab, setActiveTab] = useState<string>("credential");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Credencial Digital</h1>
        <p className="text-gray-600">
          Sua credencial profissional da UBPCT com QR Code para validação
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="credential">Credencial</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>

        <TabsContent value="credential" className="space-y-6">
          <DigitalCredential />
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre a Credencial Digital</CardTitle>
              <CardDescription>
                Informações importantes sobre sua credencial UBPCT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="validity">
                  <AccordionTrigger>Validade da Credencial</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 mb-2">
                      Sua credencial digital da UBPCT tem validade de 1 ano a partir da data de emissão
                      ou da última renovação de assinatura.
                    </p>
                    <p className="text-gray-600">
                      Para manter sua credencial válida, é necessário estar com a assinatura em dia.
                      Em caso de inadimplência, a credencial é automaticamente suspensa até a regularização.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="qrcode">
                  <AccordionTrigger>QR Code de Validação</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 mb-2">
                      O QR Code presente em sua credencial permite a verificação da autenticidade e 
                      validade de sua filiação à UBPCT.
                    </p>
                    <p className="text-gray-600 mb-2">
                      Ao ser escaneado, o QR Code direciona para uma página de validação que confirma:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                      <li>Seu nome e ocupação</li>
                      <li>Status atual da credencial</li>
                      <li>Data de validade</li>
                    </ul>
                    <p className="text-gray-600">
                      Isso garante maior credibilidade profissional e segurança para seus clientes.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="download">
                  <AccordionTrigger>Download e Impressão</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 mb-2">
                      Você pode baixar sua credencial em formato PDF para impressão ou armazenamento
                      no seu dispositivo, facilitando a apresentação quando necessário.
                    </p>
                    <p className="text-gray-600">
                      Recomendamos salvar uma cópia digital em seu smartphone para fácil acesso.
                      Para impressão, utilize papel de boa qualidade para preservar o QR Code.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="legal">
                  <AccordionTrigger>Informações Legais</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 mb-2">
                      A credencial da UBPCT comprova sua filiação à nossa associação e pode ser utilizada
                      para fins de identificação profissional.
                    </p>
                    <p className="text-gray-600 mb-2">
                      Importante: Esta credencial não substitui registros profissionais específicos 
                      exigidos por lei para determinadas práticas (CRP, CRM, etc.). É um documento 
                      complementar que atesta sua vinculação à UBPCT.
                    </p>
                    <p className="text-gray-600">
                      O uso indevido da credencial ou sua falsificação está sujeito às penalidades legais cabíveis.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefícios da Credencial</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Credibilidade Profissional</h4>
                    <p className="text-gray-600">
                      Demonstre seu vínculo com uma instituição reconhecida na área da saúde mental.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Verificação Instantânea</h4>
                    <p className="text-gray-600">
                      QR Code permite validação rápida e segura de suas credenciais a qualquer momento.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Acesso a Convênios</h4>
                    <p className="text-gray-600">
                      Sua credencial pode ser utilizada para obter descontos e vantagens exclusivas junto aos nossos parceiros.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Reconhecimento Profissional</h4>
                    <p className="text-gray-600">
                      Aumenta sua visibilidade e reconhecimento no meio profissional da psicoanálise e terapias.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
