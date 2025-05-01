import { Check } from "lucide-react";

export default function CredentialShowcase() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="font-montserrat font-bold text-3xl text-secondary mb-4">
              Credencial Digital com QR Code
            </h2>
            <p className="text-gray-600 mb-6">
              Nossa credencial digital moderna permite que você comprove sua filiação à UBPCT de forma rápida e segura. O QR Code incorporado pode ser escaneado para validação em tempo real.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="text-primary mt-1 mr-2" />
                <span>Validação instantânea por QR Code</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary mt-1 mr-2" />
                <span>Credencial específica para sua ocupação</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary mt-1 mr-2" />
                <span>Disponível no portal ou para download em PDF</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary mt-1 mr-2" />
                <span>Atualização automática conforme status da associação</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-primary">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                    alt="Foto do Associado" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-montserrat font-bold text-xl text-center mb-1">
                  Ana Martins
                </h3>
                <p className="text-primary font-semibold text-center mb-3">
                  Psicanalista
                </p>
                <div className="w-32 h-32 mb-3 mx-auto">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://ubpct.org.br/validar/12345" 
                    alt="QR Code de validação" 
                    className="w-full h-full"
                  />
                </div>
                <p className="text-gray-500 text-sm text-center">
                  Credencial: <span className="font-semibold">12345</span>
                </p>
                <p className="text-gray-500 text-sm text-center">
                  Válida até: <span className="font-semibold">31/12/2023</span>
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="h-6">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMTIwIDMwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDEwQzAgNC40NzcxNSA0LjQ3NzE1IDAgMTAgMEgxMjBWMjBDMTIwIDI1LjUyMjkgMTE1LjUyMyAzMCAxMTAgMzBIMEwwIDEwWiIgZmlsbD0iIzIyMjIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjEyIj5VQlBDVDwvdGV4dD48Y2lyY2xlIGN4PSIzMCIgY3k9IjE1IiByPSI4IiBmaWxsPSIjMkJDQkRBIi8+PC9zdmc+" alt="Logo UBPCT" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
