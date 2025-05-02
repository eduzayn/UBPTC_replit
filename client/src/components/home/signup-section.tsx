import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { getPaymentLink } from "@/lib/asaas";

const signupFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  phone: z.string().min(10, {
    message: "Por favor, insira um telefone válido.",
  }),
  cpf: z.string().min(11, {
    message: "Por favor, insira um CPF válido.",
  }),
  occupation: z.string({
    required_error: "Por favor, selecione sua ocupação.",
  }),
  graduated: z.enum(["sim", "nao"], {
    required_error: "Por favor, indique se possui graduação.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  passwordConfirmation: z.string(),
  plan: z.enum(["monthly", "annual"], {
    required_error: "Por favor, selecione um plano.",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos para continuar." }),
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem.",
  path: ["passwordConfirmation"],
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupSection() {
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      occupation: "",
      graduated: "nao",
      password: "",
      passwordConfirmation: "",
      plan: "monthly",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Register user first
      const userResponse = await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        occupation: data.occupation,
        graduated: data.graduated === "sim",
        password: data.password,
        role: "member",
        subscription_status: "pending"
      });

      // If registration successful, redirect to payment
      if (userResponse) {
        setIsRedirecting(true);
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Redirecionando para o pagamento...",
        });

        // Get direct payment link (fixed link)
        const paymentLink = getPaymentLink(data.plan);
        
        // Redirect to payment page
        window.location.href = paymentLink;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro durante o cadastro. Por favor, tente novamente.",
        variant: "destructive",
      });
      setIsRedirecting(false);
    }
  };

  return (
    <section id="associe-se" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          <div className="lg:w-1/2">
            <h2 className="font-montserrat font-bold text-3xl text-secondary mb-4">
              Associe-se à UBPCT
            </h2>
            <p className="text-gray-600 mb-6">
              Torne-se membro da União Brasileira de Psicanálise Clínica e Terapêutica e tenha acesso a todos os benefícios exclusivos por apenas R$ 69,90 mensais.
            </p>
            
            <div className="bg-gray-100 rounded-lg p-6 mb-8">
              <h3 className="font-montserrat font-semibold text-xl mb-4">Como funciona?</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold mb-1">Preencha o cadastro</h4>
                    <p className="text-gray-600 text-sm">Complete o formulário ao lado com seus dados pessoais e profissionais.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold mb-1">Realize o pagamento</h4>
                    <p className="text-gray-600 text-sm">Efetue o pagamento da assinatura mensal de R$ 69,90 ou anual com 20% de desconto.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold mb-1">Acesse sua área restrita</h4>
                    <p className="text-gray-600 text-sm">Após a confirmação do pagamento, você terá acesso à área de associados.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold mb-1">Aproveite os benefícios</h4>
                    <p className="text-gray-600 text-sm">Credencial digital, ebooks, eventos, supervisão e muito mais.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-montserrat font-semibold text-xl mb-4">Certificação</h3>
              <p className="text-gray-600 mb-4">Após 12 meses como associado adimplente, você receberá:</p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="text-primary text-xl mt-1 mr-3">
                    🎓
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold">Para Graduados</h4>
                    <p className="text-gray-600 text-sm">Certificado de Pós-Graduação pela Faculdade Dynamus de Campinas.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-primary text-xl mt-1 mr-3">
                    🏅
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold">Para Não-Graduados</h4>
                    <p className="text-gray-600 text-sm">Certificado de Formação Livre em Psicanálise Clínica e Terapêutica.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="bg-gray-100 rounded-lg p-6 shadow-md">
              <h3 className="font-montserrat font-semibold text-xl mb-6 text-center">
                Opções de Associação
              </h3>
              
              <div className="mb-6 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-montserrat font-semibold text-lg">Plano Mensal</h4>
                    <span className="text-xl font-bold text-primary">R$ 49,90</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">Acesso a todos os benefícios com pagamento mensal recorrente</p>
                  <a href={getPaymentLink("monthly")} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Assinar Plano Mensal
                    </Button>
                  </a>
                </div>
                
                <div className="bg-primary/5 border border-primary p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-montserrat font-semibold text-lg">Plano Anual</h4>
                    <span className="text-xl font-bold text-primary">R$ 498,00</span>
                  </div>
                  <p className="text-primary text-sm font-semibold mb-1">Economize 17% (equivalente a 2 meses grátis)</p>
                  <p className="text-gray-600 mb-4 text-sm">Pagamento único anual com todos os benefícios inclusos</p>
                  <a href={getPaymentLink("annual")} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Assinar Plano Anual
                    </Button>
                  </a>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Ou preencha o formulário abaixo para criar sua conta primeiro</p>
              </div>
              
              <h3 className="font-montserrat font-semibold text-xl mb-6 text-center">
                Formulário de Associação
              </h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-sm font-semibold">
                              Nome Completo *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            E-mail *
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="w-full" />
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
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            Telefone *
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            CPF *
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            Ocupação *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="psicanalista">Psicanalista</SelectItem>
                              <SelectItem value="terapeuta">Terapeuta</SelectItem>
                              <SelectItem value="psicologo">Psicólogo</SelectItem>
                              <SelectItem value="estudante">Estudante</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="graduated"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-gray-700 text-sm font-semibold">
                              Possui graduação? *
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="graduated-yes" />
                                  <label htmlFor="graduated-yes" className="text-sm">Sim</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="graduated-no" />
                                  <label htmlFor="graduated-no" className="text-sm">Não</label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            Senha *
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passwordConfirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            Confirme a Senha *
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-montserrat font-semibold mb-3">Plano de Assinatura</h4>
                    <FormField
                      control={form.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-start p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem
                                  value="monthly"
                                  id="plan-monthly"
                                  className="mt-1 mr-3"
                                />
                                <div>
                                  <label htmlFor="plan-monthly" className="font-semibold cursor-pointer">
                                    Mensal - R$ 69,90
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    Cobrança mensal recorrente
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem
                                  value="annual"
                                  id="plan-annual"
                                  className="mt-1 mr-3"
                                />
                                <div>
                                  <label htmlFor="plan-annual" className="font-semibold cursor-pointer">
                                    Anual - R$ 671,04
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    20% de desconto (R$ 55,92/mês)
                                  </p>
                                </div>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel 
                            htmlFor="terms" 
                            className="text-sm text-gray-600 font-normal"
                          >
                            Concordo com os <Link href="/terms" className="text-primary hover:underline">termos de uso</Link> e{" "}
                            <Link href="/privacy" className="text-primary hover:underline">política de privacidade</Link>.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold py-3 h-auto"
                    disabled={isRedirecting || registerMutation.isPending}
                  >
                    {isRedirecting || registerMutation.isPending ? "Processando..." : "Associar-se Agora"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
