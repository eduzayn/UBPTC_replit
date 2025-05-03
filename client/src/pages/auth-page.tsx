import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Logo from "@/components/shared/logo";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
});

// Admin login form schema - mesmo schema que login regular
const adminLoginSchema = loginSchema;

type LoginFormValues = z.infer<typeof loginSchema>;
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

// Register form schema
const registerSchema = z.object({
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
  occupation: z.string().min(2, {
    message: "Por favor, insira sua ocupação.",
  }),
  graduated: z.boolean(),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem.",
  path: ["passwordConfirmation"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "admin">("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Redireciona para o painel administrativo se o usuário for admin
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Admin login form
  const adminLoginForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      occupation: "",
      graduated: false,
      password: "",
      passwordConfirmation: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onAdminLoginSubmit = (data: AdminLoginFormValues) => {
    // Não é necessário enviar isAdmin, o backend verificará por role=admin
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      occupation: data.occupation,
      graduated: data.graduated,
      password: data.password,
      role: "member",
      subscription_status: "pending"
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
          {/* Info Section */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="mb-8 flex items-center justify-center lg:justify-start">
              <Logo className="h-20 w-20" />
              <div className="ml-4">
                <h1 className="text-3xl font-bold">UBPCT</h1>
                <p className="text-md text-gray-600">
                  União Brasileira de Psicanálise Clínica e Terapêutica
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              Sua plataforma completa para desenvolvimento profissional
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Credencial Digital</h3>
                  <p className="text-gray-600">
                    Comprove sua filiação com nossa credencial digital com QR code de validação.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Biblioteca de Ebooks</h3>
                  <p className="text-gray-600">
                    Acesso a conteúdo exclusivo para sua formação e atualização profissional.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Certificado Anual</h3>
                  <p className="text-gray-600">
                    Após 12 meses, receba seu certificado de formação livre ou pós-graduação.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 italic">
                "A UBPCT transformou minha prática profissional. As supervisões semanais e os 
                ebooks disponíveis são fundamentais para meu desenvolvimento como psicanalista."
              </p>
              <p className="text-sm font-semibold mt-2">— Roberto Silva, Psicanalista</p>
            </div>
          </div>
          
          {/* Auth Forms */}
          <div className="lg:w-1/2">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Área do Associado</CardTitle>
                <CardDescription>
                  Faça login ou cadastre-se para acessar os benefícios exclusivos
                </CardDescription>
              </CardHeader>
              
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register" | "admin")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="login">Login Membro</TabsTrigger>
                  <TabsTrigger value="admin">Login Admin</TabsTrigger>
                  <TabsTrigger value="register">Cadastre-se</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
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
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Entrar
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-500 text-center">
                      Ainda não tem uma conta? {" "}
                      <Button 
                        variant="link" 
                        className="text-primary p-0 h-auto"
                        onClick={() => setActiveTab("register")}
                      >
                        Cadastre-se
                      </Button>
                    </p>
                  </CardFooter>
                </TabsContent>
                
                <TabsContent value="admin">
                  <CardContent>
                    <Form {...adminLoginForm}>
                      <form onSubmit={adminLoginForm.handleSubmit(onAdminLoginSubmit)} className="space-y-4">
                        <FormField
                          control={adminLoginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-mail administrativo</FormLabel>
                              <FormControl>
                                <Input placeholder="admin@ubpct.org" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={adminLoginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-slate-700 hover:bg-slate-800"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Acesso Administrativo
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="register">
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
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
                        
                        <FormField
                          control={registerForm.control}
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
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                  <Input placeholder="(11) 99999-9999" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="cpf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                  <Input placeholder="000.000.000-00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="occupation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ocupação</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Psicanalista" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="graduated"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-end space-x-2 h-full">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-2"
                                  />
                                </FormControl>
                                <FormLabel>Possui graduação?</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="passwordConfirmation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirme a Senha</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Cadastrar
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-500 text-center">
                      Já tem uma conta? {" "}
                      <Button 
                        variant="link" 
                        className="text-primary p-0 h-auto"
                        onClick={() => setActiveTab("login")}
                      >
                        Faça login
                      </Button>
                    </p>
                  </CardFooter>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
